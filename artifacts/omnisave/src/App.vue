<template>
  <div class="min-h-screen w-full flex flex-col">
    <AppHeader v-if="!isAdminRoute" />
    <div class="flex-1">
      <RouterView />
    </div>
    <AppFooter v-if="!isAdminRoute" />

    <LoginModal v-if="!isAdminRoute" :open="loginOpen" @close="loginOpen = false" @logged-in="loginOpen = false" />
    <SubscribeModal v-if="!isAdminRoute" :open="subscribeOpen" @close="subscribeOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LoginModal from './components/LoginModal.vue'
import SubscribeModal from './components/SubscribeModal.vue'
import { loginOpen, subscribeOpen } from './store/ui'
import { pesapalGetToken, pesapalGetStatus } from './lib/pesapal'
import { activateSubscription } from './store/subscription'
import { currentUser } from './store/auth'

const route = useRoute()
const router = useRouter()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Handle PesaPal callback redirect (?pp_done=1)
// When redirect_mode=PARENT_WINDOW, PesaPal navigates the main window to
// callbackUrl after payment. We detect that here and immediately activate.
onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  if (!params.has('pp_done')) return

  // Clean URL immediately so refresh doesn't re-trigger
  router.replace({ path: '/', query: {} })

  const pending = localStorage.getItem('pendingSubscription')
  if (!pending) return

  try {
    const { orderTrackingId, planId, planName, amount, days, userId } = JSON.parse(pending)
    if (!orderTrackingId) return

    // Wait for auth to be ready (max 5s)
    await new Promise<void>((resolve) => {
      if (currentUser.value) return resolve()
      const stop = setInterval(() => {
        if (currentUser.value) { clearInterval(stop); resolve() }
      }, 200)
      setTimeout(() => { clearInterval(stop); resolve() }, 5000)
    })

    const token = await pesapalGetToken()
    if (!token) return

    // Poll until confirmed (max 30 attempts × 2s = 60s)
    let attempts = 0
    const check = async () => {
      attempts++
      const status = await pesapalGetStatus(token, orderTrackingId)
      if (status?.statusCode === 1) {
        localStorage.removeItem('pendingSubscription')
        const uid = userId || currentUser.value?.uid
        if (!uid) return
        await activateSubscription(uid, { id: planId, name: planName, price: amount, days }, orderTrackingId, status)
      } else if (status && (status.statusCode === 2 || status.statusCode === 3)) {
        localStorage.removeItem('pendingSubscription')
      } else if (attempts < 30) {
        setTimeout(check, 2000)
      }
    }
    await check()
  } catch (_) {}
})
</script>
