<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <button class="modal-close" @click="$emit('close')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- STEP 1: Plan grid -->
          <template v-if="step === 1">
            <div class="modal-header-row">
              <img src="/logo.png" alt="" class="hdr-logo" />
              <div>
                <h2 class="hdr-title">Subscribe</h2>
                <p class="hdr-sub">HD downloads via PesaPal · Mobile Money</p>
              </div>
            </div>

            <div class="plan-grid">
              <div
                v-for="plan in plans"
                :key="plan.id"
                class="plan-card"
                :class="{ popular: plan.popular }"
              >
                <div v-if="plan.popular" class="popular-badge">BEST</div>
                <p class="plan-name">{{ plan.name }}</p>
                <div class="plan-price-row">
                  <span class="plan-price">{{ plan.price.toLocaleString() }}</span>
                  <span class="plan-ugx">UGX</span>
                </div>
                <p class="plan-period">{{ plan.period }}</p>
                <button class="plan-sub-btn" @click="pickPlan(plan.id)">Subscribe</button>
              </div>
            </div>
            <p class="cancel-note">Secure PesaPal payment · MTN / Airtel Money</p>
          </template>

          <!-- STEP 2: Phone number -->
          <template v-else-if="step === 2">
            <button class="back-btn" @click="step = 1">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </button>

            <div class="pay-header">
              <h2 class="hdr-title">{{ activePlan?.name }} — {{ activePlan?.price.toLocaleString() }} UGX</h2>
              <p class="hdr-sub">{{ activePlan?.period }}</p>
            </div>

            <div class="field">
              <label class="field-label">Phone number</label>
              <input v-model="phoneInput" class="field-input" placeholder="e.g. 0771234567" type="tel" />
            </div>

            <button class="pay-btn" :disabled="submitting || !phoneInput.trim()" @click="submitPayment">
              <svg v-if="submitting" class="spin-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
              <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              {{ submitting ? 'Processing...' : 'PROCEED' }}
            </button>
            <p v-if="errMsg" class="err-msg">{{ errMsg }}</p>
          </template>

          <!-- STEP 3: Success -->
          <template v-else>
            <div class="success-wrap">
              <div class="success-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 class="hdr-title mt-3">Payment Submitted!</h2>
              <p class="hdr-sub" style="text-align:center;margin-top:4px">Your subscription will be activated within 1 hour.</p>
              <p class="cancel-note mt-2">Questions? WhatsApp: <strong style="color:#fff">0774 356 888</strong></p>
              <button class="pay-btn mt-3" @click="$emit('close')">DONE</button>
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
defineEmits(['close'])

const { currentUser } = useAuth()

const step = ref(1)
const selectedPlan = ref<string | null>(null)
const phoneInput = ref('')
const submitting = ref(false)
const errMsg = ref('')
const copied = ref(false)

watch(step, (s) => { if (s === 1) { phoneInput.value = ''; errMsg.value = '' } })

const plans = [
  { id: 'daily',   name: '1-Day',   period: 'one day',  price: 500,   popular: false },
  { id: 'weekly',  name: '1-Week',  period: 'per week', price: 3000,  popular: true  },
  { id: 'monthly', name: '1-Month', period: 'monthly',  price: 10000, popular: false },
]

const activePlan = computed(() => plans.find(p => p.id === selectedPlan.value))

function pickPlan(id: string) {
  selectedPlan.value = id
  step.value = 2
}

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
    errMsg.value = 'Failed to submit. Contact 0774356888.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.82); backdrop-filter: blur(16px);
}
.modal-box {
  position: relative; width: 100%; max-width: 340px;
  border-radius: 18px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(8,14,12,0.99); padding: 18px 16px 16px;
  box-shadow: 0 28px 64px rgba(0,0,0,0.7);
  max-height: 90vh; overflow-y: auto;
}
.modal-close {
  position: absolute; top: 12px; right: 12px;
  width: 24px; height: 24px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.45); cursor: pointer; transition: background 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* Header row */
