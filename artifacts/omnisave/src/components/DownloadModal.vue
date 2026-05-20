<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="movie"
        class="modal-backdrop"
        @click.self="$emit('close')"
      >
        <div class="modal-box">
          <!-- Header -->
          <div class="modal-header">
            <div class="modal-poster" :style="{ background: `linear-gradient(160deg, ${movie.color} 0%, #050c08 100%)` }">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(0,255,157,0.6)"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="modal-info">
              <p class="modal-title">{{ movie.title }}</p>
              <p class="modal-date">{{ movie.date }}</p>
              <div class="modal-tags">
                <span v-for="g in (movie.genres || []).slice(0, 3)" :key="g" class="modal-tag">{{ g }}</span>
              </div>
            </div>
            <button class="modal-close" @click="$emit('close')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Quality options -->
          <p class="modal-section-label">SELECT QUALITY</p>
          <div class="modal-options">
            <button
              v-for="opt in options"
              :key="opt.label"
              class="modal-option"
              @click="$emit('close')"
            >
              <div class="modal-option-left">
                <div class="modal-option-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </div>
                <div>
                  <p class="modal-opt-name">{{ opt.label }}</p>
                  <p class="modal-opt-format">{{ opt.format }}</p>
                </div>
              </div>
              <span class="modal-opt-size">{{ opt.size }}</span>
            </button>
          </div>

          <button class="modal-cancel" @click="$emit('close')">CANCEL</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Movie } from '../data/movies'

defineProps<{ movie: Movie | null }>()
defineEmits(['close'])

const options = [
  { label: '1080P FULL HD', format: 'MP4 · H.264', size: '~2.1 GB' },
  { label: '720P HD',       format: 'MP4 · H.264', size: '~900 MB' },
  { label: '480P SD',       format: 'MP4 · H.264', size: '~420 MB' },
  { label: '360P',          format: 'MP4 · H.264', size: '~210 MB' },
]
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(12px);
}
.modal-box {
  width: 100%;
  max-width: 400px;
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(8, 16, 11, 0.98);
  padding: 24px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6);
}
.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 22px;
}
.modal-poster {
  width: 52px;
  height: 72px;
  flex-shrink: 0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-info { flex: 1; min-width: 0; }
.modal-title { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.modal-date { font-size: 0.75rem; color: rgba(255,255,255,0.38); margin-bottom: 8px; }
.modal-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.modal-tag { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); font-weight: 600; letter-spacing: 0.04em; }
.modal-close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: background 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

.modal-section-label { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em; color: rgba(255,255,255,0.3); margin-bottom: 10px; }

.modal-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.modal-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: left;
}
.modal-option:hover {
  border-color: rgba(0,255,157,0.25);
  background: rgba(0,255,157,0.05);
}
.modal-option-left { display: flex; align-items: center; gap: 12px; }
.modal-option-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(0,255,157,0.1);
  border: 1px solid rgba(0,255,157,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00ff9d;
  flex-shrink: 0;
}
.modal-opt-name { font-size: 0.8rem; font-weight: 700; color: #fff; letter-spacing: 0.04em; }
.modal-opt-format { font-size: 0.68rem; color: rgba(255,255,255,0.38); margin-top: 1px; }
.modal-opt-size { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.35); white-space: nowrap; }

.modal-cancel {
  width: 100%;
  padding: 11px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: transparent;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.35);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.modal-cancel:hover { color: rgba(255,255,255,0.65); background: rgba(255,255,255,0.04); }

/* Transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.25s ease; }
.modal-enter-from .modal-box { transform: scale(0.94) translateY(12px); }
.modal-leave-to .modal-box { transform: scale(0.96) translateY(8px); }
</style>
