<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Movies</h1>
      <p class="tab-sub">Total: {{ dbMovies.length }} movies · Firebase RTDB /movies</p>
    </div>

    <div class="form-card" :class="{ editing: editingKey !== null }">
      <div class="form-title-row">
        <h2 class="form-title">{{ editingKey !== null ? 'Edit Movie' : 'Add New Movie' }}</h2>
        <button v-if="editingKey !== null" class="cancel-edit-btn" @click="cancelEdit">✕ Cancel Edit</button>
      </div>
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
          <input v-model="form.streamlink" placeholder="https://example.com/movie.mp4" />
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
          <input v-model="form.image" placeholder="https://example.com/poster.jpg" />
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
        {{ saving ? 'Saving...' : (editingKey !== null ? 'Update Movie' : 'Add Movie') }}
      </button>
    </div>

    <div class="search-bar-wrap">
      <div class="search-bar">
        <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input v-model="searchQuery" type="text" placeholder="Search movies by title…" class="search-input" />
        <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">✕</button>
      </div>
      <span class="search-count">{{ filteredMovies.length }} / {{ dbMovies.length }}</span>
    </div>

    <div class="movies-grid">
      <div v-for="m in filteredMovies" :key="m.key" class="movie-card" :class="{ 'is-editing': editingKey === m.key }">
        <div class="mc-poster">
          <img v-if="m.image" :src="m.image" alt="" class="mc-img" @error="onImgErr" />
          <div v-else class="mc-no-poster">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>
          </div>
          <span class="mc-cat-badge" :class="catCls(m.category)">{{ m.category }}</span>
          <span class="mc-rating-badge">{{ m.rating }}</span>
          <span v-if="m.isTrending" class="mc-trend-badge">TRENDING</span>
        </div>
        <div class="mc-body">
          <p class="mc-title">{{ m.title }}</p>
          <p class="mc-year">{{ m.year }}</p>
          <div class="mc-actions">
            <button class="mc-btn-edit" @click="loadEdit(m)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
            <button class="mc-btn-trend" @click="toggleTrending(m)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              {{ m.isTrending ? 'Untrend' : 'Trending' }}
            </button>
            <button class="mc-btn-del" @click="deleteMovie(m.key)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
              Delete
            </button>
          </div>
        </div>
      </div>
      <div v-if="filteredMovies.length === 0" class="empty">{{ searchQuery ? 'No movies match your search.' : 'No movies added yet. Use the form above to add your first movie.' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { dbMovies, addMovie, updateMovie, removeMovie, type AdminMovie } from '../../store/db'

const searchQuery = ref('')
const filteredMovies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return dbMovies.value
  return dbMovies.value.filter(m => m.title.toLowerCase().includes(q))
})

const CATEGORIES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Adventure', 'Crime', 'Documentary']

const defaultForm = () => ({
  title: '', category: 'Action', streamlink: '', image: '',
  rating: 7.5, year: new Date().getFullYear(), isTrending: false,
})

const form = ref(defaultForm())
const editingKey = ref<string | null>(null)
const saving = ref(false)
const errMsg = ref('')

function loadEdit(m: AdminMovie) {
  editingKey.value = m.key
  form.value = { title: m.title, category: m.category, streamlink: m.streamlink, image: m.image, rating: m.rating, year: m.year, isTrending: m.isTrending }
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
    const data = {
      title: form.value.title,
      category: form.value.category,
      streamlink: form.value.streamlink,
      image: form.value.image,
      rating: form.value.rating,
      year: form.value.year,
      isTrending: form.value.isTrending,
      createdAt: new Date().toISOString(),
    }
    if (editingKey.value !== null) {
      await updateMovie(editingKey.value, data)
      editingKey.value = null
    } else {
      await addMovie(data)
    }
    form.value = defaultForm()
  } catch (e: any) {
    errMsg.value = e.message || 'Failed to save. Check your connection.'
  } finally {
    saving.value = false
  }
}

async function deleteMovie(key: string) {
  if (editingKey.value === key) cancelEdit()
  if (!confirm('Delete this movie?')) return
  await removeMovie(key)
}

