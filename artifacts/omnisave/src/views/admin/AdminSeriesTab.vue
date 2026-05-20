<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">Series Management</h1>
        <p class="tab-sub">{{ adminStore.series.length }} series · {{ adminStore.episodes.length }} episodes</p>
      </div>
      <button class="btn-primary" @click="showSeriesForm = !showSeriesForm">
        <span>+</span> Add Series
      </button>
    </div>

    <!-- Add Series Form -->
    <div v-if="showSeriesForm" class="form-card">
      <h2 class="form-title">Add New Series</h2>
      <div class="form-grid">
        <div class="field">
          <label>Title *</label>
          <input v-model="sf.title" placeholder="Series title" />
        </div>
        <div class="field">
          <label>Rating (0–10)</label>
          <input v-model.number="sf.rating" type="number" min="0" max="10" step="0.1" />
        </div>
        <div class="field col-2">
          <label>Cover / Trailer URL *</label>
          <input v-model="sf.url" placeholder="https://example.com/series-cover.mp4" />
        </div>
        <div class="field">
          <label>Release Date</label>
          <input v-model="sf.date" type="date" />
        </div>
        <div class="field">
          <label>Genres (comma-separated)</label>
          <input v-model="sf.genres" placeholder="Drama, Thriller" />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-ghost" @click="showSeriesForm = false; resetSf()">Cancel</button>
        <button class="btn-primary" @click="addSeries" :disabled="!sf.title || !sf.url">Save Series</button>
      </div>
      <p v-if="seriesSaved" class="save-msg">✓ Series added successfully</p>
    </div>

    <!-- Series list -->
    <div class="section-label">All Series</div>
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th><th>Title</th><th>Rating</th><th>Genres</th><th>Episodes</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in adminStore.series" :key="s.id" :class="{ 'row-selected': selectedSeriesId === s.id }">
            <td class="td-id">{{ s.id }}</td>
            <td class="td-title">{{ s.title }}</td>
            <td>⭐ {{ s.rating }}</td>
            <td class="td-genres">{{ s.genres }}</td>
            <td>
              <span class="ep-count">{{ episodesFor(s.id).length }} ep</span>
            </td>
            <td class="td-actions">
              <button class="btn-manage" @click="selectSeries(s.id)">
                {{ selectedSeriesId === s.id ? 'Close' : 'Episodes' }}
              </button>
              <button class="btn-danger-sm" @click="deleteSeries(s.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="adminStore.series.length === 0">
            <td colspan="6" class="empty-row">No series added yet.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Episode Management Panel -->
    <div v-if="selectedSeriesId" class="episodes-panel">
      <div class="ep-panel-header">
        <div>
          <h2 class="ep-panel-title">Episodes — {{ selectedSeries?.title }}</h2>
          <p class="ep-panel-sub">{{ episodesFor(selectedSeriesId).length }} episodes</p>
        </div>
        <button class="btn-primary" @click="showEpForm = !showEpForm">
          <span>+</span> Add Episode
        </button>
      </div>

      <!-- Add Episode Form -->
      <div v-if="showEpForm" class="form-card">
        <h2 class="form-title">Add Episode</h2>
        <div class="form-grid">
          <div class="field">
            <label>Episode Title *</label>
            <input v-model="ef.title" placeholder="Episode title" />
          </div>
          <div class="field">
            <label>Season</label>
            <input v-model.number="ef.season" type="number" min="1" placeholder="1" />
          </div>
          <div class="field">
            <label>Episode Number</label>
            <input v-model.number="ef.episode" type="number" min="1" placeholder="1" />
          </div>
          <div class="field">
            <label>&nbsp;</label>
          </div>
          <div class="field col-2">
            <label>Video URL *</label>
            <input v-model="ef.url" placeholder="https://example.com/s1e1.mp4" />
          </div>
        </div>
        <div class="form-actions">
          <button class="btn-ghost" @click="showEpForm = false; resetEf()">Cancel</button>
          <button class="btn-primary" @click="addEpisode" :disabled="!ef.title || !ef.url">Save Episode</button>
        </div>
        <p v-if="epSaved" class="save-msg">✓ Episode added</p>
      </div>

      <!-- Episodes table -->
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr><th>S</th><th>E</th><th>Title</th><th>URL</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr v-for="ep in episodesFor(selectedSeriesId)" :key="ep.id">
              <td class="td-id">{{ ep.season }}</td>
              <td class="td-id">{{ ep.episode }}</td>
              <td class="td-title">{{ ep.title }}</td>
              <td><a :href="ep.url" target="_blank" class="url-link">{{ ep.url.length > 50 ? ep.url.slice(0,50)+'…' : ep.url }}</a></td>
              <td><button class="btn-danger-sm" @click="deleteEp(ep.id)">Delete</button></td>
            </tr>
            <tr v-if="episodesFor(selectedSeriesId).length === 0">
              <td colspan="5" class="empty-row">No episodes yet. Click "+ Add Episode".</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminStore } from '../../store/admin'

const showSeriesForm = ref(false)
const seriesSaved = ref(false)
const sf = ref({ title: '', url: '', rating: 8.0, date: '', genres: '' })

