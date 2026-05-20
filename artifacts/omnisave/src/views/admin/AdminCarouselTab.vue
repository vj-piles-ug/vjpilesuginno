<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Carousel</h1>
      <p class="tab-sub">Total: {{ dbCarousel.length }} items · Firebase RTDB /carousel</p>
    </div>

    <div class="form-card">
      <h2 class="form-title">Add Carousel Item</h2>
      <div class="form-row">
        <div class="field">
          <label>Title <span class="req">*</span></label>
          <input v-model="form.title" placeholder="Enter title" />
        </div>
        <div class="field">
          <label>Subtitle</label>
          <input v-model="form.subtitle" placeholder="Enter subtitle" />
        </div>
      </div>
      <div class="field full">
        <label>Banner Image URL <span class="req">*</span></label>
        <input v-model="form.imageUrl" placeholder="https://example.com/banner.jpg" />
      </div>
      <div class="field half">
        <label>Link to Content (Optional)</label>
        <div class="select-wrap">
          <select v-model="form.linkContent">
            <option value="No Link">No Link</option>
            <option value="Movies">Movies</option>
            <option value="Series">Series</option>
            <option value="Animation">Animation</option>
          </select>
          <svg class="sel-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      <p v-if="errMsg" class="err-msg">{{ errMsg }}</p>
      <button class="btn-add" @click="addItem" :disabled="saving || !form.title || !form.imageUrl">
        {{ saving ? 'Adding...' : 'Add Item' }}
      </button>
    </div>

    <div class="items-list">
      <div v-for="item in dbCarousel" :key="item.key" class="carousel-row">
        <div class="ci-thumb">
          <img v-if="item.imageUrl" :src="toDisplayImage(item.imageUrl)" alt="" class="ci-img" @error="onImgErr" />
          <div v-else class="ci-placeholder">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </div>
        </div>
        <div class="ci-info">
          <p class="ci-title">{{ item.title }}</p>
          <p v-if="item.subtitle" class="ci-sub">{{ item.subtitle }}</p>
          <p class="ci-link">→ {{ item.linkContent }}</p>
        </div>
        <div class="ci-actions">
          <button class="ci-btn-edit" @click="startEdit(item)" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button class="ci-btn-delete" @click="deleteItem(item.key)" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
          </button>
        </div>
      </div>
      <div v-if="dbCarousel.length === 0" class="empty">No carousel items yet.</div>
    </div>

    <div v-if="editData" class="modal-overlay" @click.self="editData = null">
      <div class="modal">
        <h3 class="modal-title">Edit Carousel Item</h3>
        <div class="field"><label>Title</label><input v-model="editData.title" /></div>
        <div class="field"><label>Subtitle</label><input v-model="editData.subtitle" /></div>
        <div class="field"><label>Banner Image URL</label><input v-model="editData.imageUrl" /></div>
        <div class="modal-actions">
          <button class="btn-ghost" @click="editData = null">Cancel</button>
          <button class="btn-add sm" @click="saveEdit">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dbCarousel, addCarousel, updateCarousel, removeCarousel, type AdminCarousel } from '../../store/db'
import { toDisplayImage } from '../../lib/utils'

const form = ref({ title: '', subtitle: '', imageUrl: '', linkContent: 'No Link' })
const editData = ref<AdminCarousel | null>(null)
const saving = ref(false)
const errMsg = ref('')

async function addItem() {
  if (!form.value.title || !form.value.imageUrl) return
  saving.value = true
  errMsg.value = ''
  try {
    await addCarousel({ ...form.value })
    form.value = { title: '', subtitle: '', imageUrl: '', linkContent: 'No Link' }
  } catch (e: any) {
    errMsg.value = e.message || 'Failed to add.'
  } finally {
    saving.value = false
  }
}

async function deleteItem(key: string) {
  if (!confirm('Delete this carousel item?')) return
  await removeCarousel(key)
}

function startEdit(item: AdminCarousel) {
  editData.value = { ...item }
}

async function saveEdit() {
  if (!editData.value) return
  await updateCarousel(editData.value.key, {
    title: editData.value.title,
    subtitle: editData.value.subtitle,
    imageUrl: editData.value.imageUrl,
    linkContent: editData.value.linkContent,
  })
  editData.value = null
}

function onImgErr(e: Event) { (e.target as HTMLImageElement).style.display = 'none' }
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { margin-bottom: 20px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.4); }
.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 14px; }
.form-title { font-size: 0.95rem; font-weight: 700; color: #fff; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }
.field.half { max-width: 340px; }
.field label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
.req { color: #f87171; }
.field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
.field input:focus { border-color: rgba(0,255,157,0.4); }
.field input::placeholder { color: rgba(255,255,255,0.25); }
.select-wrap { position: relative; }
.select-wrap select { width: 100%; appearance: none; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 36px 9px 12px; color: rgba(255,255,255,0.8); font-size: 0.85rem; outline: none; cursor: pointer; }
.select-wrap select option { background: #0d1a10; }
.sel-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(255,255,255,0.4); }
.err-msg { color: #f87171; font-size: 0.78rem; text-align: center; }
.btn-add { width: 100%; padding: 11px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; }
.btn-add:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-add.sm { width: auto; padding: 9px 20px; }
.btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 9px 18px; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
.items-list { display: flex; flex-direction: column; gap: 6px; }
.carousel-row { display: flex; align-items: center; gap: 16px; padding: 14px 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; transition: background 0.15s; }
.carousel-row:hover { background: rgba(255,255,255,0.04); }
.ci-thumb { width: 70px; height: 48px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; }
.ci-img { width: 100%; height: 100%; object-fit: cover; }
.ci-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }
.ci-info { flex: 1; min-width: 0; }
.ci-title { font-size: 0.88rem; font-weight: 600; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ci-sub { font-size: 0.72rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
.ci-link { font-size: 0.62rem; color: rgba(0,255,157,0.5); margin-top: 2px; }
.ci-actions { display: flex; gap: 8px; flex-shrink: 0; }
.ci-btn-edit { padding: 7px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.6); cursor: pointer; display: flex; }
.ci-btn-edit:hover { background: rgba(255,255,255,0.1); color: #fff; }
.ci-btn-delete { padding: 7px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); border-radius: 8px; color: #f87171; cursor: pointer; display: flex; }
.ci-btn-delete:hover { background: rgba(220,38,38,0.2); }
.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 32px; font-size: 0.85rem; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); }
.modal { background: #0d1a10; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; width: 100%; max-width: 480px; display: flex; flex-direction: column; gap: 14px; }
.modal-title { font-size: 1rem; font-weight: 700; color: #fff; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
@media (max-width: 640px) { .tab-page { padding: 16px 12px; } .form-row { grid-template-columns: 1fr; } }
</style>
