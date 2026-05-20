<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Movies</h1>
      <p class="tab-sub">Total: {{ adminStore.movies.length }} movies</p>
    </div>

    <!-- Add Form -->
    <div class="form-card">
      <h2 class="form-title">Add New Movie</h2>
      <div class="form-row-3">
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
        <div class="field">
          <label>Download URL <span class="req">*</span></label>
          <input v-model="form.streamUrl" placeholder="https://example.com/stream/movie.mp4" />
        </div>
      </div>
      <div class="form-row-3">
        <div class="field">
          <label>Rating (0-10)</label>
          <input v-model.number="form.rating" type="number" min="0" max="10" step="0.1" placeholder="7.5" />
        </div>
        <div class="field">
          <label>Year</label>
          <input v-model.number="form.year" type="number" min="1900" max="2099" placeholder="2025" />
        </div>
        <div class="field">
          <label>Poster Image URL <span class="req">*</span></label>
          <input v-model="form.posterUrl" placeholder="https://example.com/image.jpg" />
        </div>
      </div>
      <div class="check-row">
        <label class="check-label">
          <input type="checkbox" v-model="form.trending" class="check-input" />
          <span class="check-box" :class="{ checked: form.trending }">
            <svg v-if="form.trending" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          Mark as Trending
        </label>
      </div>
      <button class="btn-add" @click="addMovie" :disabled="!form.title || !form.streamUrl">Add Movie</button>
    </div>

    <!-- Movies Grid -->
    <div class="movies-grid">
      <div v-for="m in adminStore.movies" :key="m.id" class="movie-card">
        <div class="mc-poster">
          <img v-if="m.posterUrl" :src="m.posterUrl" alt="" class="mc-img" @error="onImgErr" />
          <div v-else class="mc-no-poster">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>
          </div>
          <span class="mc-cat-badge" :class="catCls(m.category)">{{ m.category }}</span>
          <span class="mc-rating-badge">{{ m.rating }}</span>
        </div>
        <div class="mc-body">
          <p class="mc-title">{{ m.title }}</p>
          <p class="mc-year">{{ m.year }}</p>
          <div class="mc-actions">
            <button class="mc-btn-edit" @click="openEdit(m)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button class="mc-btn-trend" @click="toggleTrending(m)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              {{ m.trending ? 'Untrend' : 'Mark Trending' }}
            </button>
            <button class="mc-btn-del" @click="deleteMovie(m.id)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-if="adminStore.movies.length === 0" class="empty">No movies added yet. Use the form above to add your first movie.</div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editMovie" class="modal-overlay" @click.self="editMovie = null">
      <div class="modal">
        <h3 class="modal-title">Edit Movie</h3>
        <div class="form-row-3">
          <div class="field"><label>Title</label><input v-model="editMovie.title" /></div>
          <div class="field">
            <label>Category</label>
            <div class="select-wrap">
              <select v-model="editMovie.category">
                <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
              </select>
              <svg class="sel-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div class="field"><label>Download URL</label><input v-model="editMovie.streamUrl" /></div>
        </div>
        <div class="form-row-3">
          <div class="field"><label>Rating</label><input v-model.number="editMovie.rating" type="number" min="0" max="10" step="0.1" /></div>
          <div class="field"><label>Year</label><input v-model.number="editMovie.year" type="number" /></div>
          <div class="field"><label>Poster Image URL</label><input v-model="editMovie.posterUrl" /></div>
        </div>
        <div class="check-row">
          <label class="check-label">
            <input type="checkbox" v-model="editMovie.trending" class="check-input" />
            <span class="check-box" :class="{ checked: editMovie.trending }">
              <svg v-if="editMovie.trending" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            Mark as Trending
          </label>
        </div>
        <div class="modal-actions">
          <button class="btn-ghost" @click="editMovie = null">Cancel</button>
          <button class="btn-add sm" @click="saveEdit">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { adminStore, type AdminMovie } from '../../store/admin'