function resetSf() { sf.value = { title: '', url: '', rating: 8.0, date: '', genres: '' }; seriesSaved.value = false }

function addSeries() {
  adminStore.series.push({ id: adminStore.nextSeriesId++, title: sf.value.title, url: sf.value.url, rating: sf.value.rating, genres: sf.value.genres, date: sf.value.date, createdAt: new Date().toISOString().slice(0, 10) })
  seriesSaved.value = true
  setTimeout(() => { seriesSaved.value = false; showSeriesForm.value = false; resetSf() }, 1500)
}

function deleteSeries(id: number) {
  if (!confirm('Delete this series and all its episodes?')) return
  const si = adminStore.series.findIndex(s => s.id === id)
  if (si !== -1) adminStore.series.splice(si, 1)
  adminStore.episodes.splice(0, adminStore.episodes.length, ...adminStore.episodes.filter(e => e.seriesId !== id))
  if (selectedSeriesId.value === id) selectedSeriesId.value = null
}

// Episode management
const selectedSeriesId = ref<number | null>(null)
const showEpForm = ref(false)
const epSaved = ref(false)
const ef = ref({ title: '', season: 1, episode: 1, url: '' })

const selectedSeries = computed(() => adminStore.series.find(s => s.id === selectedSeriesId.value))

function selectSeries(id: number) {
  if (selectedSeriesId.value === id) { selectedSeriesId.value = null; showEpForm.value = false } else { selectedSeriesId.value = id; showEpForm.value = false }
}

function episodesFor(sid: number) {
  return adminStore.episodes.filter(e => e.seriesId === sid).sort((a, b) => a.season !== b.season ? a.season - b.season : a.episode - b.episode)
}

function resetEf() { ef.value = { title: '', season: 1, episode: 1, url: '' }; epSaved.value = false }

function addEpisode() {
  if (!selectedSeriesId.value) return
  adminStore.episodes.push({ id: adminStore.nextEpisodeId++, seriesId: selectedSeriesId.value, title: ef.value.title, season: ef.value.season, episode: ef.value.episode, url: ef.value.url })
  epSaved.value = true
  setTimeout(() => { epSaved.value = false; showEpForm.value = false; resetEf() }, 1500)
}

function deleteEp(id: number) {
  if (!confirm('Delete this episode?')) return
  const i = adminStore.episodes.findIndex(e => e.id === id)
  if (i !== -1) adminStore.episodes.splice(i, 1)
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.tab-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.8rem; color: rgba(255,255,255,0.4); }
.section-label { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 10px; }

.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
.form-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.col-2 { grid-column: span 2; }
.field label { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
.field input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
.field input:focus { border-color: rgba(0,255,157,0.5); }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; }
.save-msg { color: #00ff9d; font-size: 0.8rem; font-weight: 600; margin-top: 10px; text-align: right; }

.btn-primary { background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); color: #021a10; border: none; border-radius: 8px; padding: 9px 18px; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: filter 0.2s; }
.btn-primary:hover { filter: brightness(1.08); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 9px 18px; font-size: 0.78rem; font-weight: 600; cursor: pointer; }
.btn-manage { background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.25); color: #00ff9d; border-radius: 6px; padding: 5px 12px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.2s; margin-right: 6px; }
.btn-manage:hover { background: rgba(0,255,157,0.18); }
.btn-danger-sm { background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.3); color: #f87171; border-radius: 6px; padding: 5px 12px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.btn-danger-sm:hover { background: rgba(220,38,38,0.25); }

.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); margin-bottom: 20px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
.data-table thead th { background: rgba(255,255,255,0.04); padding: 11px 14px; text-align: left; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
.data-table tbody tr { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.03); }
.data-table tbody tr.row-selected { background: rgba(0,255,157,0.04); border-color: rgba(0,255,157,0.1); }
.data-table td { padding: 11px 14px; color: rgba(255,255,255,0.8); vertical-align: middle; }
.td-id { color: rgba(255,255,255,0.3); font-size: 0.75rem; }
.td-title { font-weight: 600; color: #fff; }
.td-genres { font-size: 0.78rem; color: rgba(255,255,255,0.5); }
.td-actions { white-space: nowrap; }
.url-link { color: rgba(0,255,157,0.7); text-decoration: none; font-size: 0.75rem; }
.url-link:hover { color: #00ff9d; }
.empty-row { text-align: center; color: rgba(255,255,255,0.25); padding: 32px; }
.ep-count { background: rgba(255,255,255,0.07); border-radius: 4px; padding: 2px 8px; font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.5); }

.episodes-panel { background: rgba(0,255,157,0.02); border: 1px solid rgba(0,255,157,0.1); border-radius: 16px; padding: 20px; margin-top: 8px; }
.ep-panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
.ep-panel-title { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 2px; }
.ep-panel-sub { font-size: 0.78rem; color: rgba(255,255,255,0.4); }

@media (max-width: 640px) {
  .tab-page { padding: 16px 12px; }
  .form-grid { grid-template-columns: 1fr; }
  .col-2 { grid-column: span 1; }
}
</style>