.modal-header-row { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.hdr-logo { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
.hdr-title { font-size: 0.92rem; font-weight: 800; color: #fff; line-height: 1.1; }
.hdr-sub { font-size: 0.65rem; color: rgba(255,255,255,0.38); margin-top: 1px; }
.mt-1 { margin-top: 4px; }
.mt-2 { margin-top: 6px; }
.mt-3 { margin-top: 10px; }

/* 3-column plan grid */
.plan-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 12px; }
.plan-card {
  position: relative; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  padding: 10px 7px 9px; display: flex; flex-direction: column; align-items: center; gap: 4px;
  transition: border-color 0.2s, background 0.2s;
}
.plan-card.popular { border-color: rgba(0,255,157,0.28); background: rgba(0,255,157,0.04); }
.popular-badge {
  position: absolute; top: -8px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #021a10; font-size: 0.5rem; font-weight: 800;
  letter-spacing: 0.08em; padding: 1px 7px; border-radius: 99px; white-space: nowrap;
}
.plan-name { font-size: 0.72rem; font-weight: 800; color: #fff; text-align: center; margin-top: 2px; }
.plan-price-row { display: flex; align-items: baseline; gap: 2px; }
.plan-price { font-size: 1rem; font-weight: 800; color: #fff; line-height: 1; }
.plan-ugx { font-size: 0.52rem; font-weight: 700; color: rgba(0,255,157,0.7); }
.plan-period { font-size: 0.56rem; color: rgba(255,255,255,0.32); text-align: center; }
.plan-sub-btn {
  width: 100%; margin-top: 5px; padding: 5px 4px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8);
  color: #021a10; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.06em;
  border: none; border-radius: 6px; cursor: pointer; transition: filter 0.2s;
}
.plan-sub-btn:hover { filter: brightness(1.07); }

/* Step 2 */
.back-btn { display: flex; align-items: center; gap: 4px; background: none; border: none; color: rgba(255,255,255,0.4); font-size: 0.68rem; cursor: pointer; padding: 0; margin-bottom: 10px; transition: color 0.15s; }
.back-btn:hover { color: rgba(255,255,255,0.75); }
.pay-header { margin-bottom: 12px; }
.pesapal-badge { display: inline-block; padding: 3px 9px; border-radius: 5px; background: linear-gradient(135deg, #e63900, #ff6b35); color: #fff; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.05em; }

.pay-instructions { display: flex; flex-direction: column; gap: 8px; margin-bottom: 12px; }
.pay-row { display: flex; align-items: flex-start; gap: 9px; }
.pay-num {
  width: 20px; height: 20px; border-radius: 50%; flex-shrink: 0;
  background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.28);
  color: #00ff9d; font-size: 0.6rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
}
.pay-text { font-size: 0.72rem; color: rgba(255,255,255,0.7); line-height: 1.5; }
.pay-text strong { color: #fff; font-weight: 700; }
.phone-chip { display: inline-flex; align-items: center; gap: 6px; background: rgba(0,255,157,0.07); border: 1px solid rgba(0,255,157,0.2); border-radius: 7px; padding: 4px 8px; margin-top: 3px; }
.phone-num { font-size: 0.84rem; font-weight: 800; color: #00ff9d; letter-spacing: 0.04em; }
.copy-btn { background: rgba(0,255,157,0.14); border: none; color: #00ff9d; font-size: 0.58rem; font-weight: 700; padding: 2px 7px; border-radius: 4px; cursor: pointer; }
.copy-btn:hover { background: rgba(0,255,157,0.24); }

.field { margin-bottom: 10px; }
.field-label { display: block; font-size: 0.64rem; font-weight: 600; color: rgba(255,255,255,0.42); margin-bottom: 4px; }
.field-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; color: #fff; font-size: 0.82rem; padding: 8px 11px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
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
.pay-btn:disabled { opacity: 0.4; cursor: not-allowed; filter: none; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.38); box-shadow: none; }
.pay-btn.mt-3 { margin-top: 10px; }

.err-msg { font-size: 0.65rem; color: #f87171; margin-bottom: 6px; text-align: center; }
.cancel-note { text-align: center; font-size: 0.6rem; color: rgba(255,255,255,0.22); }

/* Success */
.success-wrap { display: flex; flex-direction: column; align-items: center; padding: 8px 0; }
.success-icon { width: 54px; height: 54px; border-radius: 50%; background: rgba(0,255,157,0.1); border: 2px solid rgba(0,255,157,0.3); display: flex; align-items: center; justify-content: center; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin-icon { animation: spin 0.8s linear infinite; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s ease; }
.modal-enter-from .modal-box { transform: scale(0.96) translateY(8px); }
.modal-leave-to .modal-box { transform: scale(0.98) translateY(5px); }
</style>
