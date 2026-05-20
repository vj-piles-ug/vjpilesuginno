<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <button class="modal-close" @click="$emit('close')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- Header -->
          <div class="modal-brand">
            <div class="brand-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span class="brand-name">VJ PILES UG<span class="brand-dot">.COM</span></span>
          </div>
          <h2 class="modal-heading">Choose a Plan</h2>
          <p class="modal-sub">All plans include HD downloads &amp; subtitles</p>

          <!-- Plans -->
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
                  <p class="plan-period">per month</p>
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

          <!-- Pay Now -->
          <button class="pay-btn" :disabled="!selectedPlan" @click="$emit('close')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            PAY NOW — {{ selectedPlan ? plans.find(p => p.id === selectedPlan)?.price.toLocaleString() + ' UGX' : 'SELECT A PLAN' }}
          </button>

          <p class="cancel-note">Cancel anytime · Renews monthly · Secure payment</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ open: boolean }>()
defineEmits(['close'])

const selectedPlan = ref<string | null>('standard')

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 15000,
    popular: false,
    features: ['480P downloads', '5 downloads/day', 'Subtitles included'],
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 35000,
    popular: true,
    features: ['720P HD downloads', '30 downloads/day', 'Subtitles included', 'TV Series episodes'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 65000,
    popular: false,
    features: ['1080P Full HD', 'Unlimited downloads', 'Subtitles included', 'Priority speed', 'Early access'],
  },
]
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.82); backdrop-filter: blur(16px);
}
.modal-box {
  position: relative; width: 100%; max-width: 380px;
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

.modal-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.brand-icon { width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); }
.brand-name { font-size: 0.8rem; font-weight: 800; color: #fff; }
.brand-dot { color: #00ff9d; }
.modal-heading { font-size: 1.12rem; font-weight: 800; color: #fff; margin-bottom: 3px; }
.modal-sub { font-size: 0.72rem; color: rgba(255,255,255,0.38); margin-bottom: 16px; }

/* Plans */
.plans { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.plan-card {
  position: relative;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  padding: 12px 13px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.plan-card:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.05); }
.plan-card.selected {
  border-color: rgba(0,255,157,0.4);
  background: rgba(0,255,157,0.05);
}
.plan-card.popular { border-color: rgba(0,255,157,0.22); }

.popular-badge {
  position: absolute; top: -9px; right: 12px;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #021a10; font-size: 0.55rem; font-weight: 800;
  letter-spacing: 0.08em; padding: 2px 9px; border-radius: 99px;
}

.plan-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.plan-radio {
  width: 16px; height: 16px; border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.25);
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  transition: border-color 0.15s;
}
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

.cancel-note { text-align: center; font-size: 0.62rem; color: rgba(255,255,255,0.25); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.22s ease; }
.modal-enter-from .modal-box { transform: scale(0.95) translateY(10px); }
.modal-leave-to .modal-box { transform: scale(0.97) translateY(6px); }
</style>
