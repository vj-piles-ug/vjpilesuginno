<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" :class="{ 'modal-backdrop--paying': step === 'paying' }" @click.self="maybeClose">
        <div class="modal-box" :class="{ 'modal-box--paying': step === 'paying' }">
          <button v-if="step !== 'paying'" class="modal-close" @click="maybeClose">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- STEP: plan selection -->
          <template v-if="step === 'plans'">
            <div class="modal-header-row">
              <img src="/logo.png" alt="" class="hdr-logo" />
              <div>
                <h2 class="hdr-title">Subscribe to Download</h2>
                <p class="hdr-sub">Unlimited HD downloads · Powered by PesaPal</p>
              </div>
            </div>
            <div class="plan-grid">
              <div v-for="plan in PLANS" :key="plan.id" class="plan-card" :class="{ popular: plan.popular }">
                <div v-if="plan.popular" class="popular-badge">POPULAR</div>
                <p class="plan-name">{{ plan.name }}</p>
                <div class="plan-price-row">
                  <span class="plan-price">{{ plan.price.toLocaleString() }}</span>
                  <span class="plan-ugx">UGX</span>
                </div>
                <p class="plan-period">{{ plan.duration }}</p>
                <p class="plan-feature">Unlimited Downloads</p>
                <button class="plan-sub-btn" @click="pickPlan(plan.id)">Subscribe to Download</button>
              </div>
            </div>
            <p class="footer-note">Secure payment via PesaPal · MTN / Airtel / Visa</p>
          </template>

          <!-- STEP: phone input -->
          <template v-else-if="step === 'phone'">
            <button class="back-btn" @click="step = 'plans'">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>
            <div class="pay-header">
              <h2 class="hdr-title">{{ activePlan?.name }}</h2>
              <p class="hdr-sub">{{ activePlan?.price.toLocaleString() }} UGX · {{ activePlan?.duration }}</p>
            </div>
            <div class="field">
              <label class="field-label">Phone number</label>
              <input v-model="phoneInput" class="field-input" placeholder="e.g. 0771234567" type="tel" @keyup.enter="startPayment" />
            </div>
            <p v-if="errMsg" class="err-msg">{{ errMsg }}</p>
            <button class="pay-btn" :disabled="!phoneInput.trim()" @click="startPayment">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              PROCEED TO PAYMENT
            </button>
            <p class="footer-note">You'll be taken to a secure PesaPal payment page</p>
          </template>

          <!-- STEP: PesaPal payment iframe (shows immediately, loads URL in background) -->
          <template v-else-if="step === 'paying'">
            <div class="pp-header">
              <button class="pp-back-btn" @click="maybeClose">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
              <div class="pp-secure-label">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure Payment
              </div>
            </div>
            <!-- Inline spinner while PesaPal URL is being prepared -->
            <div v-if="iframeLoading" class="iframe-preparing">
              <div class="spinner"></div>
              <p class="iframe-prep-text">Connecting to PesaPal…</p>
            </div>
            <iframe
              v-else-if="iframeUrl"
              :src="iframeUrl"
              class="pay-iframe"
              frameborder="0"
              allow="payment"
              scrolling="yes"
            ></iframe>
            <div class="pp-status-bar">
              <div class="pp-waiting">
                <div class="pulse-dot"></div>
                {{ iframeLoading ? 'Preparing payment…' : 'Waiting for payment…' }}
              </div>
              <div class="pp-plan-label">{{ activePlan?.name }}</div>
              <div class="pp-amount">UGX {{ activePlan?.price.toLocaleString() }}</div>
            </div>
          </template>

          <!-- STEP: success -->
          <template v-else-if="step === 'success'">
            <div class="center-state">
              <div class="success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 class="hdr-title mt-3">Payment Successful!</h2>
              <p class="center-sub mt-1">Your subscription is now active. Enjoy unlimited downloads!</p>
              <button class="pay-btn mt-4" @click="$emit('close')">START DOWNLOADING</button>
            </div>
          </template>

          <!-- STEP: failed -->
          <template v-else-if="step === 'failed'">
            <div class="center-state">
              <div class="fail-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </div>
              <h2 class="hdr-title mt-3">Payment Failed</h2>
              <p class="center-sub mt-1">{{ errMsg || 'The payment was not completed. Please try again.' }}</p>
              <button class="pay-btn pay-btn--retry mt-4" @click="retry">TRY AGAIN</button>
            </div>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import { set as dbSet, ref as dbRef, push as dbPush } from 'firebase/database'
