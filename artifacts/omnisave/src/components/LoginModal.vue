<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <!-- Close -->
          <button class="modal-close" @click="$emit('close')">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>

          <!-- Logo -->
          <div class="modal-brand">
            <div class="brand-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <span class="brand-name">VJ PILES UG<span class="brand-dot">.COM</span></span>
          </div>

          <h2 class="modal-heading">Sign in</h2>
          <p class="modal-sub">Access your downloads and subscription</p>

          <!-- Google -->
          <button class="google-btn" @click="$emit('close')">
            <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <!-- Divider -->
          <div class="divider"><span>or</span></div>

          <!-- Email form -->
          <form @submit.prevent="handleSubmit">
            <div class="field">
              <label class="field-label">Email</label>
              <input v-model="email" type="email" placeholder="you@example.com" class="field-input" required />
            </div>
            <div class="field">
              <label class="field-label">
                Password
                <a href="#" class="forgot-link">Forgot?</a>
              </label>
              <input v-model="password" type="password" placeholder="••••••••" class="field-input" required />
            </div>
            <button type="submit" class="submit-btn">SIGN IN</button>
          </form>

          <p class="signup-text">
            Don't have an account?
            <a href="#" class="signup-link" @click.prevent="$emit('close')">Sign up free</a>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ open: boolean }>()
defineEmits(['close'])

const email = ref('')
const password = ref('')

function handleSubmit() {
  // placeholder
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 300;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(16px);
}
.modal-box {
  position: relative; width: 100%; max-width: 340px;
  border-radius: 22px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(8,14,11,0.99); padding: 24px;
  box-shadow: 0 30px 70px rgba(0,0,0,0.65);
}
.modal-close {
  position: absolute; top: 14px; right: 14px;
  width: 26px; height: 26px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.modal-brand {
  display: flex; align-items: center; gap: 8px; margin-bottom: 18px;
}
.brand-icon {
  width: 26px; height: 26px; border-radius: 7px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
}
.brand-name { font-size: 0.82rem; font-weight: 800; letter-spacing: 0.04em; color: #fff; }
.brand-dot { color: #00ff9d; }

.modal-heading { font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.modal-sub { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-bottom: 18px; }

/* Google */
.google-btn {
  width: 100%; padding: 11px; border-radius: 11px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.85); font-size: 0.8rem; font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  cursor: pointer; margin-bottom: 14px; transition: background 0.2s, border-color 0.2s;
}
.google-btn:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); }

/* Divider */
.divider {
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
}
.divider::before, .divider::after {
  content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.08);
}
.divider span { font-size: 0.68rem; color: rgba(255,255,255,0.28); font-weight: 600; letter-spacing: 0.05em; }

/* Fields */
.field { margin-bottom: 12px; }
.field-label {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.45);
  letter-spacing: 0.06em; margin-bottom: 5px;
}
.forgot-link { font-size: 0.65rem; color: rgba(0,255,157,0.65); text-decoration: none; font-weight: 600; transition: color 0.15s; }
.forgot-link:hover { color: #00ff9d; }
.field-input {
  width: 100%; padding: 10px 13px; border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  color: #fff; font-size: 0.82rem; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.field-input::placeholder { color: rgba(255,255,255,0.25); }
.field-input:focus { border-color: rgba(0,255,157,0.35); box-shadow: 0 0 0 3px rgba(0,255,157,0.08); }

.submit-btn {
  width: 100%; padding: 12px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.76rem; font-weight: 800; letter-spacing: 0.12em;
  border: none; border-radius: 11px; cursor: pointer; margin-top: 4px; margin-bottom: 14px;
  box-shadow: 0 8px 26px rgba(0,255,157,0.22); transition: filter 0.2s;
}
.submit-btn:hover { filter: brightness(1.06); }

.signup-text { text-align: center; font-size: 0.72rem; color: rgba(255,255,255,0.35); }
.signup-link { color: rgba(0,255,157,0.7); text-decoration: none; font-weight: 600; transition: color 0.15s; }
.signup-link:hover { color: #00ff9d; }

.modal-enter-active, .modal-leave-active { transition: opacity 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.22s ease; }
.modal-enter-from .modal-box { transform: scale(0.95) translateY(10px); }
.modal-leave-to .modal-box { transform: scale(0.97) translateY(6px); }
</style>
