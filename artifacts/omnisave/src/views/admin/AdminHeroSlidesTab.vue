<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">Hero Slides</h1>
        <p class="tab-sub">{{ adminStore.heroSlides.length }} slides active on homepage</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">
        <span>+</span> Add Slide
      </button>
    </div>

    <!-- Add Form -->
    <div v-if="showForm" class="form-card">
      <h2 class="form-title">Add Hero Slide</h2>
      <div class="form-grid">
        <div class="field">
          <label>Title *</label>
          <input v-model="form.title" placeholder="Movie or show title" />
        </div>
        <div class="field">
          <label>Type Label *</label>
          <input v-model="form.type" placeholder="ACTION  •  THRILLER" />
        </div>
        <div class="field">
          <label>Accent Color</label>
          <div class="color-row">
            <input v-model="form.accent" placeholder="#00ff9d" class="color-text" />
            <input v-model="form.accent" type="color" class="color-picker" />
          </div>
        </div>
        <div class="field">
          <label>Preview</label>
          <div class="slide-preview" :style="{ background: form.bg || '#111' }">
            <p class="prev-type" :style="{ color: form.accent || '#00ff9d' }">{{ form.type || 'TYPE' }}</p>
            <p class="prev-title">{{ form.title || 'Title' }}</p>
          </div>
        </div>
        <div class="field col-2">
          <label>Background CSS Gradient *</label>
          <input v-model="form.bg" placeholder="radial-gradient(ellipse 120% 100% at 80% 20%, #0d2a4a 0%, #071220 60%, #050c08 100%)" />
          <p class="field-hint">Paste a CSS gradient, or use one of the presets below:</p>
          <div class="preset-row">
            <button v-for="p in presets" :key="p.name" @click="applyPreset(p)" class="preset-btn" :style="{ background: p.bg }">{{ p.name }}</button>
          </div>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-ghost" @click="showForm = false; resetForm()">Cancel</button>
        <button class="btn-primary" @click="addSlide" :disabled="!form.title || !form.bg">Add Slide</button>
      </div>
      <p v-if="saved" class="save-msg">✓ Slide added to homepage</p>
    </div>

    <!-- Current Slides -->
    <div class="slides-grid">
      <div v-for="(slide, idx) in adminStore.heroSlides" :key="slide.id" class="slide-card">
        <div class="slide-bg" :style="{ background: slide.bg }">
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <p class="slide-type" :style="{ color: slide.accent }">{{ slide.type }}</p>
            <p class="slide-title">{{ slide.title }}</p>
          </div>
          <div class="slide-num">#{{ idx + 1 }}</div>
        </div>
        <div class="slide-footer">
          <div class="slide-actions">
            <button class="btn-move" @click="moveUp(idx)" :disabled="idx === 0" title="Move up">↑</button>
            <button class="btn-move" @click="moveDown(idx)" :disabled="idx === adminStore.heroSlides.length - 1" title="Move down">↓</button>
            <button class="btn-danger-sm" @click="deleteSlide(slide.id)">Remove</button>
          </div>
          <div class="accent-dot" :style="{ background: slide.accent }" :title="slide.accent"></div>
        </div>
      </div>
      <div v-if="adminStore.heroSlides.length === 0" class="empty-slides">No slides added yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { adminStore } from '../../store/admin'

const showForm = ref(false)
const saved = ref(false)
const form = ref({ title: '', type: '', bg: '', accent: '#4db8ff' })

