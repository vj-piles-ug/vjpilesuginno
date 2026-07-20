<template>
  <Transition name="install-prompt">
    <div v-if="visible" class="install-prompt">
      <div class="install-icon">
        <img src="/favicon.svg" alt="VJ Piles UG" class="install-logo" @error="logoErr = true" />
        <div v-if="logoErr" class="install-logo-fallback">▶</div>
      </div>
      <div class="install-text">
        <p class="install-title">Install VJ Piles UG</p>
        <p class="install-sub">Add to home screen for quick access</p>
      </div>
      <button class="install-btn" @click="doInstall">Install</button>
      <button class="install-close" @click="dismiss" aria-label="Close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <!-- countdown ring -->
      <svg class="countdown-ring" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"/>
        <circle
          cx="18" cy="18" r="15" fill="none"
          stroke="#00ff9d" stroke-width="3"
          stroke-dasharray="94.25"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
          transform="rotate(-90 18 18)"
          style="transition: stroke-dashoffset 1s linear"
        />
      </svg>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const STORAGE_KEY = 'vjpiles_install_dismissed'
const DURATION = 5 // seconds

const visible = ref(false)
const logoErr = ref(false)
const dashOffset = ref(0) // 0 = full circle

let deferredPrompt: any = null
let timer: ReturnType<typeof setTimeout> | null = null
let tickInterval: ReturnType<typeof setInterval> | null = null
let secondsLeft = DURATION
const circumference = 94.25 // 2 * π * 15

function dismiss() {
  visible.value = false
  localStorage.setItem(STORAGE_KEY, '1')
  if (timer) clearTimeout(timer)
  if (tickInterval) clearInterval(tickInterval)
}

async function doInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') localStorage.setItem(STORAGE_KEY, '1')
    deferredPrompt = null
  }
  dismiss()
}

function startCountdown() {
  secondsLeft = DURATION
  dashOffset.value = 0

  // Tick every second to update the ring
  tickInterval = setInterval(() => {
    secondsLeft -= 1
    dashOffset.value = circumference * (1 - secondsLeft / DURATION)
    if (secondsLeft <= 0) {
      if (tickInterval) clearInterval(tickInterval)
    }
  }, 1000)

  timer = setTimeout(() => {
    dismiss()
  }, DURATION * 1000)
}

function handleBeforeInstall(e: Event) {
  e.preventDefault()
  deferredPrompt = e
}

onMounted(() => {
  // Only show on first visit
  if (localStorage.getItem(STORAGE_KEY)) return

  window.addEventListener('beforeinstallprompt', handleBeforeInstall)

  // Show after a brief delay so the page settles first
  setTimeout(() => {
    visible.value = true
    startCountdown()
  }, 800)
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  if (timer) clearTimeout(timer)
  if (tickInterval) clearInterval(tickInterval)
})
</script>

<style scoped>
.install-prompt {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(10, 18, 28, 0.97);
  border: 1px solid rgba(0, 255, 157, 0.25);
  border-radius: 16px;
  padding: 12px 14px 12px 12px;
  width: min(380px, calc(100vw - 32px));
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(0,255,157,0.08);
  backdrop-filter: blur(20px);
}

/* logo */
.install-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(0,255,157,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.install-logo { width: 100%; height: 100%; object-fit: cover; }
.install-logo-fallback { font-size: 1.4rem; color: #00ff9d; }

/* text */
.install-text { flex: 1; min-width: 0; }
.install-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.install-sub {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.45);
  margin: 0;
}

/* install button */
.install-btn {
  flex-shrink: 0;
  background: linear-gradient(135deg, #00ff9d, #00c8b8);
  color: #021a10;
  border: none;
  border-radius: 8px;
  padding: 7px 14px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: filter 0.15s;
}
.install-btn:hover { filter: brightness(1.1); }

/* close */
.install-close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.install-close:hover { color: rgba(255,255,255,0.8); }

/* countdown ring */
.countdown-ring {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
}

/* enter / leave transitions */
.install-prompt-enter-active { animation: slide-up 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.install-prompt-leave-active { animation: slide-down 0.25s ease-in forwards; }

@keyframes slide-up {
  from { opacity: 0; transform: translateX(-50%) translateY(24px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}
@keyframes slide-down {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to   { opacity: 0; transform: translateX(-50%) translateY(16px); }
}

@media (max-width: 400px) {
  .install-prompt { bottom: 70px; }
}
</style>
