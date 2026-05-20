<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">Movies Management</h1>
        <p class="tab-sub">{{ adminStore.movies.length }} titles uploaded</p>
      </div>
      <button class="btn-primary" @click="showForm = !showForm">
        <span>+</span> Upload Movie
      </button>
    </div>

    <!-- Upload Form -->
    <div v-if="showForm" class="form-card">
      <h2 class="form-title">Upload New Movie</h2>
      <div class="form-grid">
        <div class="field">
          <label>Title *</label>
          <input v-model="form.title" placeholder="Movie title" />
        </div>
        <div class="field">
          <label>Type *</label>
          <select v-model="form.type">
            <option value="MOVIES">Movie</option>
            <option value="TV SERIES">TV Series</option>
            <option value="ANIMATION">Animation</option>
          </select>
        </div>
        <div class="field col-2">
          <label>Video URL *</label>
          <input v-model="form.url" placeholder="https://example.com/movie.mp4" />
        </div>
        <div class="field">
          <label>Rating (0–10)</label>
          <input v-model.number="form.rating" type="number" min="0" max="10" step="0.1" placeholder="7.5" />
        </div>
        <div class="field">
          <label>Release Date</label>
          <input v-model="form.date" type="date" />
        </div>
        <div class="field col-2">
          <label>Genres (comma-separated)</label>
          <input v-model="form.genres" placeholder="Action, Thriller, Drama" />
        </div>
      </div>
      <div class="form-actions">
        <button class="btn-ghost" @click="showForm = false; resetForm()">Cancel</button>
        <button class="btn-primary" @click="addMovie" :disabled="!form.title || !form.url">Save Movie</button>
      </div>
      <p v-if="saved" class="save-msg">✓ Movie uploaded successfully</p>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Rating</th>
            <th>URL</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in adminStore.movies" :key="m.id">
            <td class="td-id">{{ m.id }}</td>
            <td class="td-title">{{ m.title }}</td>
            <td><span class="type-badge" :class="typeCls(m.type)">{{ typeLabel(m.type) }}</span></td>
            <td>⭐ {{ m.rating }}</td>
            <td class="td-url"><a :href="m.url" target="_blank" class="url-link">{{ m.url.length > 40 ? m.url.slice(0, 40) + '…' : m.url }}</a></td>
            <td>{{ m.date }}</td>
            <td>
              <button class="btn-danger-sm" @click="deleteMovie(m.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="adminStore.movies.length === 0">
            <td colspan="7" class="empty-row">No movies uploaded yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { adminStore } from '../../store/admin'

const showForm = ref(false)
const saved = ref(false)

const form = ref({ title: '', type: 'MOVIES' as 'MOVIES' | 'TV SERIES' | 'ANIMATION', url: '', rating: 7.0, date: '', genres: '' })

function resetForm() {
  form.value = { title: '', type: 'MOVIES', url: '', rating: 7.0, date: '', genres: '' }
  saved.value = false
}

function addMovie() {
  adminStore.movies.push({
    id: adminStore.nextMovieId++,
    title: form.value.title,
    type: form.value.type,
    url: form.value.url,
    rating: form.value.rating,
    genres: form.value.genres,
    date: form.value.date,
    createdAt: new Date().toISOString().slice(0, 10),
  })
  saved.value = true
  setTimeout(() => { saved.value = false; showForm.value = false; resetForm() }, 1500)
}

function deleteMovie(id: number) {
  if (confirm('Delete this movie?')) {
    const idx = adminStore.movies.findIndex(m => m.id === id)
    if (idx !== -1) adminStore.movies.splice(idx, 1)
  }
}

function typeLabel(t: string) {
  if (t === 'MOVIES') return 'Movie'
  if (t === 'TV SERIES') return 'Series'
  return 'Anime'
}
function typeCls(t: string) {
  if (t === 'MOVIES') return 'badge-movie'
  if (t === 'TV SERIES') return 'badge-series'
  return 'badge-anim'
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.tab-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.8rem; color: rgba(255,255,255,0.4); }

.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
.form-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 20px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.col-2 { grid-column: span 2; }
.field label { font-size: 0.72rem; font-weight: 700; color: rgba(255,255,255,0.5); letter-spacing: 0.06em; text-transform: uppercase; }
.field input, .field select {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 0.85rem; outline: none;
  transition: border-color 0.2s;
}
.field input:focus, .field select:focus { border-color: rgba(0,255,157,0.5); }
.field select option { background: #0d1a10; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; }
.save-msg { color: #00ff9d; font-size: 0.8rem; font-weight: 600; margin-top: 10px; text-align: right; }

.btn-primary {
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; border: none; border-radius: 8px; padding: 9px 18px;
  font-size: 0.78rem; font-weight: 800; letter-spacing: 0.08em; cursor: pointer;
  display: flex; align-items: center; gap: 6px; transition: filter 0.2s;
}
.btn-primary:hover { filter: brightness(1.08); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-ghost {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.6); border-radius: 8px; padding: 9px 18px;
  font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: background 0.2s;
}
.btn-ghost:hover { background: rgba(255,255,255,0.09); }
.btn-danger-sm {
  background: rgba(220,38,38,0.15); border: 1px solid rgba(220,38,38,0.3);
  color: #f87171; border-radius: 6px; padding: 5px 12px;
  font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.2s;
}
.btn-danger-sm:hover { background: rgba(220,38,38,0.25); }

.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
.data-table thead th {
  background: rgba(255,255,255,0.04); padding: 11px 14px; text-align: left;
  font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase;
  white-space: nowrap;
}
.data-table tbody tr { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.03); }
.data-table td { padding: 11px 14px; color: rgba(255,255,255,0.8); vertical-align: middle; }
.td-id { color: rgba(255,255,255,0.3); font-size: 0.75rem; }
.td-title { font-weight: 600; color: #fff; }
.td-url { max-width: 200px; }
.url-link { color: rgba(0,255,157,0.7); text-decoration: none; font-size: 0.75rem; }
.url-link:hover { color: #00ff9d; }
.empty-row { text-align: center; color: rgba(255,255,255,0.25); padding: 32px; }

.type-badge { font-size: 0.65rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.06em; }
.badge-movie { background: rgba(0,255,157,0.1); color: #00ff9d; border: 1px solid rgba(0,255,157,0.2); }
.badge-series { background: rgba(255,166,0,0.1); color: #ffa600; border: 1px solid rgba(255,166,0,0.2); }
.badge-anim { background: rgba(208,138,255,0.1); color: #d08aff; border: 1px solid rgba(208,138,255,0.2); }

@media (max-width: 640px) {
  .tab-page { padding: 16px 12px; }
  .form-grid { grid-template-columns: 1fr; }
  .col-2 { grid-column: span 1; }
}
</style>
