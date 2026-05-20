<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Series</h1>
      <p class="tab-sub">Total: {{ adminStore.series.length }} series</p>
    </div>

    <!-- Add Form -->
    <div class="form-card">
      <h2 class="form-title">Add New Series</h2>
      <div class="form-grid">
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
        <div class="field col-2">
          <label>Poster Image URL</label>
          <input v-model="sf.posterUrl" placeholder="https://example.com/poster/image.jpg" />
        </div>
        <div class="field">
          <label>Rating (0–10)</label>
          <input v-model.number="sf.rating" type="number" min="0" max="10" step="0.1" placeholder="7.5" />
        </div>
        <div class="field">
          <label>Year</label>
          <input v-model.number="sf.year" type="number" min="1900" max="2099" placeholder="2025" />
        </div>
      </div>

      <!-- Episodes Section -->
      <div class="episodes-section">
        <div class="ep-section-header">
          <span class="ep-section-title">Episodes</span>
          <button class="btn-add-ep" @click="addEpField">+ Add Episode</button>
        </div>
        <div v-for="(ep, i) in sf.episodes" :key="i" class="ep-row">
          <div class="ep-num">Episode {{ i + 1 }}</div>
          <div class="ep-fields">
            <input v-model="ep.title" placeholder="Episode title" class="ep-input" />
            <input v-model="ep.url" placeholder="Stream link URL" class="ep-input" />
          </div>
          <button class="ep-remove" @click="removeEpField(i)">✕</button>
        </div>
        <div v-if="sf.episodes.length === 0" class="ep-empty">No episodes added yet. Click "+ Add Episode".</div>
      </div>

      <button class="btn-add" @click="addSeries" :disabled="!sf.title">Add Series</button>
      <p v-if="saved" class="save-msg">✓ Series added successfully</p>
    </div>

    <!-- Series Grid -->
    <div class="series-grid">
      <div v-for="s in adminStore.series" :key="s.id" class="series-card">
        <div class="sc-poster">
          <img v-if="s.posterUrl" :src="s.posterUrl" alt="" class="sc-img" @error="onImgErr" />
          <div v-else class="sc-no-poster">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>
          </div>
          <span class="sc-cat-badge">{{ s.category }}</span>
          <span class="sc-ep-count">{{ episodesFor(s.id).length }} ep</span>
        </div>
        <div class="sc-body">
          <p class="sc-title">{{ s.title }}</p>
          <p class="sc-meta">⭐ {{ s.rating }} · {{ s.year }}</p>
          <div class="sc-actions">
            <button class="sc-btn-ep" @click="selectSeries(s.id)">
              {{ selectedSeriesId === s.id ? 'Close' : 'Episodes' }}
            </button>
            <button class="sc-btn-del" @click="deleteSeries(s.id)">Delete</button>
          </div>
        </div>
      </div>
      <div v-if="adminStore.series.length === 0" class="empty">No series added yet.</div>
    </div>

    <!-- Episode Panel -->
    <div v-if="selectedSeriesId" class="ep-panel">
      <div class="ep-panel-header">
        <div>
          <h2 class="ep-panel-title">Episodes — {{ selectedSeries?.title }}</h2>
          <p class="ep-panel-sub">{{ episodesFor(selectedSeriesId).length }} episodes</p>
        </div>
        <button class="btn-add-inline" @click="showEpForm = !showEpForm">+ Add Episode</button>
      </div>
      <div v-if="showEpForm" class="ep-form">
        <div class="form-grid">
          <div class="field">
            <label>Episode Title <span class="req">*</span></label>
            <input v-model="ef.title" placeholder="Episode title" />
          </div>
          <div class="field">
            <label>Season</label>
            <input v-model.number="ef.season" type="number" min="1" placeholder="1" />
          </div>
          <div class="field">
            <label>Episode #</label>
            <input v-model.number="ef.episode" type="number" min="1" placeholder="1" />
          </div>
          <div class="field col-2">
            <label>Video URL <span class="req">*</span></label>
            <input v-model="ef.url" placeholder="https://example.com/s1e1.mp4" />
          </div>
        </div>
        <div class="ep-form-actions">
          <button class="btn-ghost" @click="showEpForm = false; resetEf()">Cancel</button>
          <button class="btn-add sm" @click="addEpisode" :disabled="!ef.title || !ef.url">Save Episode</button>
        </div>
      </div>
      <div class="ep-list">
        <div v-for="ep in episodesFor(selectedSeriesId)" :key="ep.id" class="ep-item">
          <span class="ep-badge">S{{ ep.season }}E{{ ep.episode }}</span>
          <span class="ep-title">{{ ep.title }}</span>
          <a :href="ep.url" target="_blank" class="ep-link">{{ ep.url.length > 40 ? ep.url.slice(0,40)+'…' : ep.url }}</a>
          <button class="ep-del" @click="deleteEp(ep.id)">✕</button>
        </div>
        <div v-if="episodesFor(selectedSeriesId).length === 0" class="ep-empty-panel">No episodes yet.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminStore } from '../../store/admin'

