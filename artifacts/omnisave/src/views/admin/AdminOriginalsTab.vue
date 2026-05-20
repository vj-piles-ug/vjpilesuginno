<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Originals</h1>
      <p class="tab-sub">Upload exclusive original content</p>
    </div>
    <div class="form-card">
      <h2 class="form-title">Add New Original</h2>
      <div class="form-grid">
        <div class="field">
          <label>Title <span class="req">*</span></label>
          <input v-model="form.title" placeholder="Enter title" />
        </div>
        <div class="field">
          <label>Category</label>
          <div class="select-wrap">
            <select v-model="form.category">
              <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
            </select>
            <svg class="sel-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="field col-2">
          <label>Stream Link <span class="req">*</span></label>
          <input v-model="form.streamUrl" placeholder="https://example.com/stream/original.mp4" />
        </div>
        <div class="field col-2">
          <label>Poster Image URL</label>
          <input v-model="form.posterUrl" placeholder="https://example.com/poster/image.jpg" />
        </div>
        <div class="field">
          <label>Rating (0–10)</label>
          <input v-model.number="form.rating" type="number" min="0" max="10" step="0.1" placeholder="7.5" />
        </div>
        <div class="field">
          <label>Year</label>
          <input v-model.number="form.year" type="number" placeholder="2025" />
        </div>
      </div>
      <button class="btn-add" @click="addItem" :disabled="!form.title || !form.streamUrl">Add Original</button>
      <p v-if="saved" class="save-msg">✓ Original added successfully</p>
    </div>
    <div class="items-grid">
      <div v-for="item in items" :key="item.id" class="item-card">
        <div class="ic-poster">
          <img v-if="item.posterUrl" :src="item.posterUrl" alt="" class="ic-img" @error="onImgErr" />
          <div v-else class="ic-no-poster">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <span class="ic-cat">{{ item.category }}</span>
        </div>
        <div class="ic-body">
          <p class="ic-title">{{ item.title }}</p>
          <p class="ic-meta">⭐ {{ item.rating }} · {{ item.year }}</p>
          <button class="ic-btn-del" @click="deleteItem(item.id)">Delete</button>
        </div>
      </div>
      <div v-if="items.length === 0" class="empty">No originals added yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const CATEGORIES = ['Action', 'Drama', 'Comedy', 'Thriller', 'Documentary', 'Sci-Fi']

interface OriginalItem { id: number; title: string; category: string; streamUrl: string; posterUrl: string; rating: number; year: number }
let nextId = 1
const items = ref<OriginalItem[]>([])
const saved = ref(false)
const form = ref({ title: '', category: 'Drama', streamUrl: '', posterUrl: '', rating: 7.5, year: new Date().getFullYear() })

function addItem() {
  items.value.push({ id: nextId++, ...form.value })
  form.value = { title: '', category: 'Drama', streamUrl: '', posterUrl: '', rating: 7.5, year: new Date().getFullYear() }
  saved.value = true
  setTimeout(() => { saved.value = false }, 2000)
}

function deleteItem(id: number) {
  const i = items.value.findIndex(x => x.id === id)
  if (i !== -1) items.value.splice(i, 1)
}

function onImgErr(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { margin-bottom: 20px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 28px; }
.form-title { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 18px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.col-2 { grid-column: span 2; }
.field label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
.req { color: #f87171; }
.field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.85rem; outline: none; }
.field input:focus { border-color: rgba(0,255,157,0.4); }
.field input::placeholder { color: rgba(255,255,255,0.25); }
.select-wrap { position: relative; }
.select-wrap select { width: 100%; appearance: none; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 36px 9px 12px; color: rgba(255,255,255,0.8); font-size: 0.85rem; outline: none; cursor: pointer; }
.select-wrap select option { background: #0d1a10; }
.sel-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(255,255,255,0.4); }
.btn-add { width: 100%; padding: 11px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: filter 0.2s; }
.btn-add:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
.save-msg { color: #00ff9d; font-size: 0.78rem; font-weight: 600; margin-top: 10px; text-align: center; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
.item-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; }
.ic-poster { position: relative; aspect-ratio: 2/3; background: rgba(255,255,255,0.04); overflow: hidden; }
.ic-img { width: 100%; height: 100%; object-fit: cover; }
.ic-no-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.ic-cat { position: absolute; top: 8px; left: 8px; font-size: 0.58rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: rgba(245,158,11,0.8); color: #000; }
.ic-body { padding: 12px; }
.ic-title { font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ic-meta { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 10px; }
.ic-btn-del { width: 100%; padding: 5px 10px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; border-radius: 6px; font-size: 0.68rem; font-weight: 700; cursor: pointer; }
.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px; grid-column: 1/-1; }
@media (max-width: 640px) { .tab-page { padding: 16px 12px; } .form-grid { grid-template-columns: 1fr; } .col-2 { grid-column: span 1; } }
</style>