import { db } from '../lib/firebase'
import { useAuth } from '../store/auth'
import { activateSubscription } from '../store/subscription'
import {
  pesapalGetToken,
  pesapalRegisterIPN,
  pesapalSubmitOrder,
  pesapalGetStatus,
} from '../lib/pesapal'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const { currentUser } = useAuth()

type Step = 'plans' | 'phone' | 'paying' | 'success' | 'failed'
const step = ref<Step>('plans')
const selectedPlanId = ref<string | null>(null)
const phoneInput = ref('')
const iframeUrl = ref('')
const iframeLoading = ref(false)
const errMsg = ref('')
let pollTimer: ReturnType<typeof setInterval> | null = null
let authToken = ''
let trackingId = ''

const PLANS = [
  { id: '2days',  name: '2 Days Pass',  duration: '2 Days',  price: 5000,  days: 2,  popular: false },
  { id: '1week',  name: '1 Week Pass',  duration: '1 Week',  price: 15000, days: 7,  popular: true  },
  { id: '2weeks', name: '2 Weeks Pass', duration: '2 Weeks', price: 25000, days: 14, popular: false },
  { id: '1month', name: '1 Month Pass', duration: '1 Month', price: 40000, days: 30, popular: false },
]

const activePlan = computed(() => PLANS.find(p => p.id === selectedPlanId.value))

watch(() => props.open, (v) => {
  if (!v) { stopPolling(); resetToPlans() }
})

onUnmounted(() => stopPolling())

function resetToPlans() {
  step.value = 'plans'
  phoneInput.value = ''
  iframeUrl.value = ''
  iframeLoading.value = false
  errMsg.value = ''
  authToken = ''
  trackingId = ''
}

function pickPlan(id: string) {
  selectedPlanId.value = id
  step.value = 'phone'
  errMsg.value = ''
}

function maybeClose() {
  if (step.value === 'paying') return
  emit('close')
}

function retry() {
  stopPolling()
  step.value = 'phone'
  errMsg.value = ''
  iframeUrl.value = ''
}

function normalizePhone(raw: string): string {
  const cleaned = raw.replace(/[\s\-()]/g, '')
  if (cleaned.startsWith('+256')) return cleaned
  if (cleaned.startsWith('256')) return '+' + cleaned
  if (cleaned.startsWith('0')) return '+256' + cleaned.slice(1)
  return '+256' + cleaned
}