const CATEGORIES = ['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller']

const saved = ref(false)
const sf = ref({ title: '', category: 'Drama', posterUrl: '', rating: 7.5, year: new Date().getFullYear(), episodes: [] as { title: string; url: string }[] })

function addEpField() { sf.value.episodes.push({ title: '', url: '' }) }
function removeEpField(i: number) { sf.value.episodes.splice(i, 1) }

function addSeries() {
  const newSeries = {
    id: adminStore.nextSeriesId++,
    title: sf.value.title,
    category: sf.value.category,
    posterUrl: sf.value.posterUrl,
    rating: sf.value.rating,
    year: sf.value.year,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  adminStore.series.push(newSeries)
  sf.value.episodes.forEach((ep, i) => {
    if (ep.title && ep.url) {
      adminStore.episodes.push({ id: adminStore.nextEpisodeId++, seriesId: newSeries.id, title: ep.title, season: 1, episode: i + 1, url: ep.url })
    }
  })
  saved.value = true
  sf.value = { title: '', category: 'Drama', posterUrl: '', rating: 7.5, year: new Date().getFullYear(), episodes: [] }
  setTimeout(() => { saved.value = false }, 2000)
}

function deleteSeries(id: number) {
  if (!confirm('Delete this series and all its episodes?')) return
  const i = adminStore.series.findIndex(s => s.id === id)
  if (i !== -1) adminStore.series.splice(i, 1)
  adminStore.episodes.splice(0, adminStore.episodes.length, ...adminStore.episodes.filter(e => e.seriesId !== id))
  if (selectedSeriesId.value === id) selectedSeriesId.value = null
}

const selectedSeriesId = ref<number | null>(null)
const showEpForm = ref(false)
const ef = ref({ title: '', season: 1, episode: 1, url: '' })
const selectedSeries = computed(() => adminStore.series.find(s => s.id === selectedSeriesId.value))

function selectSeries(id: number) {
  selectedSeriesId.value = selectedSeriesId.value === id ? null : id
  showEpForm.value = false
}

function episodesFor(sid: number) {
  return adminStore.episodes.filter(e => e.seriesId === sid).sort((a, b) => a.season !== b.season ? a.season - b.season : a.episode - b.episode)
}

function resetEf() { ef.value = { title: '', season: 1, episode: 1, url: '' } }

function addEpisode() {
  if (!selectedSeriesId.value) return
  adminStore.episodes.push({ id: adminStore.nextEpisodeId++, seriesId: selectedSeriesId.value, title: ef.value.title, season: ef.value.season, episode: ef.value.episode, url: ef.value.url })
  showEpForm.value = false
  resetEf()
}

function deleteEp(id: number) {
  const i = adminStore.episodes.findIndex(e => e.id === id)
  if (i !== -1) adminStore.episodes.splice(i, 1)
}

function onImgErr(e: Event) {
  (e.target as HTMLImageElement).style.display = 'none'
}
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
.field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
.field input:focus { border-color: rgba(0,255,157,0.4); }
.field input::placeholder { color: rgba(255,255,255,0.25); }
.select-wrap { position: relative; }
.select-wrap select { width: 100%; appearance: none; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 36px 9px 12px; color: rgba(255,255,255,0.8); font-size: 0.85rem; outline: none; cursor: pointer; }
.select-wrap select option { background: #0d1a10; }
.sel-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(255,255,255,0.4); }

.episodes-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.ep-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.ep-section-title { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.6); }
.btn-add-ep { padding: 5px 14px; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.25); color: #00ff9d; border-radius: 6px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.ep-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.ep-num { font-size: 0.68rem; color: rgba(255,255,255,0.35); white-space: nowrap; width: 60px; flex-shrink: 0; }
.ep-fields { display: flex; gap: 8px; flex: 1; }
.ep-input { flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 7px; padding: 7px 10px; color: #fff; font-size: 0.8rem; outline: none; }
.ep-input:focus { border-color: rgba(0,255,157,0.3); }
.ep-input::placeholder { color: rgba(255,255,255,0.2); }
.ep-remove { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; font-size: 0.9rem; padding: 4px; transition: color 0.15s; }
.ep-remove:hover { color: #f87171; }
.ep-empty { font-size: 0.75rem; color: rgba(255,255,255,0.25); text-align: center; padding: 8px 0; }

.btn-add { width: 100%; padding: 11px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: filter 0.2s; letter-spacing: 0.04em; }
.btn-add:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-add.sm { width: auto; padding: 9px 20px; }
.btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 9px 18px; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
.btn-add-inline { padding: 7px 16px; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.25); color: #00ff9d; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; }
.save-msg { color: #00ff9d; font-size: 0.78rem; font-weight: 600; margin-top: 10px; text-align: center; }

.series-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
.series-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, transform 0.15s; }
.series-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
.sc-poster { position: relative; aspect-ratio: 2/3; background: rgba(255,255,255,0.04); overflow: hidden; }
.sc-img { width: 100%; height: 100%; object-fit: cover; }
.sc-no-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.sc-cat-badge { position: absolute; top: 8px; left: 8px; font-size: 0.58rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; background: rgba(37,99,235,0.8); color: #fff; }
.sc-ep-count { position: absolute; top: 8px; right: 8px; font-size: 0.58rem; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px; color: rgba(255,255,255,0.8); font-weight: 700; }
.sc-body { padding: 12px; }
.sc-title { font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 4px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sc-meta { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 10px; }
.sc-actions { display: flex; flex-direction: column; gap: 6px; }
.sc-btn-ep { padding: 5px 10px; background: rgba(0,255,157,0.08); border: 1px solid rgba(0,255,157,0.2); color: #00ff9d; border-radius: 6px; font-size: 0.68rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.sc-btn-ep:hover { background: rgba(0,255,157,0.16); }
.sc-btn-del { padding: 5px 10px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; border-radius: 6px; font-size: 0.68rem; font-weight: 700; cursor: pointer; }
.sc-btn-del:hover { background: rgba(220,38,38,0.2); }

.ep-panel { background: rgba(0,255,157,0.02); border: 1px solid rgba(0,255,157,0.1); border-radius: 14px; padding: 20px; margin-top: 8px; }
.ep-panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.ep-panel-title { font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 2px; }
.ep-panel-sub { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
.ep-form { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 16px; margin-bottom: 14px; }
.ep-form-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 12px; }
.ep-list { display: flex; flex-direction: column; gap: 6px; }
.ep-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; }
.ep-badge { font-size: 0.65rem; font-weight: 800; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.2); color: #00ff9d; padding: 2px 7px; border-radius: 4px; white-space: nowrap; flex-shrink: 0; }
.ep-title { font-size: 0.8rem; font-weight: 600; color: #fff; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ep-link { font-size: 0.72rem; color: rgba(0,255,157,0.6); text-decoration: none; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0; }
.ep-del { background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; font-size: 0.85rem; padding: 2px 6px; transition: color 0.15s; flex-shrink: 0; }
.ep-del:hover { color: #f87171; }
.ep-empty-panel { font-size: 0.8rem; color: rgba(255,255,255,0.25); text-align: center; padding: 16px; }

.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px; grid-column: 1/-1; font-size: 0.85rem; }

@media (max-width: 640px) { .tab-page { padding: 16px 12px; } .form-grid { grid-template-columns: 1fr; } .col-2 { grid-column: span 1; } .ep-fields { flex-direction: column; } }
</style>
