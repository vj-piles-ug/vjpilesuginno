<template>
  <main class="page-main">
    <div class="page-banner" style="background: radial-gradient(ellipse 100% 80% at 60% 0%, #0d2a4a 0%, #071220 50%, #050c08 100%);">
      <div class="page-banner-overlay"></div>
      <div class="page-banner-content">
        <p class="section-kicker mb-2">BROWSE</p>
        <h1 class="page-title">Movies</h1>
        <p class="page-subtitle">Download HD movies in MP4 format with subtitles</p>
      </div>
    </div>

    <div class="page-container">
      <div v-if="dbLoading" class="loading-state">
        <div class="loading-spinner"></div>
      </div>
      <template v-else>
        <div class="filter-row">
          <button v-for="genre in genres" :key="genre" class="filter-chip" :class="{ active: activeGenre === genre }" @click="activeGenre = genre">{{ genre }}</button>
        </div>
        <div class="section-header">
          <div>
            <p class="section-kicker">ALL MOVIES</p>
            <h2 class="section-title">{{ activeGenre === 'ALL' ? 'Full Collection' : activeGenre }}</h2>
          </div>
          <span class="count-badge">{{ filteredList.length }} TITLES</span>
        </div>
        <div v-if="filteredList.length > 0" class="poster-grid">
          <MovieCard v-for="movie in filteredList" :key="movie.id" :movie="movie" @click="openDownload(movie)" />
        </div>
        <div v-else class="empty-state">
          <p class="text-white/30 text-sm text-center py-16">No movies yet. Add them from the admin panel.</p>
        </div>
      </template>
    </div>

    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import type { Movie } from '../data/movies'
import { publicMovies, dbLoading } from '../store/db'

const downloadTarget = ref<Movie | null>(null)
function openDownload(m: Movie) { downloadTarget.value = m }

const genres = computed(() => {
  const cats = [...new Set(publicMovies.value.map(m => m.category || '').filter(Boolean))]
  return ['ALL', ...cats]
})

const activeGenre = ref('ALL')

const filteredList = computed(() =>
  activeGenre.value === 'ALL'
    ? publicMovies.value
    : publicMovies.value.filter(m => m.category === activeGenre.value)
)
</script>

<style scoped>
.page-main { min-height: 80vh; }
.page-banner { position: relative; height: 220px; display: flex; align-items: flex-end; overflow: hidden; }
@media (min-width: 768px) { .page-banner { height: 250px; } }
.page-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 60%); }
.page-banner-content { position: relative; z-index: 10; width: 100%; padding: 0 12px 28px; }
.section-kicker { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.16em; color: rgba(0,255,157,0.7); text-transform: uppercase; }
.page-title { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-bottom: 6px; }
.page-subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.48); }
.page-container { width: 100%; padding: 16px 8px 24px; }
@media (min-width: 360px) { .page-container { padding: 18px 10px 24px; } }
@media (min-width: 640px) { .page-container { padding: 20px 16px 32px; } }
.loading-state { display: flex; justify-content: center; padding: 60px; }
.loading-spinner { width: 32px; height: 32px; border: 3px solid rgba(0,255,157,0.15); border-top-color: #00ff9d; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.filter-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 20px; }
.filter-chip { padding: 5px 14px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; cursor: pointer; transition: all 0.15s; }
.filter-chip:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
.filter-chip.active { border-color: rgba(0,255,157,0.4); background: rgba(0,255,157,0.1); color: #00ff9d; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
.section-title { font-size: clamp(1rem, 2vw, 1.3rem); font-weight: 800; color: #fff; }
.count-badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
.poster-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
@media (min-width: 360px) { .poster-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; } }
@media (min-width: 540px) { .poster-grid { grid-template-columns: repeat(4, 1fr); gap: 10px; } }
@media (min-width: 768px) { .poster-grid { grid-template-columns: repeat(5, 1fr); gap: 12px; } }
@media (min-width: 1024px) { .poster-grid { grid-template-columns: repeat(6, 1fr); gap: 14px; } }
@media (min-width: 1280px) { .poster-grid { grid-template-columns: repeat(7, 1fr); gap: 14px; } }
</style>