async function startPayment() {
  if (!phoneInput.value.trim() || !activePlan.value) return
  const plan = activePlan.value
  const user = currentUser.value
  if (!user) return

  // Show the payment frame immediately with a loading spinner inside
  step.value = 'paying'
  iframeLoading.value = true
  iframeUrl.value = ''
  errMsg.value = ''

  const normalizedPhone = normalizePhone(phoneInput.value.trim())

  try {
    const token = await pesapalGetToken()
    if (!token) throw new Error('Could not connect to PesaPal. Check your internet and try again.')
    authToken = token

    const origin = window.location.origin
    const ipnUrl = `${origin}/api/pesapal-ipn`
    const ipnId = await pesapalRegisterIPN(token, ipnUrl)
    if (!ipnId) throw new Error('Failed to register payment notification. Please try again.')

    const order = await pesapalSubmitOrder(token, ipnId, {
      amount: plan.price,
      description: `VJ PILES UG - ${plan.name}`,
      email: user.email || '',
      phone: phoneInput.value.trim(),
      firstName: user.displayName?.split(' ')[0] || 'Customer',
      lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
      callbackUrl: `${origin}/?pp_done=1`,
      cancellationUrl: `${origin}/`,
    })
    if (!order) throw new Error('Failed to create payment order. Please try again.')

    trackingId = order.orderTrackingId

    // Save phone to user profile so wallet page can detect it
    await dbSet(dbRef(db, `users/${user.uid}/phone`), normalizedPhone)

    await dbPush(dbRef(db, 'paymentLogs'), {
      userId: user.uid,
      email: user.email || '',
      phone: normalizedPhone,
      planName: plan.name,
      planId: plan.id,
      amount: plan.price,
      orderTrackingId: order.orderTrackingId,
      merchantReference: order.merchantReference,
      paymentMethod: 'PesaPal',
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    await dbSet(dbRef(db, `pendingOrders/${order.orderTrackingId}`), {
      userId: user.uid,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      days: plan.days,
      merchantReference: order.merchantReference,
      createdAt: new Date().toISOString(),
    })

    localStorage.setItem('pendingSubscription', JSON.stringify({
      orderTrackingId: order.orderTrackingId,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      days: plan.days,
      userId: user.uid,
    }))

    iframeUrl.value = order.redirectUrl
    iframeLoading.value = false
    startPolling(token, order.orderTrackingId, user.uid, plan)

  } catch (e: any) {
    iframeLoading.value = false
    errMsg.value = e.message || 'Something went wrong. Please try again.'
    step.value = 'failed'
  }
}

function startPolling(
  token: string,
  tId: string,
  userId: string,
  plan: typeof PLANS[0]
) {
  stopPolling()
  let attempts = 0
  let fetching = false
  pollTimer = setInterval(async () => {
    if (fetching) return
    attempts++
    if (attempts > 200) { stopPolling(); return }

    fetching = true
    try {
      const status = await pesapalGetStatus(token, tId)
      if (!status) return

      if (status.statusCode === 1) {
        stopPolling()
        await activateSubscription(userId, plan, tId, status)
        localStorage.removeItem('pendingSubscription')
        step.value = 'success'
        // Auto-close after 2 seconds
        setTimeout(() => emit('close'), 2000)
      } else if (status.statusCode === 2 || status.statusCode === 3) {
        stopPolling()
        localStorage.removeItem('pendingSubscription')
        errMsg.value = status.statusCode === 3 ? 'Payment was reversed.' : 'Payment failed. Please try again.'
        step.value = 'failed'
      }
    } catch { /* network hiccup, keep polling */ } finally {
      fetching = false
    }
  }, 1500)
}

function stopPolling() {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.85); backdrop-filter: blur(16px);
}
/* When paying: remove padding so iframe modal can go edge-to-edge on mobile */
.modal-backdrop--paying {
  padding: 0;
  align-items: stretch;
}
.modal-box {
  position: relative; width: 100%; max-width: 360px;
  border-radius: 18px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(8,14,12,0.99); padding: 18px 16px 16px;
  box-shadow: 0 28px 64px rgba(0,0,0,0.7);
  max-height: 90vh; overflow-y: auto;
  transition: max-width 0.3s ease;
}
.modal-box--paying {
  max-width: 100%;
  padding: 0;
  overflow: hidden;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  height: 100dvh;
  max-height: 100dvh;
}
/* On larger screens, restore floating modal look */
@media (min-width: 600px) {
  .modal-backdrop--paying {
    padding: 16px;
    align-items: center;
  }
  .modal-box--paying {
    max-width: 420px;
    border-radius: 16px;
    height: min(92vh, 700px);
    max-height: min(92vh, 700px);
  }
}

.modal-close {
  position: absolute; top: 12px; right: 12px;
  width: 24px; height: 24px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.45); cursor: pointer; transition: background 0.15s;
  z-index: 2;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.modal-header-row { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.hdr-logo { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.hdr-title { font-size: 0.9rem; font-weight: 800; color: #fff; line-height: 1.1; }
.hdr-sub { font-size: 0.63rem; color: rgba(255,255,255,0.36); margin-top: 1px; }

/* 2x2 plan grid */
.plan-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 7px; margin-bottom: 12px;
}
.plan-card {
  position: relative; border-radius: 11px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  padding: 10px 8px 9px; display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.plan-card.popular { border-color: rgba(0,255,157,0.28); background: rgba(0,255,157,0.04); }
.popular-badge {
  position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #021a10; font-size: 0.48rem; font-weight: 800;
  letter-spacing: 0.08em; padding: 1px 7px; border-radius: 99px; white-space: nowrap;
}
.plan-name { font-size: 0.7rem; font-weight: 800; color: #fff; text-align: center; margin-top: 4px; }
.plan-price-row { display: flex; align-items: baseline; gap: 2px; }
.plan-price { font-size: 1.05rem; font-weight: 800; color: #fff; line-height: 1; }
.plan-ugx { font-size: 0.5rem; font-weight: 700; color: rgba(0,255,157,0.7); }
.plan-period { font-size: 0.54rem; color: rgba(255,255,255,0.3); }
.plan-feature { font-size: 0.55rem; color: rgba(0,255,157,0.6); font-weight: 600; }
.plan-sub-btn {
  width: 100%; margin-top: 5px; padding: 5px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8);
  color: #021a10; font-size: 0.58rem; font-weight: 800; letter-spacing: 0.05em;
  border: none; border-radius: 7px; cursor: pointer; transition: filter 0.2s;
}
.plan-sub-btn:hover { filter: brightness(1.08); }

/* Phone step */
.back-btn { display: flex; align-items: center; gap: 4px; background: none; border: none; color: rgba(255,255,255,0.38); font-size: 0.68rem; cursor: pointer; padding: 0; margin-bottom: 10px; transition: color 0.15s; }
.back-btn:hover { color: rgba(255,255,255,0.75); }
.pay-header { margin-bottom: 12px; }

.field { margin-bottom: 10px; }
.field-label { display: block; font-size: 0.63rem; font-weight: 600; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
.field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; color: #fff; font-size: 0.88rem; padding: 9px 12px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.field-input:focus { border-color: rgba(0,255,157,0.38); }

.pay-btn {
  width: 100%; padding: 11px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em;
  border: none; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  box-shadow: 0 8px 22px rgba(0,255,157,0.22); margin-bottom: 8px;
  transition: filter 0.2s, opacity 0.2s;
}
.pay-btn:hover { filter: brightness(1.06); }
.pay-btn:disabled { opacity: 0.38; cursor: not-allowed; filter: none; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.38); box-shadow: none; }
.pay-btn--retry { background: linear-gradient(135deg, #f87171, #ef4444); box-shadow: 0 8px 22px rgba(248,113,113,0.2); }
.pay-btn.mt-4 { margin-top: 12px; }

.err-msg { font-size: 0.65rem; color: #f87171; margin-bottom: 8px; text-align: center; }
.footer-note { text-align: center; font-size: 0.59rem; color: rgba(255,255,255,0.2); }

/* Loading / center states */
.center-state { display: flex; flex-direction: column; align-items: center; padding: 24px 0 8px; }
.spinner { width: 36px; height: 36px; border: 3px solid rgba(0,255,157,0.15); border-top-color: #00ff9d; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 14px; }
@keyframes spin { to { transform: rotate(360deg); } }
.center-title { font-size: 0.88rem; font-weight: 700; color: #fff; }
.center-sub { font-size: 0.68rem; color: rgba(255,255,255,0.38); margin-top: 4px; text-align: center; }
.mt-1 { margin-top: 4px; }
.mt-3 { margin-top: 10px; }

/* Inline preparing state (shown instead of iframe while URL loads) */
.iframe-preparing {
  flex: 1;
  height: 0;
  min-height: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.iframe-prep-text {
  font-size: 0.75rem;
  color: rgba(0,0,0,0.45);
  font-weight: 600;
}
.iframe-preparing .spinner {
  border-color: rgba(0,200,100,0.2);
  border-top-color: #00c864;
}

/* Payment iframe step */
.pp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 12px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  background: rgba(8,14,12,0.98);
}
.pp-back-btn {
  display: flex; align-items: center; gap: 4px;
  background: none; border: none; color: rgba(255,255,255,0.45);
  font-size: 0.68rem; cursor: pointer; padding: 0;
  transition: color 0.15s;
}
.pp-back-btn:hover { color: rgba(255,255,255,0.8); }
.pp-secure-label {
  display: flex; align-items: center; gap: 4px;
  font-size: 0.62rem; font-weight: 600;
  color: rgba(0,255,157,0.75); letter-spacing: 0.03em;
}
.pay-iframe {
  width: 100%;
  flex: 1;
  height: 0;
  min-height: 0;
  border: none;
  background: #fff;
  display: block;
  overflow: hidden;
}
.pp-status-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; gap: 8px;
  background: rgba(8,14,12,0.98);
  border-top: 1px solid rgba(255,255,255,0.07);
}
.pp-waiting {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.6rem; color: rgba(0,255,157,0.75); font-weight: 600; white-space: nowrap;
}
.pp-plan-label {
  font-size: 0.6rem; color: rgba(255,255,255,0.4);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; text-align: center;
}
.pp-amount {
  font-size: 0.68rem; font-weight: 800; color: #fff; white-space: nowrap;
}
.pulse-dot { width: 7px; height: 7px; border-radius: 50%; background: #00ff9d; animation: pulse 1.4s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Success / failure icons */
.success-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(0,255,157,0.1); border: 2px solid rgba(0,255,157,0.3); display: flex; align-items: center; justify-content: center; }
.fail-icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(248,113,113,0.1); border: 2px solid rgba(248,113,113,0.3); display: flex; align-items: center; justify-content: center; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s ease; }
.modal-enter-from .modal-box { transform: scale(0.96) translateY(8px); }
.modal-leave-to .modal-box { transform: scale(0.98) translateY(5px); }
</style>