async function toggleTrending(m: AdminMovie) {
  await updateMovie(m.key, { isTrending: !m.isTrending })
}

function catCls(cat: string) {
  const map: Record<string, string> = { Action: 'cat-action', Animation: 'cat-anim', Drama: 'cat-drama', Horror: 'cat-horror', Comedy: 'cat-comedy', Thriller: 'cat-thriller', 'Sci-Fi': 'cat-scifi', Romance: 'cat-romance' }
  return map[cat] || 'cat-default'
}

function onImgErr(e: Event) {
  const el = e.target as HTMLImageElement
  el.style.display = 'none'
  const placeholder = el.parentElement?.querySelector('.mc-no-poster') as HTMLElement | null
  if (placeholder) placeholder.style.display = 'flex'
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
.cancel-edit-btn { padding: 5px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); border-radius: 7px; color: rgba(255,255,255,0.5); font-size: 0.72rem; font-weight: 600; cursor: pointer; }
.cancel-edit-btn:hover { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); }
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
.check-box { width: 18px; height: 18px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.05); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.15s; }
.check-box.checked { background: #7c3aed; border-color: #7c3aed; }
.err-msg { color: #f87171; font-size: 0.78rem; text-align: center; }
.btn-add { padding: 11px 20px; background: #7c3aed; border: none; border-radius: 10px; color: #fff; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: filter 0.2s; width: 100%; }
.btn-add:hover:not(:disabled) { filter: brightness(1.12); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }
.movies-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 16px; }
.movie-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; transition: border-color 0.2s, transform 0.15s; display: flex; flex-direction: column; }
.movie-card:hover { border-color: rgba(255,255,255,0.14); transform: translateY(-2px); }
.movie-card.is-editing { border-color: rgba(0,255,157,0.35); box-shadow: 0 0 0 1px rgba(0,255,157,0.15); }
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
.mc-trend-badge { position: absolute; bottom: 8px; left: 8px; background: rgba(124,58,237,0.9); color: #fff; font-size: 0.55rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; z-index: 1; letter-spacing: 0.06em; }
.mc-body { padding: 12px; display: flex; flex-direction: column; gap: 2px; flex: 1; }
.mc-title { font-size: 0.82rem; font-weight: 700; color: #fff; line-height: 1.3; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 2px; }
.mc-year { font-size: 0.7rem; color: rgba(255,255,255,0.35); margin-bottom: 10px; }
.mc-actions { display: flex; flex-direction: column; gap: 5px; margin-top: auto; }
.mc-btn-edit { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(34,197,94,0.12); border: 1px solid rgba(34,197,94,0.3); color: #4ade80; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.mc-btn-edit:hover { background: rgba(34,197,94,0.22); }
.mc-btn-trend { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(124,58,237,0.15); border: 1px solid rgba(124,58,237,0.35); color: #a78bfa; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.mc-btn-trend:hover { background: rgba(124,58,237,0.25); }
.mc-btn-del { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 6px; background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; border-radius: 7px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.mc-btn-del:hover { background: rgba(220,38,38,0.22); }
.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px 20px; grid-column: 1/-1; font-size: 0.85rem; }
.search-bar-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.search-bar { flex: 1; display: flex; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; height: 38px; transition: border-color 0.2s; }
.search-bar:focus-within { border-color: rgba(0,255,157,0.4); }
.search-icon { flex-shrink: 0; margin: 0 10px; color: rgba(255,255,255,0.35); }
.search-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 0.83rem; padding: 0 6px; min-width: 0; }
.search-input::placeholder { color: rgba(255,255,255,0.25); }
.search-clear { flex-shrink: 0; background: none; border: none; color: rgba(255,255,255,0.35); cursor: pointer; padding: 0 12px; font-size: 0.75rem; height: 100%; transition: color 0.15s; }
.search-clear:hover { color: rgba(255,255,255,0.7); }
.search-count { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.3); white-space: nowrap; flex-shrink: 0; }
@media (max-width: 768px) { .tab-page { padding: 16px 12px; } .form-row-3 { grid-template-columns: 1fr; } .movies-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); } }
</style>
