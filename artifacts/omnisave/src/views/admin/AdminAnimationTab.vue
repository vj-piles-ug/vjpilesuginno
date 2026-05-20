<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Animation</h1>
      <p class="tab-sub">Total: {{ dbAnimation.length }} items · Firebase RTDB /animation</p>
    </div>
    <div class="form-card" :class="{ editing: editingKey !== null }">
      <div class="form-title-row">
        <h2 class="form-title">{{ editingKey !== null ? 'Edit Animation' : 'Add Animation' }}</h2>
        <button v-if="editingKey !== null" class="cancel-edit-btn" @click="cancelEdit">✕ Cancel</button>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Title <span class="req">*</span></label>
          <input v-model="form.title" placeholder="Enter title" />
        </div>
        <div class="field">
          <label>Category</label>
          <div class="select-wrap">
            <select v-model="form.category">
              <option value="Anime">Anime</option>
              <option value="Animation">Animation</option>
              <option value="Cartoon">Cartoon</option>
            </select>
            <svg class="sel-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="field col-2">
          <label>Stream Link <span class="req">*</span></label>
          <input v-model="form.streamlink" placeholder="https://example.com/anime.mp4" />
        </div>
        <div class="field col-2">
          <label>Poster Image URL</label>
          <input v-model="form.image" placeholder="https://example.com/poster.jpg" />
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
      <div class="check-row">
        <label class="check-label">
          <input type="checkbox" v-model="form.isTrending" class="check-input" />
          <span class="check-box" :class="{ checked: form.isTrending }">
            <svg v-if="form.isTrending" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          Mark as Trending
        </label>
      </div>
      <p v-if="errMsg" class="err-msg">{{ errMsg }}</p>
      <button class="btn-add" @click="submitForm" :disabled="saving || !form.title || !form.streamlink">
        {{ saving ? 'Saving...' : (editingKey !== null ? 'Update' : 'Add Animation') }}
      </button>
    </div>
    <div class="items-grid">
      <div v-for="item in dbAnimation" :key="item.key" class="item-card" :class="{ 'is-editing': editingKey === item.key }">
        <div class="ic-poster">
          <img v-if="item.image" :src="item.image" alt="" class="ic-img" @error="onImgErr" />
          <div v-else class="ic-no-poster">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="rgba(255,255,255,0.15)"/></svg>
          </div>
          <span class="ic-cat">{{ item.category }}</span>
          <span v-if="item.isTrending" class="ic-trend">TRENDING</span>
        </div>
        <div class="ic-body">
          <p class="ic-title">{{ item.title }}</p>
          <p class="ic-meta">⭐ {{ item.rating }} · {{ item.year }}</p>
          <div class="ic-actions">
            <button class="ic-btn-edit" @click="loadEdit(item)">Edit</button>
            <button class="ic-btn-del" @click="deleteItem(item.key)">Delete</button>
          </div>
        </div>
      </div>
      <div v-if="dbAnimation.length === 0" class="empty">No animation added yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dbAnimation, addAnimation, updateAnimation, removeAnimation, type AdminAnimation } from '../../store/db'

const defaultForm = () => ({ title: '', category: 'Anime', streamlink: '', image: '', rating: 7.5, year: new Date().getFullYear(), isTrending: false })
const form = ref(defaultForm())
const editingKey = ref<string | null>(null)
const saving = ref(false)
const errMsg = ref('')

function loadEdit(item: AdminAnimation) {
  editingKey.value = item.key
  form.value = { title: item.title, category: item.category, streamlink: item.streamlink, image: item.image, rating: item.rating, year: item.year, isTrending: item.isTrending }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingKey.value = null
  form.value = defaultForm()
  errMsg.value = ''
}

async function submitForm() {
  if (!form.value.title || !form.value.streamlink) return
  saving.value = true
  errMsg.value = ''
  try {
    const data = { ...form.value, createdAt: new Date().toISOString() }
    if (editingKey.value !== null) {
      await updateAnimation(editingKey.value, data)
      editingKey.value = null
    } else {
      await addAnimation(data)
    }
    form.value = defaultForm()
  } catch (e: any) {
    errMsg.value = e.message || 'Failed to save.'
  } finally {
    saving.value = false
  }
}

async function deleteItem(key: string) {
  if (editingKey.value === key) cancelEdit()
  if (!confirm('Delete this animation?')) return
  await removeAnimation(key)
}

function onImgErr(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { margin-bottom: 20px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 28px; display: flex; flex-direction: column; gap: 14px; }
.form-card.editing { border-color: rgba(0,255,157,0.25); }
.form-title-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.form-title { font-size: 0.95rem; font-weight: 700; color: #fff; }
.cancel-edit-btn { padding: 5px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 7px; color: rgba(255,255,255,0.5); font-size: 0.72rem; font-weight: 600; cursor: pointer; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.col-2 { grid-column: span 2; }
.field label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
.req { color: #f87171; }
.field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
.field input:focus { border-color: rgba(0,255,157,0.4); }
.field input::placeholder { color: rgba(255,255,255,0.25); }
.select-wrap { position: relative; }
.select-wrap select { width: 100%; appearance: none; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 36px 9px 12px; color: rgba(255,255,255,0.8); font-size: 0.85rem; outline: none; cursor: pointer; }
.select-wrap select option { background: #0d1a10; }
.sel-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(255,255,255,0.4); }
.check-row { display: flex; }
.check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 600; user-select: none; }
.check-input { display: none; }
.check-box { width: 18px; height: 18px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.check-box.checked { background: #7c3aed; border-color: #7c3aed; }
.err-msg { color: #f87171; font-size: 0.78rem; text-align: center; }
.btn-add { width: 100%; padding: 11px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; }
.btn-add:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
.item-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; }
.item-card.is-editing { border-color: rgba(0,255,157,0.35); }
.ic-poster { position: relative; aspect-ratio: 2/3; background: rgba(255,255,255,0.04); overflow: hidden; }
.ic-img { width: 100%; height: 100%; object-fit: cover; }
.ic-no-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.ic-cat { position: absolute; top: 8px; left: 8px; font-size: 0.58rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: rgba(124,58,237,0.8); color: #fff; z-index: 1; }
.ic-trend { position: absolute; bottom: 8px; left: 8px; font-size: 0.52rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: rgba(124,58,237,0.9); color: #fff; z-index: 1; letter-spacing: 0.06em; }
.ic-body { padding: 12px; }
.ic-title { font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ic-meta { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 10px; }
.ic-actions { display: flex; gap: 5px; }
.ic-btn-edit { flex: 1; padding: 5px 8px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; border-radius: 6px; font-size: 0.68rem; font-weight: 700; cursor: pointer; }
.ic-btn-del { flex: 1; padding: 5px 8px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; border-radius: 6px; font-size: 0.68rem; font-weight: 700; cursor: pointer; }
.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px; grid-column: 1/-1; }
@media (max-width: 640px) { .tab-page { padding: 16px 12px; } .form-grid { grid-template-columns: 1fr; } .col-2 { grid-column: span 1; } }
</style>
