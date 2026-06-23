<template>
  <div class="min-h-screen w-full flex flex-col">
    <AppHeader v-if="!isAdminRoute" />
    <div class="flex-1 pb-mobile-nav lg:pb-0">
      <RouterView />
    </div>
    <AppFooter v-if="!isAdminRoute" />

    <LoginModal v-if="!isAdminRoute" :open="loginOpen" @close="loginOpen = false" @logged-in="loginOpen = false" />
    <SubscribeModal v-if="!isAdminRoute" :open="subscribeOpen" @close="subscribeOpen = false" />

    <!-- Silent payment activation toast -->
    <Transition name="pay-toast">
      <div v-if="toastMsg" class="pay-toast-bar" :class="toastType">
        <svg v-if="toastType === 'success'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref as dbRef, remove } from 'firebase/database'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LoginModal from './components/LoginModal.vue'
import SubscribeModal from './components/SubscribeModal.vue'
import { loginOpen, subscribeOpen, toastMsg, toastType, showToast } from './store/ui'
import { pesapalGetToken, pesapalGetStatus } from './lib/pesapal'
import { activateSubscription, userSubscription, subLoading } from './store/subscription'
import { currentUser } from './store/auth'
import { db } from './lib/firebase'

const route = useRoute()
const router = useRouter()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// ── Shared: activate a pending order and clean up ────────────────────────
async function activatePendingOrder(
  pending: { orderTrackingId: string; planId: string; planName: string; amount: number; days: number; userId: string },
  status: { statusCode: number; paymentMethod: string; confirmationCode: string; paymentAccount: string; amount: number }
) {
  localStorage.removeItem('pendingSubscription')
  await activateSubscription(
    pending.userId,
    { id: pending.planId, name: pending.planName, price: pending.amount, days: pending.days },
    pending.orderTrackingId,
    status
  )
  // Clean up Firebase pendingOrders node so other sessions won't re-process
  try { await remove(dbRef(db, `pendingOrders/${pending.orderTrackingId}`)) } catch { /* ok */ }
}

// ── Guard: is this order already activated in Firebase? ───────────────────
function isAlreadyActivated(orderTrackingId: string): boolean {
  const sub = userSubscription.value
  return !!(sub && sub.orderTrackingId === orderTrackingId)
}

// ── Wait helpers ─────────────────────────────────────────────────────────
function waitForAuth(maxMs = 8000): Promise<void> {
  return new Promise((resolve) => {
    if (currentUser.value) return resolve()
    const timer = setInterval(() => { if (currentUser.value) { clearInterval(timer); resolve() } }, 200)
    setTimeout(() => { clearInterval(timer); resolve() }, maxMs)
  })
}

function waitForSubLoaded(maxMs = 5000): Promise<void> {
  return new Promise((resolve) => {
    if (!subLoading.value) return resolve()
    const timer = setInterval(() => { if (!subLoading.value) { clearInterval(timer); resolve() } }, 200)
    setTimeout(() => { clearInterval(timer); resolve() }, maxMs)
  })
}

// ── Handle PesaPal callback redirect (?pp_done=1) ────────────────────────
// PesaPal navigates the main window to callbackUrl after payment.
// We detect ?pp_done=1 here and activate immediately.
async function handlePpDoneCallback() {
  const params = new URLSearchParams(window.location.search)
  if (!params.has('pp_done')) return false

  // Clean URL immediately so refresh doesn't re-trigger
  router.replace({ path: '/', query: {} })

  const raw = localStorage.getItem('pendingSubscription')
  if (!raw) return true // URL handled but nothing to activate

  let pending: any
  try { pending = JSON.parse(raw) } catch { localStorage.removeItem('pendingSubscription'); return true }

  const { orderTrackingId, planId, planName, amount, days, userId } = pending
  if (!orderTrackingId) { localStorage.removeItem('pendingSubscription'); return true }

  await waitForAuth()
  await waitForSubLoaded()

  // Guard: already activated for this exact order
  if (isAlreadyActivated(orderTrackingId)) {
    localStorage.removeItem('pendingSubscription')
    return true
  }

  // Poll until confirmed (max 30 × 2s = 60s)
  let attempts = 0
  const check = async () => {
    attempts++
    try {
      const token = await pesapalGetToken()
      if (!token) { if (attempts < 30) setTimeout(check, 2000); return }

      if (isAlreadyActivated(orderTrackingId)) { localStorage.removeItem('pendingSubscription'); return }

      const status = await pesapalGetStatus(token, orderTrackingId)
      if (status?.statusCode === 1) {
        const uid = userId || currentUser.value?.uid
        if (!uid) return
        await activatePendingOrder({ orderTrackingId, planId, planName, amount, days, userId: uid }, status)
        showToast('Payment confirmed! Your subscription is now active.')
      } else if (status && (status.statusCode === 2 || status.statusCode === 3)) {
        localStorage.removeItem('pendingSubscription')
      } else if (attempts < 30) {
        setTimeout(check, 2000)
      }
    } catch { if (attempts < 30) setTimeout(check, 3000) }
  }
  await check()
  return true
}

