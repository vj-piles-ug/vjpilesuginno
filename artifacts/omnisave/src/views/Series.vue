<template>
  <main class="page-main">
    <div class="page-banner" style="background: radial-gradient(ellipse 100% 80% at 60% 0%, #1a0d2e 0%, #0f0720 50%, #050c08 100%);">
      <div class="page-banner-overlay"></div>
      <div class="page-banner-content">
        <p class="section-kicker mb-2">BROWSE</p>
        <h1 class="page-title">TV Series</h1>
        <p class="page-subtitle">Stream and download your favourite TV series in HD quality</p>
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
            <p class="section-kicker">ALL SERIES</p>
            <h2 class="section-title">{{ activeGenre === 'ALL' ? 'Full Collection' : activeGenre }}</h2>
          </div>
          <span class="count-badge">{{ filteredList.length }} TITLES</span>
        </div>
        <div v-if="filteredList.length > 0" class="poster-grid">
          <MovieCard v-for="movie in filteredList" :key="movie.id" :movie="movie" @click="openDownload(movie)" />
        </div>
        <div v-else class="empty-state">
          <p class="text-white/30 text-sm text-center py-16">No series yet. Add them from the admin panel.</p>
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
import { publicSeries, dbLoading } from '../store/db'

const downloadTarget = ref<Movie | null>(null)
function openDownload(m: Movie) { downloadTarget.value = m }

const genres = computed(() => {
  const cats = [...new Set(publicSeries.value.map(m => m.category || '').filter(Boolean))]
  return ['ALL', ...cats]
})

const activeGenre = ref('ALL')

const filteredList = computed(() =>
  activeGenre.value === 'ALL'
    ? publicSeries.value
    : publicSeries.value.filter(m => m.category === activeGenre.value)
)
</script>

<style scoped>
.page-main { min-height: 80vh; width: 100%; max-width: 100%; overflow-x: hidden; box-sizing: border-box; }
.page-banner { display: none; }
@media (min-width: 640px) { .page-banner { position: relative; height: 220px; display: flex; align-items: flex-end; overflow: hidden; } }
@media (min-width: 768px) { .page-banner { height: 250px; } }
.page-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 60%); }
.page-banner-content { position: relative; z-index: 10; width: 100%; padding: 0 16px 28px; }
.section-kicker { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.14em; color: rgba(0,255,157,0.7); text-transform: uppercase; }
.page-title { font-size: clamp(1.4rem, 5vw, 3rem); font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-bottom: 4px; }
.page-subtitle { font-size: clamp(0.72rem, 2vw, 0.9rem); color: rgba(255,255,255,0.48); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.page-container { width: 100%; max-width: 100%; padding: 10px 6px 20px; box-sizing: border-box; overflow-x: hidden; }
@media (min-width: 360px) { .page-container { padding: 12px 8px 22px; } }
@media (min-width: 640px) { .page-container { padding: 20px 16px 32px; } }
.loading-state { display: flex; justify-content: center; padding: 60px; }
.loading-spinner { width: 32px; height: 32px; border: 3px solid rgba(0,255,157,0.15); border-top-color: #00ff9d; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.filter-row { display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 6px; margin-bottom: 12px; padding-bottom: 2px; scrollbar-width: none; -ms-overflow-style: none; }
.filter-row::-webkit-scrollbar { display: none; }
@media (min-width: 640px) { .filter-row { flex-wrap: wrap; overflow-x: visible; margin-bottom: 16px; } }
.filter-chip { padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55); font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; cursor: pointer; transition: all 0.15s; white-space: nowrap; flex-shrink: 0; }
.filter-chip:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
.filter-chip.active { border-color: rgba(161,78,255,0.4); background: rgba(161,78,255,0.1); color: #c07cff; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 4px; }
.section-title { font-size: clamp(0.9rem, 2vw, 1.3rem); font-weight: 800; color: #fff; }
.count-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
.poster-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; box-sizing: border-box; }
@media (min-width: 480px) { .poster-grid { gap: 7px; } }
@media (min-width: 540px) { .poster-grid { grid-template-columns: repeat(4, 1fr); gap: 9px; } }
@media (min-width: 768px) { .poster-grid { grid-template-columns: repeat(5, 1fr); gap: 11px; } }
@media (min-width: 1024px) { .poster-grid { grid-template-columns: repeat(6, 1fr); gap: 13px; } }
@media (min-width: 1280px) { .poster-grid { grid-template-columns: repeat(7, 1fr); gap: 14px; } }
.poster-grid > * { min-width: 0; width: 100%; box-sizing: border-box; }
</style>
