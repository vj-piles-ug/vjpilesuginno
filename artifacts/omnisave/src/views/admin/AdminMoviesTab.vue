<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Movies</h1>
      <p class="tab-sub">Total: {{ adminStore.movies.length }} movies</p>
    </div>

    <!-- Add Form -->
    <div class="form-card">
      <h2 class="form-title">Add New Movie</h2>
      <div class="form-grid">
        <div class="field">
          <label>Movie Title <span class="req">*</span></label>
          <input v-model="form.title" placeholder="Enter movie title" />
        </div>
        <div class="field">
          <label>Category <span class="req">*</span></label>
          <div class="select-wrap">
            <select v-model="form.category">
              <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
            </select>
            <svg class="sel-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
        <div class="field col-2">
          <label>Stream Link <span class="req">*</span></label>
          <input v-model="form.streamUrl" placeholder="https://example.com/stream/movie.mp4" />
        </div>
        <div class="field">
          <label>Rating (0–10)</label>
          <input v-model.number="form.rating" type="number" min="0" max="10" step="0.1" placeholder="7.5" />
        </div>
        <div class="field">
          <label>Year</label>
          <input v-model.number="form.year" type="number" min="1900" max="2099" placeholder="2025" />
        </div>
        <div class="field col-2">
          <label>Poster Image URL</label>
          <input v-model="form.posterUrl" placeholder="https://example.com/poster/image.jpg" />
        </div>
        <div class="field col-2">
          <label class="check-label">
            <input type="checkbox" v-model="form.trending" class="check-input" />
            <span class="check-box"></span>
            Mark as Trending
          </label>
        </div>
      </div>
      <button class="btn-add" @click="addMovie" :disabled="!form.title || !form.streamUrl">Add Movie</button>
      <p v-if="saved" class="save-msg">✓ Movie added successfully</p>
    </div>

    <!-- Movies Grid -->
    <div class="movies-grid">
      <div v-for="m in adminStore.movies" :key="m.id" class="movie-card">
        <div class="mc-poster">
          <img v-if="m.posterUrl" :src="m.posterUrl" alt="" class="mc-img" @error="onImgErr" />
          <div v-else class="mc-no-poster">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>
          </div>
          <span class="mc-cat-badge" :class="catCls(m.category)">{{ m.category }}</span>
          <span v-if="m.trending" class="mc-trending">🔥 Trending</span>
        </div>
        <div class="mc-body">
          <p class="mc-title">{{ m.title }}</p>
          <p class="mc-meta">⭐ {{ m.rating }} · {{ m.year }}</p>
          <div class="mc-actions">
            <button class="mc-btn-edit" @click="toggleTrending(m)">
              {{ m.trending ? 'Untrend' : 'Mark Trending' }}
            </button>
            <button class="mc-btn-del" @click="deleteMovie(m.id)">Delete</button>
          </div>
        </div>
      </div>
      <div v-if="adminStore.movies.length === 0" class="empty">No movies added yet.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { adminStore } from '../../store/admin'

const CATEGORIES = ['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller']

const saved = ref(false)
const form = ref({ title: '', category: 'Action', streamUrl: '', posterUrl: '', rating: 7.5, year: new Date().getFullYear(), trending: false })

function addMovie() {
  adminStore.movies.push({
    id: adminStore.nextMovieId++,
    title: form.value.title,
    category: form.value.category,
    streamUrl: form.value.streamUrl,
    posterUrl: form.value.posterUrl,
    rating: form.value.rating,
    year: form.value.year,
    trending: form.value.trending,
    createdAt: new Date().toISOString().slice(0, 10),
  })
  saved.value = true
  form.value = { title: '', category: 'Action', streamUrl: '', posterUrl: '', rating: 7.5, year: new Date().getFullYear(), trending: false }
  setTimeout(() => { saved.value = false }, 2000)
}

function deleteMovie(id: number) {
  if (!confirm('Delete this movie?')) return
  const i = adminStore.movies.findIndex(m => m.id === id)
  if (i !== -1) adminStore.movies.splice(i, 1)
}

function toggleTrending(m: typeof adminStore.movies[0]) {
  m.trending = !m.trending
}

function catCls(cat: string) {
  const map: Record<string, string> = { Action: 'cat-action', Animation: 'cat-anim', Drama: 'cat-drama', Horror: 'cat-horror', Comedy: 'cat-comedy' }
  return map[cat] || 'cat-default'
}

function onImgErr(e: Event) {
  const el = e.target as HTMLImageElement
  el.style.display = 'none'
  el.nextElementSibling && ((el.nextElementSibling as HTMLElement).style.display = 'flex')
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
.check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.82rem; color: rgba(255,255,255,0.7); font-weight: 600; text-transform: none; letter-spacing: 0; }
.check-input { display: none; }
.check-box { width: 18px; height: 18px; border-radius: 5px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, border-color 0.15s; }
.check-input:checked + .check-box { background: #7c3aed; border-color: #7c3aed; }
.check-input:checked + .check-box::after { content: '✓'; color: #fff; font-size: 0.7rem; font-weight: 800; }

.btn-add { width: 100%; padding: 11px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: filter 0.2s; letter-spacing: 0.04em; }
.btn-add:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
.save-msg { color: #00ff9d; font-size: 0.78rem; font-weight: 600; margin-top: 10px; text-align: center; }

.movies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
.movie-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, transform 0.15s; }
.movie-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
.mc-poster { position: relative; aspect-ratio: 2/3; background: rgba(255,255,255,0.04); overflow: hidden; }
.mc-img { width: 100%; height: 100%; object-fit: cover; }
.mc-no-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.mc-cat-badge { position: absolute; top: 8px; left: 8px; font-size: 0.6rem; font-weight: 800; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.05em; }
.cat-action { background: rgba(239,68,68,0.8); color: #fff; }
.cat-anim { background: rgba(124,58,237,0.8); color: #fff; }
.cat-drama { background: rgba(37,99,235,0.8); color: #fff; }
.cat-horror { background: rgba(0,0,0,0.8); color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
.cat-comedy { background: rgba(234,179,8,0.8); color: #000; }
.cat-default { background: rgba(255,255,255,0.15); color: #fff; }
.mc-trending { position: absolute; top: 8px; right: 8px; font-size: 0.58rem; background: rgba(0,0,0,0.7); padding: 2px 6px; border-radius: 4px; color: #fff; }
.mc-body { padding: 12px; }
.mc-title { font-size: 0.8rem; font-weight: 700; color: #fff; margin-bottom: 4px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mc-meta { font-size: 0.7rem; color: rgba(255,255,255,0.4); margin-bottom: 10px; }
.mc-actions { display: flex; flex-direction: column; gap: 6px; }
.mc-btn-edit { padding: 5px 10px; background: rgba(0,255,157,0.08); border: 1px solid rgba(0,255,157,0.2); color: #00ff9d; border-radius: 6px; font-size: 0.68rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.mc-btn-edit:hover { background: rgba(0,255,157,0.16); }
.mc-btn-del { padding: 5px 10px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; border-radius: 6px; font-size: 0.68rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.mc-btn-del:hover { background: rgba(220,38,38,0.2); }

.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px; grid-column: 1 / -1; font-size: 0.85rem; }

@media (max-width: 640px) { .tab-page { padding: 16px 12px; } .form-grid { grid-template-columns: 1fr; } .col-2 { grid-column: span 1; } .movies-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); } }
</style>