// ── Background checker: runs silently on every load (not ?pp_done) ───────
// Detects payments that completed while the iframe was closed / page refreshed.
async function checkPendingPaymentSilently() {
  const raw = localStorage.getItem('pendingSubscription')
  if (!raw) return

  let pending: any
  try { pending = JSON.parse(raw) } catch { localStorage.removeItem('pendingSubscription'); return }

  const { orderTrackingId, planId, planName, amount, days, userId } = pending
  if (!orderTrackingId || !userId) { localStorage.removeItem('pendingSubscription'); return }

  // Wait for auth
  await waitForAuth(10000)

  // Must be the same user who initiated this payment
  if (!currentUser.value || currentUser.value.uid !== userId) return

  // Wait for subscription data from Firebase
  await waitForSubLoaded(6000)

  // Guard: this exact order already activated → just clean up
  if (isAlreadyActivated(orderTrackingId)) {
    localStorage.removeItem('pendingSubscription')
    return
  }

  // Silent background polling: every 5s, up to 36 attempts (~3 min total)
  let attempts = 0
  let cancelled = false

  const poll = async () => {
    if (cancelled) return
    attempts++
    if (attempts > 36) {
      // Timed out waiting — remove stale pending (payment took too long or truly failed)
      localStorage.removeItem('pendingSubscription')
      return
    }

    try {
      // Re-check guard before each API call (another tab / session may have activated)
      if (isAlreadyActivated(orderTrackingId)) {
        localStorage.removeItem('pendingSubscription')
        cancelled = true
        return
      }

      const token = await pesapalGetToken()
      if (!token) { setTimeout(poll, 10000); return }

      const status = await pesapalGetStatus(token, orderTrackingId)
      if (!status) { setTimeout(poll, 6000); return }

      if (status.statusCode === 1) {
        // Payment was successful — activate silently
        cancelled = true
        await activatePendingOrder({ orderTrackingId, planId, planName, amount, days, userId }, status)
        showToast('Payment confirmed! Your subscription is now active.')
      } else if (status.statusCode === 2 || status.statusCode === 3) {
        // Payment definitively failed or reversed
        cancelled = true
        localStorage.removeItem('pendingSubscription')
      } else {
        // Still pending (statusCode 0 or -1) — keep checking
        setTimeout(poll, 5000)
      }
    } catch {
      // Network hiccup — back off and try again
      if (!cancelled) setTimeout(poll, 8000)
    }
  }

  // Short initial delay so the page fully loads before hitting PesaPal API
  setTimeout(poll, 4000)
}

onMounted(async () => {
  // ── Global right-click + DevTools protection ──────────────
  document.addEventListener('contextmenu', (e) => e.preventDefault())
  document.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey
    if (
      e.key === 'F12' ||
      (ctrl && e.shiftKey && ['I','J','C'].includes(e.key.toUpperCase())) ||
      (ctrl && e.key.toUpperCase() === 'U')
    ) { e.preventDefault(); e.stopPropagation() }
  }, true)

  // Handle ?pp_done=1 callback first (PesaPal redirect after payment)
  const wasPpDone = await handlePpDoneCallback()

  // Only run background checker if this is NOT a PesaPal redirect
  // (the redirect handler already covers that case)
  if (!wasPpDone) {
    checkPendingPaymentSilently() // intentionally not awaited — runs in background
  }
})
</script>

<style>
/* Payment activation toast */
.pay-toast-bar {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 40px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 8px 28px rgba(0,0,0,0.5);
}
.pay-toast-bar.success {
  background: rgba(0,255,157,0.14);
  border: 1px solid rgba(0,255,157,0.35);
  color: #00ff9d;
}
.pay-toast-bar.info {
  background: rgba(0,180,255,0.12);
  border: 1px solid rgba(0,180,255,0.3);
  color: #00c8ff;
}
.pay-toast-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.pay-toast-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.pay-toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
.pay-toast-leave-to   { opacity: 0; transform: translateX(-50%) translateY(-6px); }
</style>
