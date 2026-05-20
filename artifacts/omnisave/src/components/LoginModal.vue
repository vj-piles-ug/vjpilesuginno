<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <button class="modal-close" @click="$emit('close')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- STEP 1: LOGIN -->
          <template v-if="step === 1">
            <div class="modal-brand">
              <div class="brand-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>
              <span class="brand-name">VJ PILES UG<span class="brand-dot">.COM</span></span>
            </div>
            <h2 class="modal-heading">Sign in</h2>
            <p class="modal-sub">Access downloads &amp; subscription</p>

            <button class="google-btn" @click="step = 2">
              <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <div class="divider"><span>or</span></div>

            <form @submit.prevent="step = 2">
              <div class="field">
                <input v-model="email" type="email" placeholder="Email address" class="field-input" required />
              </div>
              <div class="field">
                <input v-model="password" type="password" placeholder="Password" class="field-input" required />
              </div>
              <button type="submit" class="submit-btn">SIGN IN &amp; SUBSCRIBE</button>
            </form>

            <p class="footer-note">
              No account? <a href="#" class="link" @click.prevent="step = 2">Subscribe now</a>
            </p>
          </template>

          <!-- STEP 2: SUBSCRIPTION PLANS -->
          <template v-else>
            <div class="step2-top">
              <button class="back-btn" @click="step = 1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <div class="modal-brand" style="margin-bottom:0">
                <div class="brand-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></div>
                <span class="brand-name">VJ PILES UG<span class="brand-dot">.COM</span></span>
              </div>
            </div>
            <h2 class="modal-heading" style="margin-top:10px">Choose a Plan</h2>
            <p class="modal-sub">HD downloads · Subtitles · Billed in UGX</p>

            <div class="plans">
              <div
                v-for="plan in plans"
                :key="plan.id"
                class="plan-card"
                :class="{ selected: selectedPlan === plan.id, popular: plan.popular }"
                @click="selectedPlan = plan.id"
              >
                <div v-if="plan.popular" class="popular-badge">BEST VALUE</div>
                <div class="plan-top">
                  <div class="plan-radio" :class="{ active: selectedPlan === plan.id }">
                    <div v-if="selectedPlan === plan.id" class="plan-radio-dot"></div>
                  </div>
                  <div class="plan-name-wrap">
                    <p class="plan-name">{{ plan.name }}</p>
                    <p class="plan-period">/ month</p>
                  </div>
                  <div class="plan-price-wrap">
                    <p class="plan-price">{{ plan.price.toLocaleString() }}</p>
                    <p class="plan-currency">UGX</p>
                  </div>
                </div>
                <ul class="plan-features">
                  <li v-for="f in plan.features" :key="f" class="plan-feature">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ f }}
                  </li>
                </ul>
              </div>
            </div>

            <button class="pay-btn" :disabled="!selectedPlan" @click="$emit('close')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              PAY NOW — {{ selectedPlan ? plans.find(p => p.id === selectedPlan)?.price.toLocaleString() + ' UGX' : 'SELECT A PLAN' }}
            </button>

            <p class="footer-note">Cancel anytime · Secure payment · Auto-renews monthly</p>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ open: boolean }>()
defineEmits(['close'])

const step = ref(1)
const email = ref('')
const password = ref('')
const selectedPlan = ref<string>('standard')

watch(() => props.open, (v) => { if (!v) { step.value = 1; email.value = ''; password.value = '' } })

const plans = [
  { id: 'basic',    name: 'Basic',    price: 15000, popular: false, features: ['480P downloads', '5 downloads/day', 'Subtitles'] },
  { id: 'standard', name: 'Standard', price: 35000, popular: true,  features: ['720P HD downloads', '30 downloads/day', 'Subtitles', 'TV Series'] },
  { id: 'premium',  name: 'Premium',  price: 65000, popular: false, features: ['1080P Full HD', 'Unlimited downloads', 'Priority speed'] },
]
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
}
.modal-close {
  position: absolute; top: 11px; right: 11px;
  width: 22px; height: 22px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.step2-top { display: flex; align-items: center; gap: 8px; }
.back-btn {
  width: 22px; height: 22px; border-radius: 50%; flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.15s;
}
.back-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }

.modal-brand { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
.brand-icon { width: 20px; height: 20px; border-radius: 5px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); }
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
.google-btn:hover { background: rgba(255,255,255,0.09); }

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

.submit-btn {
  width: 100%; padding: 10px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.09em;
  border: none; border-radius: 9px; cursor: pointer; margin-top: 2px; margin-bottom: 10px;
  box-shadow: 0 6px 18px rgba(0,255,157,0.22); transition: filter 0.2s;
}
.submit-btn:hover { filter: brightness(1.06); }

.footer-note { text-align: center; font-size: 0.6rem; color: rgba(255,255,255,0.28); }
.link { color: rgba(0,255,157,0.7); text-decoration: none; font-weight: 600; }
.link:hover { color: #00ff9d; }

/* Plans */
.plans { display: flex; flex-direction: column; gap: 6px; margin-bottom: 11px; }
.plan-card {
  position: relative; border-radius: 11px; border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03); padding: 9px 11px;
  cursor: pointer; transition: border-color 0.2s, background 0.2s;
}
.plan-card:hover { border-color: rgba(255,255,255,0.14); }
.plan-card.selected { border-color: rgba(0,255,157,0.42); background: rgba(0,255,157,0.05); }
.plan-card.popular { border-color: rgba(0,255,157,0.2); }

.popular-badge {
  position: absolute; top: -7px; right: 9px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #021a10; font-size: 0.48rem; font-weight: 800; letter-spacing: 0.08em;
  padding: 2px 7px; border-radius: 99px;
}

.plan-top { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; }
.plan-radio { width: 13px; height: 13px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.22); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.15s; }
.plan-radio.active { border-color: #00ff9d; }
.plan-radio-dot { width: 5px; height: 5px; border-radius: 50%; background: #00ff9d; }

.plan-name-wrap { flex: 1; }
.plan-name { font-size: 0.74rem; font-weight: 700; color: #fff; line-height: 1; }
.plan-period { font-size: 0.53rem; color: rgba(255,255,255,0.35); margin-top: 1px; }

.plan-price-wrap { text-align: right; }
.plan-price { font-size: 0.86rem; font-weight: 800; color: #fff; line-height: 1; }
.plan-currency { font-size: 0.5rem; color: rgba(0,255,157,0.7); font-weight: 700; letter-spacing: 0.06em; margin-top: 1px; }

.plan-features { display: flex; flex-direction: column; gap: 3px; padding-left: 21px; }
.plan-feature { display: flex; align-items: center; gap: 5px; font-size: 0.6rem; color: rgba(255,255,255,0.48); }

.pay-btn {
  width: 100%; padding: 11px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.66rem; font-weight: 800; letter-spacing: 0.07em;
  border: none; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  box-shadow: 0 7px 20px rgba(0,255,157,0.24); margin-bottom: 8px;
  transition: filter 0.2s, opacity 0.2s;
}
.pay-btn:hover { filter: brightness(1.06); }
.pay-btn:disabled { opacity: 0.4; cursor: not-allowed; filter: none; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.4); box-shadow: none; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s ease; }
.modal-enter-from .modal-box { transform: scale(0.94) translateY(12px); }
.modal-leave-to .modal-box { transform: scale(0.97) translateY(6px); }
</style>
