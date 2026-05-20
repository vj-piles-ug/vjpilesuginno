<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box" :class="{ 'modal-box--wide': step === 2 }">
          <button class="modal-close" @click="$emit('close')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- STEP 1: LOGIN / REGISTER -->
          <template v-if="step === 1">
            <div class="modal-brand">
              <img src="/logo.png" alt="VJ Piles UG" class="modal-logo" />
              <div class="brand-text-block">
                <span class="brand-name">VJ PILES UG<span class="brand-dot">.COM</span></span>
              </div>
            </div>
            <h2 class="modal-heading">{{ isRegister ? 'Create Account' : 'Sign in' }}</h2>
            <p class="modal-sub">{{ isRegister ? 'Join to access downloads & subscription' : 'Access downloads & subscription' }}</p>

            <button class="google-btn" @click="handleGoogle" :disabled="loading">
              <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div class="divider"><span>or</span></div>

            <form @submit.prevent="handleSubmit">
              <div v-if="isRegister" class="field">
                <input v-model="name" type="text" placeholder="Full name" class="field-input" required />
              </div>
              <div class="field">
                <input v-model="email" type="email" placeholder="Email address" class="field-input" required />
              </div>
              <div class="field">
                <input v-model="password" type="password" placeholder="Password" class="field-input" required minlength="6" />
              </div>
              <p v-if="errorMsg" class="err-msg">{{ errorMsg }}</p>
              <button type="submit" class="submit-btn" :disabled="loading">
                {{ loading ? 'Please wait...' : (isRegister ? 'CREATE ACCOUNT' : 'SIGN IN') }}
              </button>
            </form>

            <p class="footer-note">
              {{ isRegister ? 'Already have an account?' : 'No account?' }}
              <a href="#" class="link" @click.prevent="isRegister = !isRegister">
                {{ isRegister ? 'Sign in' : 'Register now' }}
              </a>
            </p>
          </template>

          <!-- STEP 2: SUBSCRIPTION PLANS -->
          <template v-else>
            <div class="step2-top">
              <button class="back-btn" @click="step = 1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div class="modal-brand" style="margin-bottom:0">
                <img src="/logo.png" alt="VJ Piles UG" class="modal-logo" />
                <div class="brand-text-block">
                  <span class="brand-name">VJ PILES UG<span class="brand-dot">.COM</span></span>
                </div>
              </div>
            </div>
            <h2 class="modal-heading" style="margin-top:10px">Choose a Plan</h2>
            <p class="modal-sub">UGX · Access HD downloads</p>
            <div class="plans-grid">
              <div
                v-for="plan in plans"
                :key="plan.id"
                class="plan-card"
                :class="{ selected: selectedPlan === plan.id, popular: plan.popular }"
                @click="selectedPlan = plan.id"
              >
                <div v-if="plan.popular" class="popular-badge">BEST</div>
                <div class="plan-radio-row">
                  <div class="plan-radio" :class="{ active: selectedPlan === plan.id }">
                    <div v-if="selectedPlan === plan.id" class="plan-radio-dot"></div>
                  </div>
                </div>
                <p class="plan-name">{{ plan.name }}</p>
                <div class="plan-price-block">
                  <span class="plan-price">{{ plan.price.toLocaleString() }}</span>
                  <span class="plan-currency">UGX</span>
                </div>
              </div>
            </div>
            <button class="subscribe-btn" @click="$emit('close')">SUBSCRIBE</button>
            <p class="footer-note" style="margin-top:10px">Secure payment · UGX</p>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuth } from '../store/auth'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['close', 'loggedIn'])

const { signInEmail, signUpEmail, signInGoogle } = useAuth()

const step = ref(1)
const isRegister = ref(false)
const email = ref('')
const password = ref('')
const name = ref('')
const loading = ref(false)
const errorMsg = ref('')
const selectedPlan = ref<string>('2days')

watch(() => props.open, (v) => {
  if (!v) {
    step.value = 1
    isRegister.value = false
    email.value = ''
    password.value = ''
    name.value = ''
    errorMsg.value = ''
    loading.value = false
  }
})

const plans = [
  { id: '1day',   name: '1 Day',    price: 2000,  popular: false },
  { id: '2days',  name: '2 Days',   price: 5000,  popular: true },
  { id: '1week',  name: '1 Week',   price: 10000, popular: false },
  { id: '2weeks', name: '2 Weeks',  price: 15000, popular: false },
  { id: '1month', name: '1 Month',  price: 25000, popular: false },
]

