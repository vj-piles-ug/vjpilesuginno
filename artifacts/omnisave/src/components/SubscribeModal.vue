<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <button class="modal-close" @click="$emit('close')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- STEP 1: Plan Selection -->
          <template v-if="step === 1">
            <div class="modal-brand">
              <img src="/logo.png" alt="VJ Piles UG" class="brand-logo" />
            </div>
            <h2 class="modal-heading">Choose a Plan</h2>
            <p class="modal-sub">Unlock unlimited HD downloads via PesaPal</p>

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
                    <p class="plan-period">{{ plan.period }}</p>
                  </div>
                  <div class="plan-price-wrap">
                    <p class="plan-price">{{ plan.price.toLocaleString() }}</p>
                    <p class="plan-currency">UGX</p>
                  </div>
                </div>
                <ul class="plan-features">
                  <li v-for="f in plan.features" :key="f" class="plan-feature">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {{ f }}
                  </li>
                </ul>
              </div>
            </div>

            <button class="pay-btn" :disabled="!selectedPlan" @click="step = 2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              CONTINUE TO PAYMENT
            </button>
            <p class="cancel-note">Cancel anytime · Secure PesaPal payment</p>
          </template>

          <!-- STEP 2: PesaPal Payment -->
          <template v-else-if="step === 2">
            <button class="back-btn" @click="step = 1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>

            <div class="pesapal-header">
              <div class="pesapal-logo-wrap">
                <div class="pesapal-badge">PesaPal</div>
              </div>
              <h2 class="modal-heading mt-2">Pay via Mobile Money</h2>
              <p class="modal-sub">{{ activePlan?.name }} — {{ activePlan?.price.toLocaleString() }} UGX</p>
            </div>

            <div class="payment-steps">
              <div class="pay-step">
                <div class="pay-step-num">1</div>
                <div class="pay-step-text">
                  <p class="pay-step-title">Open MTN / Airtel Money</p>
                  <p class="pay-step-desc">Select "Send Money" or "Pay Bill"</p>
                </div>
              </div>
              <div class="pay-step">
                <div class="pay-step-num">2</div>
                <div class="pay-step-text">
                  <p class="pay-step-title">Send to this number</p>
                  <div class="phone-chip">
                    <span class="phone-number">0774 356 888</span>
                    <button class="copy-btn" @click="copyPhone">{{ copied ? '✓ Copied' : 'Copy' }}</button>
                  </div>
                </div>
              </div>
              <div class="pay-step">
                <div class="pay-step-num">3</div>
                <div class="pay-step-text">
                  <p class="pay-step-title">Amount to send</p>
                  <div class="amount-chip">{{ activePlan?.price.toLocaleString() }} UGX</div>
                </div>
              </div>
              <div class="pay-step">
                <div class="pay-step-num">4</div>
                <div class="pay-step-text">
                  <p class="pay-step-title">Use your email as reference</p>
                  <p class="pay-step-desc">So we can identify your payment</p>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="field-label">Your phone number (for confirmation)</label>
              <input v-model="phoneInput" class="field-input" placeholder="e.g. 0771234567" type="tel" />
            </div>

            <button class="pay-btn" :disabled="submitting || !phoneInput" @click="submitPayment">
              <svg v-if="submitting" class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ submitting ? 'Sending...' : "I'VE PAID — CONFIRM" }}
            </button>
            <p v-if="errMsg" class="err-msg">{{ errMsg }}</p>
            <p class="cancel-note">Your subscription activates within 1 hour after payment confirmation</p>
          </template>

          <!-- STEP 3: Success -->
          <template v-else>
            <div class="success-wrap">
              <div class="success-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 class="modal-heading mt-4">Payment Received!</h2>
              <p class="modal-sub" style="text-align:center">Your payment request has been sent. Your subscription will be activated within 1 hour.</p>
              <p class="cancel-note mt-3">Questions? WhatsApp: <strong style="color:#fff">0774 356 888</strong></p>
              <button class="pay-btn mt-4" @click="$emit('close')">CLOSE</button>
            </div>
          </template>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { push as dbPush, ref as dbRef } from 'firebase/database'
