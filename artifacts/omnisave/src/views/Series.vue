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

    <div class="section-container pb-16 pt-8">
      <div class="filter-row">
        <button v-for="genre in genres" :key="genre" class="filter-chip" :class="{ active: activeGenre === genre }" @click="activeGenre = genre">{{ genre }}</button>
      </div>
      <div class="grid-header mt-6">
        <div>
          <p class="section-kicker">ALL SERIES</p>
          <h2 class="section-title">{{ activeGenre === 'ALL' ? 'Full Collection' : activeGenre }}</h2>
        </div>
        <span class="result-count">{{ filteredList.length }} TITLES</span>
      </div>
      <div class="movie-grid">
        <div v-for="movie in filteredList" :key="movie.id" class="movie-card cursor-pointer" @click="openDownload(movie)">
          <MovieCard :movie="movie" />
        </div>
      </div>
    </div>

    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import { series, type Movie } from '../data/movies'

const downloadTarget = ref<Movie | null>(null)
function openDownload(m: Movie) { downloadTarget.value = m }

const allGenres = [...new Set(series.flatMap(m => m.genres))]
const genres = ['ALL', ...allGenres]
const activeGenre = ref('ALL')

const filteredList = computed(() =>
  activeGenre.value === 'ALL' ? series : series.filter(m => m.genres.includes(activeGenre.value))
)
</script>

<style scoped>
.page-main { min-height: 80vh; }
.page-banner { position: relative; height: 260px; display: flex; align-items: flex-end; overflow: hidden; }
@media (min-width: 768px) { .page-banner { height: 300px; } }
.page-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 60%); }
.page-banner-content { position: relative; z-index: 10; max-width: 1380px; width: 100%; margin: 0 auto; padding: 0 32px 36px; }
@media (min-width: 768px) { .page-banner-content { padding: 0 48px 44px; } }
.page-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-bottom: 8px; }
.page-subtitle { font-size: 0.95rem; color: rgba(255,255,255,0.5); }
.section-container { max-width: 1380px; margin: 0 auto; padding: 0 24px; }
@media (min-width: 768px) { .section-container { padding: 0 48px; } }
@media (min-width: 1280px) { .section-container { padding: 0 64px; } }
.filter-row { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-chip { padding: 6px 16px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55); font-size: 0.74rem; font-weight: 700; letter-spacing: 0.06em; cursor: pointer; transition: all 0.15s; }
.filter-chip:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
.filter-chip.active { border-color: rgba(161,78,255,0.4); background: rgba(161,78,255,0.1); color: #c07cff; }
.grid-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 20px; }
.result-count { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
.movie-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
@media (min-width: 768px) { .movie-grid { gap: 20px; } }
</style>