async function handleSubmit() {
  errorMsg.value = ''
  loading.value = true
  try {
    if (isRegister.value) {
      await signUpEmail(email.value, password.value, name.value)
    } else {
      await signInEmail(email.value, password.value)
    }
    emit('loggedIn')
    emit('close')
  } catch (e: any) {
    errorMsg.value = friendlyError(e.code)
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  errorMsg.value = ''
  loading.value = true
  try {
    await signInGoogle()
    emit('loggedIn')
    emit('close')
  } catch (e: any) {
    errorMsg.value = friendlyError(e.code)
  } finally {
    loading.value = false
  }
}

function friendlyError(code: string): string {
  const map: Record<string, string> = {
    'auth/user-not-found': 'No account with that email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'Email already registered.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/popup-closed-by-user': 'Sign-in cancelled.',
  }
  return map[code] || 'Something went wrong. Please try again.'
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.84); backdrop-filter: blur(18px);
}
.modal-box {
  position: relative; width: 100%; max-width: 296px;
  border-radius: 18px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(7,13,10,0.99); padding: 18px;
  box-shadow: 0 24px 56px rgba(0,0,0,0.72);
  max-height: 90vh; overflow-y: auto;
  transition: max-width 0.25s ease;
}
.modal-box--wide { max-width: 440px; }
.modal-close {
  position: absolute; top: 11px; right: 11px;
  width: 22px; height: 22px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); cursor: pointer;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
.step2-top { display: flex; align-items: center; gap: 8px; }
.back-btn {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); cursor: pointer;
}
.modal-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.modal-logo { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.brand-text-block { display: flex; flex-direction: column; }
.brand-name { font-size: 0.72rem; font-weight: 800; color: #fff; }
.brand-dot { color: #00ff9d; }
.modal-heading { font-size: 0.98rem; font-weight: 800; color: #fff; margin-bottom: 3px; }
.modal-sub { font-size: 0.65rem; color: rgba(255,255,255,0.38); margin-bottom: 13px; }
.google-btn {
  width: 100%; padding: 9px; border-radius: 9px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.85); font-size: 0.73rem; font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  cursor: pointer; margin-bottom: 10px; transition: background 0.2s;
}
.google-btn:hover:not(:disabled) { background: rgba(255,255,255,0.09); }
.google-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.divider { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
.divider span { font-size: 0.6rem; color: rgba(255,255,255,0.28); font-weight: 600; }
.field { margin-bottom: 8px; }
.field-input {
  width: 100%; padding: 8px 11px; border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  color: #fff; font-size: 0.75rem; outline: none; box-sizing: border-box;
  transition: border-color 0.2s;
}
.field-input::placeholder { color: rgba(255,255,255,0.25); }
.field-input:focus { border-color: rgba(0,255,157,0.38); }
.err-msg { font-size: 0.68rem; color: #f87171; margin-bottom: 6px; text-align: center; }
.submit-btn {
  width: 100%; padding: 10px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.09em;
  border: none; border-radius: 9px; cursor: pointer; margin-top: 2px; margin-bottom: 10px;
  box-shadow: 0 6px 18px rgba(0,255,157,0.22); transition: filter 0.2s;
}
.submit-btn:hover:not(:disabled) { filter: brightness(1.06); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.footer-note { text-align: center; font-size: 0.6rem; color: rgba(255,255,255,0.28); }
.link { color: rgba(0,255,157,0.7); text-decoration: none; font-weight: 600; }
.link:hover { color: #00ff9d; }

.plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 10px; }
@media (max-width: 360px) { .plans-grid { grid-template-columns: repeat(2, 1fr); } }
.plan-card {
  position: relative; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03); padding: 8px 6px;
  cursor: pointer; display: flex; flex-direction: column; align-items: center;
  text-align: center; transition: border-color 0.2s, background 0.2s; gap: 3px;
}
.plan-card.selected { border-color: rgba(0,255,157,0.45); background: rgba(0,255,157,0.06); }
.plan-card.popular { border-color: rgba(0,255,157,0.22); }
.popular-badge {
  position: absolute; top: -6px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #021a10; font-size: 0.44rem; font-weight: 800; letter-spacing: 0.06em;
  padding: 1px 6px; border-radius: 99px; white-space: nowrap;
}
.plan-radio-row { display: flex; justify-content: center; }
.plan-radio { width: 11px; height: 11px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.22); display: flex; align-items: center; justify-content: center; transition: border-color 0.15s; }
.plan-radio.active { border-color: #00ff9d; }
.plan-radio-dot { width: 5px; height: 5px; border-radius: 50%; background: #00ff9d; }
.plan-name { font-size: 0.68rem; font-weight: 800; color: #fff; line-height: 1; }
.plan-price-block { display: flex; align-items: baseline; gap: 2px; justify-content: center; }
.plan-price { font-size: 0.82rem; font-weight: 800; color: #fff; line-height: 1; }
.plan-currency { font-size: 0.44rem; color: rgba(0,255,157,0.8); font-weight: 700; }
.subscribe-btn {
  width: 100%; margin-top: 2px; padding: 10px 4px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.08em;
  border: none; border-radius: 9px; cursor: pointer;
  box-shadow: 0 6px 18px rgba(0,255,157,0.22); transition: filter 0.2s;
}
.subscribe-btn:hover { filter: brightness(1.07); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s ease; }
.modal-enter-from .modal-box { transform: scale(0.94) translateY(12px); }
.modal-leave-to .modal-box { transform: scale(0.97) translateY(6px); }
</style>