import { db } from '../lib/firebase'
import { useAuth } from '../store/auth'

defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])

const { currentUser } = useAuth()

const step = ref(1)
const selectedPlan = ref<string | null>('weekly')
const phoneInput = ref('')
const submitting = ref(false)
const errMsg = ref('')
const copied = ref(false)

watch(() => step.value, (s) => { if (s === 1) { phoneInput.value = ''; errMsg.value = '' } })

const plans = [
  {
    id: 'daily',
    name: '1-Day Pass',
    period: 'one day',
    price: 500,
    popular: false,
    features: ['HD downloads', 'All content', '24-hour access'],
  },
  {
    id: 'weekly',
    name: '1-Week Pass',
    period: 'per week',
    price: 3000,
    popular: true,
    features: ['HD downloads', 'All content', '7-day access', 'TV Series episodes'],
  },
  {
    id: 'monthly',
    name: '1-Month Pass',
    period: 'per month',
    price: 10000,
    popular: false,
    features: ['1080P Full HD', 'Unlimited downloads', 'All content', '30-day access', 'Priority support'],
  },
]

const activePlan = computed(() => plans.find(p => p.id === selectedPlan.value))

function copyPhone() {
  navigator.clipboard.writeText('0774356888').catch(() => {})
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

async function submitPayment() {
  if (!phoneInput.value.trim()) return
  submitting.value = true
  errMsg.value = ''
  try {
    await dbPush(dbRef(db, 'paymentLogs'), {
      userId: currentUser.value?.uid || 'anonymous',
      email: currentUser.value?.email || '',
      phone: phoneInput.value.trim(),
      planName: activePlan.value?.name || '',
      planId: selectedPlan.value,
      amount: activePlan.value?.price || 0,
      paymentMethod: 'Mobile Money (PesaPal)',
      status: 'pending',
      createdAt: new Date().toISOString(),
    })
    step.value = 3
  } catch (e: any) {
    errMsg.value = 'Failed to submit. Please try again or contact 0774356888.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.85); backdrop-filter: blur(16px);
}
.modal-box {
  position: relative; width: 100%; max-width: 390px;
  border-radius: 22px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(8,14,12,0.99); padding: 22px;
  box-shadow: 0 32px 72px rgba(0,0,0,0.65);
  max-height: 92vh; overflow-y: auto;
}
.modal-close {
  position: absolute; top: 14px; right: 14px;
  width: 26px; height: 26px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.modal-brand { margin-bottom: 14px; }
.brand-logo { height: 36px; width: auto; object-fit: contain; }
.modal-heading { font-size: 1.12rem; font-weight: 800; color: #fff; margin-bottom: 3px; }
.modal-sub { font-size: 0.72rem; color: rgba(255,255,255,0.38); margin-bottom: 16px; }

/* Plans */
.plans { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.plan-card {
  position: relative; border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03); padding: 12px 13px;
  cursor: pointer; transition: border-color 0.2s, background 0.2s;
}
.plan-card:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.05); }
.plan-card.selected { border-color: rgba(0,255,157,0.4); background: rgba(0,255,157,0.05); }
.plan-card.popular { border-color: rgba(0,255,157,0.22); }
.popular-badge {
  position: absolute; top: -9px; right: 12px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #021a10; font-size: 0.55rem; font-weight: 800;
  letter-spacing: 0.08em; padding: 2px 9px; border-radius: 99px;
}
.plan-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.plan-radio { width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.25); flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: border-color 0.15s; }
.plan-radio.active { border-color: #00ff9d; }
.plan-radio-dot { width: 7px; height: 7px; border-radius: 50%; background: #00ff9d; }
.plan-name-wrap { flex: 1; }
.plan-name { font-size: 0.82rem; font-weight: 700; color: #fff; line-height: 1; }
.plan-period { font-size: 0.6rem; color: rgba(255,255,255,0.35); margin-top: 1px; }
.plan-price-wrap { text-align: right; }
.plan-price { font-size: 1rem; font-weight: 800; color: #fff; line-height: 1; }
.plan-currency { font-size: 0.58rem; color: rgba(0,255,157,0.7); font-weight: 700; letter-spacing: 0.06em; margin-top: 1px; }
.plan-features { display: flex; flex-direction: column; gap: 4px; padding-left: 26px; }
.plan-feature { display: flex; align-items: center; gap: 6px; font-size: 0.68rem; color: rgba(255,255,255,0.52); }

/* PesaPal step */
.back-btn { display: flex; align-items: center; gap: 5px; background: none; border: none; color: rgba(255,255,255,0.45); font-size: 0.72rem; cursor: pointer; padding: 0; margin-bottom: 14px; transition: color 0.15s; }
.back-btn:hover { color: rgba(255,255,255,0.8); }
.pesapal-header { margin-bottom: 16px; }
.pesapal-badge {
  display: inline-block; padding: 4px 12px; border-radius: 6px;
  background: linear-gradient(135deg, #e63900, #ff6b35);
  color: #fff; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.06em;
}

.payment-steps { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.pay-step { display: flex; align-items: flex-start; gap: 12px; }
.pay-step-num {
  width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
  background: rgba(0,255,157,0.12); border: 1px solid rgba(0,255,157,0.3);
  color: #00ff9d; font-size: 0.68rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.pay-step-title { font-size: 0.78rem; font-weight: 600; color: rgba(255,255,255,0.82); margin-bottom: 3px; }
.pay-step-desc { font-size: 0.68rem; color: rgba(255,255,255,0.38); }
.phone-chip {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(0,255,157,0.07); border: 1px solid rgba(0,255,157,0.2);
  border-radius: 8px; padding: 5px 10px; margin-top: 2px;
}
.phone-number { font-size: 0.88rem; font-weight: 800; color: #00ff9d; letter-spacing: 0.04em; }
.copy-btn { background: rgba(0,255,157,0.12); border: none; color: #00ff9d; font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 5px; cursor: pointer; transition: background 0.15s; }
.copy-btn:hover { background: rgba(0,255,157,0.22); }
.amount-chip {
  display: inline-block; margin-top: 3px;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 6px; padding: 4px 10px;
  font-size: 0.82rem; font-weight: 800; color: #fff;
}

.field { margin-bottom: 12px; }
.field-label { display: block; font-size: 0.68rem; font-weight: 600; color: rgba(255,255,255,0.45); margin-bottom: 5px; }
.field-input {
  width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px; color: #fff; font-size: 0.82rem; padding: 9px 12px; outline: none;
  transition: border-color 0.2s; box-sizing: border-box;
}
.field-input:focus { border-color: rgba(0,255,157,0.4); }

/* Pay button */
.pay-btn {
  width: 100%; padding: 13px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.73rem; font-weight: 800; letter-spacing: 0.08em;
  border: none; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 10px 28px rgba(0,255,157,0.24); margin-bottom: 10px;
  transition: filter 0.2s, opacity 0.2s;
}
.pay-btn:hover { filter: brightness(1.06); }
.pay-btn:disabled { opacity: 0.4; cursor: not-allowed; filter: none; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.4); box-shadow: none; }
.pay-btn.mt-4 { margin-top: 10px; }

.err-msg { font-size: 0.68rem; color: #f87171; margin-bottom: 8px; text-align: center; }
.cancel-note { text-align: center; font-size: 0.62rem; color: rgba(255,255,255,0.25); }
.cancel-note.mt-3 { margin-top: 8px; }

/* Success */
.success-wrap { display: flex; flex-direction: column; align-items: center; padding: 12px 0; }
.success-icon {
  width: 60px; height: 60px; border-radius: 50%;
  background: rgba(0,255,157,0.1); border: 2px solid rgba(0,255,157,0.3);
  display: flex; align-items: center; justify-content: center;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spin-icon { animation: spin 0.8s linear infinite; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.22s ease; }
.modal-enter-from .modal-box { transform: scale(0.95) translateY(10px); }
.modal-leave-to .modal-box { transform: scale(0.97) translateY(6px); }
</style>
