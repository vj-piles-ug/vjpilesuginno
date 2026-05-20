<template>
  <main class="page-main">
    <div class="page-banner" style="background: radial-gradient(ellipse 100% 80% at 60% 0%, #1a0a3a 0%, #0f0620 50%, #050c08 100%);">
      <div class="page-banner-overlay"></div>
      <div class="page-banner-content">
        <p class="section-kicker mb-2">BROWSE</p>
        <h1 class="page-title">Animation &amp; Anime</h1>
        <p class="page-subtitle">Download animated films and anime series in stunning HD quality</p>
      </div>
    </div>

    <div class="page-container">
      <div class="filter-row">
        <button v-for="genre in genres" :key="genre" class="filter-chip" :class="{ active: activeGenre === genre }" @click="activeGenre = genre">{{ genre }}</button>
      </div>
      <div class="section-header">
        <div>
          <p class="section-kicker">ALL ANIMATION</p>
          <h2 class="section-title">{{ activeGenre === 'ALL' ? 'Full Collection' : activeGenre }}</h2>
        </div>
        <span class="count-badge">{{ filteredList.length }} TITLES</span>
      </div>
      <div class="poster-grid">
        <MovieCard v-for="movie in filteredList" :key="movie.id" :movie="movie" @click="openDownload(movie)" />
      </div>
    </div>

    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import { animation, type Movie } from '../data/movies'

const downloadTarget = ref<Movie | null>(null)
function openDownload(m: Movie) { downloadTarget.value = m }

const allGenres = [...new Set(animation.flatMap(m => m.genres))]
const genres = ['ALL', ...allGenres]
const activeGenre = ref('ALL')

const filteredList = computed(() =>
  activeGenre.value === 'ALL' ? animation : animation.filter(m => m.genres.includes(activeGenre.value))
)
</script>

<style scoped>
.page-main { min-height: 80vh; }
.page-banner { position: relative; height: 220px; display: flex; align-items: flex-end; overflow: hidden; }
@media (min-width: 768px) { .page-banner { height: 250px; } }
.page-banner-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 60%); }
.page-banner-content { position: relative; z-index: 10; max-width: 1600px; width: 100%; margin: 0 auto; padding: 0 24px 28px; }
@media (min-width: 768px) { .page-banner-content { padding: 0 48px 36px; } }
.page-title { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 800; color: #fff; letter-spacing: -0.01em; margin-bottom: 6px; }
.page-subtitle { font-size: 0.9rem; color: rgba(255,255,255,0.48); }

.page-container { max-width: 1600px; margin: 0 auto; padding: 20px 16px 60px; }
@media (min-width: 640px) { .page-container { padding: 24px 24px 60px; } }
@media (min-width: 1024px) { .page-container { padding: 28px 48px 60px; } }
@media (min-width: 1280px) { .page-container { padding: 28px 64px 60px; } }

.filter-row { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 20px; }
.filter-chip { padding: 5px 14px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.06em; cursor: pointer; transition: all 0.15s; }
.filter-chip:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.9); }
.filter-chip.active { border-color: rgba(255,107,222,0.4); background: rgba(255,107,222,0.1); color: #ff6bde; }

.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
.count-badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); margin-bottom: 4px; }

.poster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}
@media (min-width: 480px) { .poster-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 11px; } }
@media (min-width: 768px) { .poster-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; } }
@media (min-width: 1024px) { .poster-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; } }
@media (min-width: 1280px) { .poster-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; } }
</style>