const CATEGORIES = ['Action', 'Animation', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller']

const form = ref({ title: '', category: 'Animation', streamUrl: '', posterUrl: '', rating: 7.5, year: new Date().getFullYear(), trending: false })
const editMovie = ref<AdminMovie | null>(null)

function addMovie() {
  if (!form.value.title || !form.value.streamUrl) return
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
  form.value = { title: '', category: 'Animation', streamUrl: '', posterUrl: '', rating: 7.5, year: new Date().getFullYear(), trending: false }
}

function deleteMovie(id: number) {
  if (!confirm('Delete this movie?')) return
  const i = adminStore.movies.findIndex(m => m.id === id)
  if (i !== -1) adminStore.movies.splice(i, 1)
}

function toggleTrending(m: AdminMovie) {
  m.trending = !m.trending
}

function openEdit(m: AdminMovie) {
  editMovie.value = { ...m }
}

function saveEdit() {
  if (!editMovie.value) return
  const i = adminStore.movies.findIndex(m => m.id === editMovie.value!.id)
  if (i !== -1) Object.assign(adminStore.movies[i], editMovie.value)
  editMovie.value = null
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
    const placeholder = parent.querySelector('.mc-no-poster') as HTMLElement
    if (placeholder) placeholder.style.display = 'flex'
  }
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { margin-bottom: 20px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.4); }

.form-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 28px; display: flex; flex-direction: column; gap: 14px; }
.form-title { font-size: 0.95rem; font-weight: 700; color: #fff; }
.form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
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

.check-row { display: flex; }
.check-label { display: flex; align-items: center; gap: 10px; cursor: pointer; font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 600; user-select: none; }
.check-input { display: none; }
.check-box { width: 18px; height: 18px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s, border-color 0.15s; }
.check-box.checked { background: #7c3aed; border-color: #7c3aed; }

.btn-add { padding: 11px 20px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: filter 0.2s; letter-spacing: 0.04em; width: 100%; }
.btn-add:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-add.sm { width: auto; }
.btn-ghost { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 9px 18px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }

/* Cards Grid */
.movies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 16px; }
.movie-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, transform 0.15s; display: flex; flex-direction: column; }
.movie-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }

.mc-poster { position: relative; aspect-ratio: 2/3; background: #0d1a10; overflow: hidden; flex-shrink: 0; }
.mc-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.mc-no-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.mc-cat-badge { position: absolute; top: 8px; left: 8px; font-size: 0.6rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.04em; z-index: 1; }
.cat-action { background: rgba(239,68,68,0.85); color: #fff; }
.cat-anim { background: rgba(124,58,237,0.85); color: #fff; }
.cat-drama { background: rgba(37,99,235,0.85); color: #fff; }
.cat-horror { background: rgba(10,10,10,0.9); color: #f87171; border: 1px solid rgba(248,113,113,0.4); }
.cat-comedy { background: rgba(234,179,8,0.85); color: #000; }
.cat-thriller { background: rgba(220,38,38,0.85); color: #fff; }
.cat-scifi { background: rgba(6,182,212,0.85); color: #fff; }
.cat-romance { background: rgba(236,72,153,0.85); color: #fff; }
.cat-default { background: rgba(255,255,255,0.18); color: #fff; }
.mc-rating-badge { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.75); color: #f59e0b; font-size: 0.72rem; font-weight: 800; padding: 3px 7px; border-radius: 4px; z-index: 1; }

.mc-body { padding: 12px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.mc-title { font-size: 0.82rem; font-weight: 700; color: #fff; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
.mc-year { font-size: 0.7rem; color: rgba(255,255,255,0.35); margin-bottom: 10px; }
.mc-actions { display: flex; flex-direction: column; gap: 5px; margin-top: auto; }
.mc-btn-edit { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.mc-btn-edit:hover { background: rgba(34,197,94,0.22); }
.mc-btn-trend { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.35); color: #a78bfa; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.mc-btn-trend:hover { background: rgba(124,58,237,0.25); }
.mc-btn-del { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.mc-btn-del:hover { background: rgba(220,38,38,0.22); }

.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px 20px; grid-column: 1/-1; font-size: 0.85rem; line-height: 1.6; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 20px; }
.modal { background: #0a1610; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 24px; width: 100%; max-width: 640px; display: flex; flex-direction: column; gap: 14px; max-height: 90vh; overflow-y: auto; }
.modal-title { font-size: 1rem; font-weight: 700; color: #fff; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }

@media (max-width: 768px) {
  .tab-page { padding: 16px 12px; }
  .form-row-3 { grid-template-columns: 1fr; }
  .movies-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}
</style>