const presets = [
  { name: 'Ocean', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0d2a4a 0%, #071220 60%, #050c08 100%)', accent: '#4db8ff' },
  { name: 'Gold', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a1a08 0%, #100f06 60%, #050c08 100%)', accent: '#ffd700' },
  { name: 'Purple', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a0a3a 0%, #0f0620 60%, #050c08 100%)', accent: '#ff6bde' },
  { name: 'Forest', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0a1f0a 0%, #071207 60%, #050c08 100%)', accent: '#7aff5c' },
  { name: 'Red', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #2a0a0a 0%, #180606 60%, #050c08 100%)', accent: '#ff6b6b' },
  { name: 'Teal', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #002a2a 0%, #001515 60%, #050c08 100%)', accent: '#00ffcc' },
]

function applyPreset(p: { bg: string; accent: string }) {
  form.value.bg = p.bg
  form.value.accent = p.accent
}

function resetForm() {
  form.value = { title: '', type: '', bg: '', accent: '#4db8ff' }
  saved.value = false
}

function addSlide() {
  adminStore.heroSlides.push({
    id: adminStore.nextSlideId++,
    title: form.value.title,
    type: form.value.type,
    bg: form.value.bg,
    accent: form.value.accent,
  })
  saved.value = true
  setTimeout(() => { saved.value = false; showForm.value = false; resetForm() }, 1500)
}

function deleteSlide(id: number) {
  if (!confirm('Remove this hero slide?')) return
  const i = adminStore.heroSlides.findIndex(s => s.id === id)
  if (i !== -1) adminStore.heroSlides.splice(i, 1)
}

function moveUp(idx: number) {
  if (idx === 0) return
  const slides = adminStore.heroSlides;
  [slides[idx - 1], slides[idx]] = [slides[idx], slides[idx - 1]]
}

function moveDown(idx: number) {
  const slides = adminStore.heroSlides
  if (idx >= slides.length - 1) return;
  [slides[idx + 1], slides[idx]] = [slides[idx], slides[idx + 1]]
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.tab-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.8rem; color: rgba(255,255,255,0.4); }

.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 28px; }
.form-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.col-2 { grid-column: span 2; }
.field label { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
.field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
.field input:focus { border-color: rgba(0,255,157,0.5); }
.field-hint { font-size: 0.72rem; color: rgba(255,255,255,0.35); margin-top: 4px; }
.color-row { display: flex; gap: 8px; }
.color-text { flex: 1; }
.color-picker { width: 44px; height: 38px; padding: 2px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); cursor: pointer; }
.preset-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.preset-btn { padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15); font-size: 0.72rem; font-weight: 700; color: #fff; cursor: pointer; transition: transform 0.15s; }
.preset-btn:hover { transform: scale(1.04); }
.slide-preview { border-radius: 10px; padding: 16px; height: 80px; display: flex; flex-direction: column; justify-content: center; gap: 4px; overflow: hidden; }
.prev-type { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; }
.prev-title { font-size: 1rem; font-weight: 800; color: #fff; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; }
.save-msg { color: #00ff9d; font-size: 0.8rem; font-weight: 600; margin-top: 10px; text-align: right; }

.btn-primary { background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); color: #021a10; border: none; border-radius: 8px; padding: 9px 18px; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: filter 0.2s; }
.btn-primary:hover { filter: brightness(1.08); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 9px 18px; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
.btn-danger-sm { background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.3); color: #f87171; border-radius: 6px; padding: 5px 12px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.btn-danger-sm:hover { background: rgba(220,38,38,0.25); }
.btn-move { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 6px; padding: 4px 10px; font-size: 0.8rem; cursor: pointer; transition: background 0.15s; }
.btn-move:hover:not(:disabled) { background: rgba(255,255,255,0.12); }
.btn-move:disabled { opacity: 0.25; cursor: not-allowed; }

.slides-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.slide-card { border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
.slide-bg { position: relative; height: 140px; }
.slide-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(5,12,8,0.8) 0%, transparent 100%); }
.slide-content { position: absolute; bottom: 16px; left: 16px; right: 16px; }
.slide-type { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 4px; }
.slide-title { font-size: 1rem; font-weight: 800; color: #fff; }
.slide-num { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); border-radius: 6px; padding: 3px 8px; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.7); }
.slide-footer { background: rgba(0,0,0,0.4); padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; }
.slide-actions { display: flex; gap: 6px; align-items: center; }
.accent-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; }
.empty-slides { color: rgba(255,255,255,0.25); padding: 40px; text-align: center; grid-column: 1/-1; }

@media (max-width: 640px) {
  .tab-page { padding: 16px 12px; }
  .form-grid { grid-template-columns: 1fr; }
  .col-2 { grid-column: span 1; }
}
</style>
