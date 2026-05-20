<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Series</h1>
      <p class="tab-sub">Total: {{ adminStore.series.length }} series</p>
    </div>

    <!-- Add / Edit Form -->
    <div class="form-card" :class="{ editing: editingId !== null }">
      <div class="form-title-row">
        <h2 class="form-title">{{ editingId !== null ? 'Edit Series' : 'Add New Series' }}</h2>
        <button v-if="editingId !== null" class="cancel-edit-btn" @click="cancelEdit">✕ Cancel Edit</button>
      </div>
      <div class="form-row-3">
        <div class="field">
          <label>Series Title <span class="req">*</span></label>
          <input v-model="sf.title" placeholder="Enter series title" />
        </div>
        <div class="field">
          <label>Category <span class="req">*</span></label>
          <div class="select-wrap">
            <select v-model="sf.category">
              <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
            </select>
            <svg class="sel-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="field">
          <label>Poster Image URL <span class="req">*</span></label>
          <input v-model="sf.posterUrl" placeholder="https://example.com/image.jpg" />
        </div>
      </div>
      <div class="form-row-2">
        <div class="field">
          <label>Rating (0-10)</label>
          <input v-model.number="sf.rating" type="number" min="0" max="10" step="0.1" placeholder="7.5" />
        </div>
        <div class="field">
          <label>Year</label>
          <input v-model.number="sf.year" type="number" min="1900" max="2099" placeholder="2025" />
        </div>
      </div>

      <!-- Episodes Section -->
      <div class="ep-section">
        <div class="ep-section-label">Episodes</div>
        <div v-for="(ep, i) in sf.episodes" :key="i" class="ep-row">
          <span class="ep-num-label">Episode {{ i + 1 }}</span>
          <input v-model="ep.title" placeholder="Episode title" class="ep-input" />
          <input v-model="ep.url" placeholder="Download link URL" class="ep-input" />
          <button class="ep-remove" @click="sf.episodes.splice(i, 1)">✕</button>
        </div>
        <button class="btn-add-ep" @click="sf.episodes.push({ title: '', url: '' })">+ Add Episode</button>
      </div>

      <button class="btn-add-series" @click="submitForm" :disabled="!sf.title">
        {{ editingId !== null ? 'Update Series' : 'Add Series' }}
      </button>
    </div>

    <!-- Series Grid -->
    <div class="series-grid">
      <div v-for="s in adminStore.series" :key="s.id" class="series-card" :class="{ 'is-editing': editingId === s.id }">
        <div class="sc-poster">
          <img v-if="s.posterUrl" :src="s.posterUrl" alt="" class="sc-img" @error="onImgErr" />
          <div v-else class="sc-no-poster">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>
          </div>
          <span class="sc-cat-badge" :class="catCls(s.category)">{{ s.category }}</span>
          <span class="sc-ep-badge">{{ episodesFor(s.id).length }} Eps</span>
        </div>
        <div class="sc-body">
          <p class="sc-title">{{ s.title }}</p>
          <p class="sc-meta">⭐ {{ s.rating }} · {{ s.year }}</p>
          <div class="sc-actions">
            <button class="sc-btn-edit" @click="loadEdit(s)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button class="sc-btn-del" @click="deleteSeries(s.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-if="adminStore.series.length === 0" class="empty">No series added yet. Use the form above to add your first series.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { adminStore, type AdminSeries } from '../../store/admin'

const CATEGORIES = ['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller']

const defaultSf = () => ({ title: '', category: 'Animation', posterUrl: '', rating: 7.5, year: new Date().getFullYear(), episodes: [] as { title: string; url: string }[] })

const sf = ref(defaultSf())
const editingId = ref<number | null>(null)

function loadEdit(s: AdminSeries) {
  editingId.value = s.id
  sf.value = {
    title: s.title,
    category: s.category,
    posterUrl: s.posterUrl,
    rating: s.rating,
    year: s.year,
    episodes: episodesFor(s.id).map(e => ({ title: e.title, url: e.url })),
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancelEdit() {
  editingId.value = null
  sf.value = defaultSf()
}

function submitForm() {
  if (!sf.value.title) return

  if (editingId.value !== null) {
    const i = adminStore.series.findIndex(s => s.id === editingId.value)
    if (i !== -1) {
      Object.assign(adminStore.series[i], {
        title: sf.value.title,
        category: sf.value.category,
        posterUrl: sf.value.posterUrl,
        rating: sf.value.rating,
        year: sf.value.year,
      })
    }
    const sid = editingId.value
    const toRemove = adminStore.episodes.filter(e => e.seriesId === sid).map(e => e.id)
    toRemove.forEach(eid => {
      const idx = adminStore.episodes.findIndex(e => e.id === eid)
      if (idx !== -1) adminStore.episodes.splice(idx, 1)
    })
    sf.value.episodes.forEach((ep, idx) => {
      if (ep.title || ep.url) {
        adminStore.episodes.push({ id: adminStore.nextEpisodeId++, seriesId: sid, title: ep.title || `Episode ${idx + 1}`, season: 1, episode: idx + 1, url: ep.url })
      }
    })
    editingId.value = null
  } else {
    const newId = adminStore.nextSeriesId++
    adminStore.series.push({
      id: newId,
      title: sf.value.title,
      category: sf.value.category,
      posterUrl: sf.value.posterUrl,
      rating: sf.value.rating,
      year: sf.value.year,
      createdAt: new Date().toISOString().slice(0, 10),
    })
    sf.value.episodes.forEach((ep, i) => {
      if (ep.title || ep.url) {
        adminStore.episodes.push({ id: adminStore.nextEpisodeId++, seriesId: newId, title: ep.title || `Episode ${i + 1}`, season: 1, episode: i + 1, url: ep.url })
      }
    })
  }

  sf.value = defaultSf()
}

function deleteSeries(id: number) {
  if (editingId.value === id) cancelEdit()
  if (!confirm('Delete this series and all its episodes?')) return
  const i = adminStore.series.findIndex(s => s.id === id)
  if (i !== -1) adminStore.series.splice(i, 1)
  const toRemove = adminStore.episodes.filter(e => e.seriesId === id).map(e => e.id)
  toRemove.forEach(eid => {
    const idx = adminStore.episodes.findIndex(e => e.id === eid)
    if (idx !== -1) adminStore.episodes.splice(idx, 1)
  })
}

function episodesFor(sid: number) {
  return adminStore.episodes.filter(e => e.seriesId === sid)
}

function catCls(cat: string) {
  const map: Record<string, string> = { Action: 'cat-action', Animation: 'cat-anim', Drama: 'cat-drama', Horror: 'cat-horror', Comedy: 'cat-comedy', Thriller: 'cat-thriller', 'Sci-Fi': 'cat-scifi', Romance: 'cat-romance' }
  return map[cat] || 'cat-default'
}

function onImgErr(e: Event) {
  const el = e.target as HTMLImageElement
  el.style.display = 'none'
  const parent = el.parentElement
  if (parent) {
    const placeholder = parent.querySelector('.sc-no-poster') as HTMLElement
    if (placeholder) placeholder.style.display = 'flex'
  }
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { margin-bottom: 20px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.4); }

.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 28px; display: flex; flex-direction: column; gap: 14px; transition: border-color 0.2s; }
.form-card.editing { border-color: rgba(0,255,157,0.25); background: rgba(0,255,157,0.02); }
.form-title-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.form-title { font-size: 0.95rem; font-weight: 700; color: #fff; }
.cancel-edit-btn { padding: 5px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 7px; color: rgba(255,255,255,0.5); font-size: 0.72rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.cancel-edit-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }

.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
.form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
.req { color: #f87171; }
.field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.83rem; outline: none; transition: border-color 0.2s; width: 100%; box-sizing: border-box; }
.field input:focus { border-color: rgba(0,255,157,0.4); }
.field input::placeholder { color: rgba(255,255,255,0.2); }
.select-wrap { position: relative; }
.select-wrap select { width: 100%; appearance: none; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 36px 9px 12px; color: rgba(255,255,255,0.8); font-size: 0.83rem; outline: none; cursor: pointer; }
.select-wrap select option { background: #0d1a10; }
.sel-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(255,255,255,0.4); }

.ep-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.ep-section-label { font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.08em; text-transform: uppercase; }
.ep-row { display: flex; align-items: center; gap: 8px; }
.ep-num-label { font-size: 0.68rem; color: rgba(255,255,255,0.3); white-space: nowrap; min-width: 56px; flex-shrink: 0; }
.ep-input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; padding: 8px 10px; color: #fff; font-size: 0.8rem; outline: none; min-width: 0; }
.ep-input:focus { border-color: rgba(0,255,157,0.3); }
.ep-input::placeholder { color: rgba(255,255,255,0.18); }
.ep-remove { background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; font-size: 0.85rem; padding: 4px 6px; flex-shrink: 0; transition: color 0.15s; }
.ep-remove:hover { color: #f87171; }

.btn-add-ep { width: 100%; padding: 9px; background: #16a34a; border: none; border-radius: 8px; color: #fff; font-size: 0.82rem; font-weight: 700; cursor: pointer; transition: filter 0.2s; }
.btn-add-ep:hover { filter: brightness(1.12); }
.btn-add-series { padding: 11px 20px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: filter 0.2s; width: 100%; }
.btn-add-series:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add-series:disabled { opacity: 0.4; cursor: not-allowed; }

.series-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 16px; }
.series-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, transform 0.15s; display: flex; flex-direction: column; }
.series-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }
.series-card.is-editing { border-color: rgba(0,255,157,0.35); box-shadow: 0 0 0 1px rgba(0,255,157,0.15); }

.sc-poster { position: relative; aspect-ratio: 2/3; background: #0d1a10; overflow: hidden; flex-shrink: 0; }
.sc-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sc-no-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.sc-cat-badge { position: absolute; top: 8px; left: 8px; font-size: 0.6rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; z-index: 1; }
.cat-action { background: rgba(239,68,68,0.85); color: #fff; }
.cat-anim { background: rgba(124,58,237,0.85); color: #fff; }
.cat-drama { background: rgba(37,99,235,0.85); color: #fff; }
.cat-horror { background: rgba(10,10,10,0.9); color: #f87171; border: 1px solid rgba(248,113,113,0.4); }
.cat-comedy { background: rgba(234,179,8,0.85); color: #000; }
.cat-thriller { background: rgba(220,38,38,0.85); color: #fff; }
.cat-scifi { background: rgba(6,182,212,0.85); color: #fff; }
.cat-romance { background: rgba(236,72,153,0.85); color: #fff; }
.cat-default { background: rgba(255,255,255,0.18); color: #fff; }
.sc-ep-badge { position: absolute; top: 8px; right: 8px; background: rgba(255,165,0,0.85); color: #fff; font-size: 0.62rem; font-weight: 800; padding: 3px 7px; border-radius: 4px; z-index: 1; }

.sc-body { padding: 12px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.sc-title { font-size: 0.82rem; font-weight: 700; color: #fff; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
.sc-meta { font-size: 0.7rem; color: rgba(255,255,255,0.35); margin-bottom: 10px; }
.sc-actions { display: flex; flex-direction: column; gap: 5px; margin-top: auto; }
.sc-btn-edit { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.sc-btn-edit:hover { background: rgba(34,197,94,0.22); }
.sc-btn-del { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.sc-btn-del:hover { background: rgba(220,38,38,0.22); }

.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px 20px; grid-column: 1/-1; font-size: 0.85rem; }

@media (max-width: 768px) {
  .tab-page { padding: 16px 12px; }
  .form-row-3 { grid-template-columns: 1fr; }
  .form-row-2 { grid-template-columns: 1fr; }
  .series-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
  .ep-row { flex-wrap: wrap; }
}
</style>
