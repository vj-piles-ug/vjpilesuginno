<template>
  <main class="relative w-full overflow-x-hidden">

    <!-- HERO SLIDESHOW -->
    <section class="hero-section">
      <template v-if="heroSlides.length > 0">
        <div
          v-for="(slide, i) in heroSlides"
          :key="i"
          class="hero-slide"
          :class="{ active: currentSlide === i }"
        >
          <div class="hero-slide-bg" :style="{ background: slide.bg }">
            <img
              v-if="slide.imageUrl"
              :src="slide.imageUrl"
              class="hero-slide-img"
              @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
            />
          </div>
          <div class="hero-overlay-v"></div>
        </div>
      </template>
      <div v-else class="hero-slide active">
        <div class="hero-slide-bg hero-skeleton-bg"></div>
      </div>

      <div class="hero-particles">
        <div v-for="n in 14" :key="n" class="particle" :style="particleStyle(n)"></div>
      </div>

      <div class="hero-content-wrap">
        <div class="hero-content">
          <template v-if="heroSlides.length > 0">
            <transition name="hero-fade" mode="out-in">
              <div :key="currentSlide" class="hero-text-block">
                <p class="hero-category" :style="{ color: heroSlides[currentSlide]?.accent || '#00ff9d' }">
                  {{ heroSlides[currentSlide]?.type || '' }}
                </p>
                <h1 class="hero-title">{{ heroSlides[currentSlide]?.title || '' }}</h1>
              </div>
            </transition>
            <div class="hero-dots">
              <button
                v-for="(_, i) in heroSlides"
                :key="i"
                class="hero-dot"
                :class="{ active: currentSlide === i }"
                @click="goToSlide(i)"
              />
            </div>
          </template>
          <template v-else>
            <div class="hero-text-block">
              <div class="skel-line skel-line--sm mb-3"></div>
              <div class="skel-line skel-line--lg mb-2"></div>
              <div class="skel-line skel-line--md"></div>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- CONTENT GRIDS -->
    <div class="content-wrap">

      <!-- Search results -->
      <template v-if="externalQuery && searchResults.length > 0">
        <div class="section-header">
          <div>
            <p class="section-kicker">RESULTS</p>
            <h2 class="section-title">Results for "{{ externalQuery }}"</h2>
          </div>
          <span class="count-badge">{{ searchResults.length }}</span>
        </div>
        <div class="poster-grid">
          <MovieCard v-for="movie in searchResults" :key="movie.id" :movie="movie" @click="openDownload(movie)" />
        </div>
      </template>

      <template v-else-if="externalQuery && searchResults.length === 0">
        <div class="empty-state">
          <svg width="52" height="52" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="opacity-20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="mt-4 text-base font-bold text-white">No results for "{{ externalQuery }}"</h3>
          <p class="mt-1 text-sm text-white/40">Try a different keyword</p>
        </div>
      </template>

      <template v-else>
        <!-- Skeleton loading grid -->
        <template v-if="dbLoading">
          <div class="section-header">
            <div>
              <div class="skel-line skel-line--xs mb-2"></div>
              <div class="skel-line skel-line--md"></div>
            </div>
          </div>
          <div class="poster-grid">
            <div v-for="n in 16" :key="n" class="skel-card">
              <div class="skel-card-art"></div>
              <div class="skel-card-body">
                <div class="skel-line skel-line--full mb-1"></div>
                <div class="skel-line skel-line--half"></div>
              </div>
            </div>
          </div>
        </template>

        <section v-else class="content-section">
          <div class="section-header">
            <div>
              <p class="section-kicker">ALL CONTENT</p>
              <h2 class="section-title">Movies, Series &amp; Animation</h2>
            </div>
            <span class="count-badge">{{ publicAll.length }}</span>
          </div>
          <div v-if="publicAll.length > 0" class="poster-grid">
            <MovieCard
              v-for="movie in publicAll"
              :key="movie.id"
              :movie="movie"
              @click="openDownload(movie)"
            />
          </div>
          <div v-else class="empty-state">
            <p class="text-white/30 text-sm">No content available yet. Add movies and series in the admin panel.</p>
          </div>
        </section>
      </template>

    </div>

    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import type { Movie } from '../data/movies'
import { publicAll, dbLoading, dbCarousel } from '../store/db'

const route = useRoute()
const externalQuery = computed(() => (route.query.q as string) || '')

const searchResults = computed(() => {
  if (!externalQuery.value) return []
  const q = externalQuery.value.toLowerCase()
  return publicAll.value.filter(m => m.title.toLowerCase().includes(q))
})

const downloadTarget = ref<Movie | null>(null)
function openDownload(item: Movie) { downloadTarget.value = item }

// ─── Hero carousel ─────────────────────────────────────────────────────────
const heroSlides = computed(() =>
  dbCarousel.value.map(s => ({
    title: s.title,
    type: s.subtitle || 'STREAMING',
    imageUrl: s.imageUrl || '',
    bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0d2a4a 0%, #071220 60%, #050c08 100%)',
    accent: '#00ff9d',
  }))
)

const currentSlide = ref(0)
const SLIDE_MS = 6000
let autoTimer: ReturnType<typeof setInterval> | null = null

function goToSlide(i: number) { currentSlide.value = i }
function nextSlide() {
  if (heroSlides.value.length > 0)
    currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

watch(() => heroSlides.value.length, (len) => {
  if (currentSlide.value >= len) currentSlide.value = 0
})

onMounted(() => { autoTimer = setInterval(nextSlide, SLIDE_MS) })
onUnmounted(() => { if (autoTimer) clearInterval(autoTimer) })

function particleStyle(n: number) {
  return {
    left: `${(n * 37 + 11) % 100}%`,
    top: `${(n * 53 + 7) % 100}%`,
    width: `${2 + (n % 3)}px`,
    height: `${2 + (n % 3)}px`,
    opacity: 0.06 + (n % 5) * 0.03,
    animationDelay: `${n * 0.5}s`,
  }
}
</script>

<style scoped>
.hero-section { position: relative; display: flex; flex-direction: column; overflow: hidden; height: 320px; }
@media (min-width: 768px) { .hero-section { height: 400px; } }
@media (min-width: 1280px) { .hero-section { height: 460px; } }

.hero-slide { position: absolute; inset: 0; transition: opacity 1.2s ease-in-out; opacity: 0; }
.hero-slide.active { opacity: 1; }
.hero-slide-bg { position: absolute; inset: 0; overflow: hidden; }
.hero-slide-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center top; }
.hero-skeleton-bg {
  background: linear-gradient(135deg, #0d1a14 0%, #0a1210 50%, #0d1a14 100%);
  background-size: 200% 200%;
  animation: skel-shift 2s ease-in-out infinite;
}
.hero-overlay-v { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,12,8,1) 0%, rgba(5,12,8,0.15) 30%, transparent 55%); }

.hero-particles { position: absolute; inset: 0; pointer-events: none; }
.particle { position: absolute; border-radius: 50%; background: rgba(0,255,157,0.6); animation: pp 4s ease-in-out infinite; }
@keyframes pp { 0%,100% { transform: scale(1); } 50% { transform: scale(2); } }

.hero-content-wrap { position: relative; z-index: 10; flex: 1; display: flex; align-items: center; }
.hero-content { width: 100%; padding: 32px 16px 28px; }
@media (min-width: 768px) { .hero-content { padding: 36px 24px 32px; } }
.hero-text-block { max-width: 540px; }
.hero-category { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em; margin-bottom: 10px; text-transform: uppercase; }
.hero-title { font-size: clamp(1.8rem, 4vw, 3.2rem); font-weight: 800; line-height: 1.06; color: #fff; margin-bottom: 14px; letter-spacing: -0.01em; }
.hero-dots { display: flex; align-items: center; gap: 7px; margin-top: 28px; }
.hero-dot { height: 4px; border-radius: 2px; border: none; cursor: pointer; background: rgba(255,255,255,0.22); width: 5px; transition: background 0.3s, width 0.3s; }
.hero-dot.active { background: #00ff9d; width: 24px; }

/* ─── Skeleton system ─────────────────────────────────────── */
.skel-line {
  border-radius: 6px;
  background: linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.06) 100%);
  background-size: 200% 100%;
  animation: skel-shimmer 1.6s ease-in-out infinite;
  height: 10px;
}
.skel-line--xs  { width: 60px;  height: 8px; }
.skel-line--sm  { width: 100px; height: 9px; }
.skel-line--md  { width: 220px; height: 14px; }
.skel-line--lg  { width: 320px; height: 26px; }
.skel-line--full { width: 100%; }
.skel-line--half { width: 55%; }

@keyframes skel-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes skel-shift {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

.skel-card { display: flex; flex-direction: column; gap: 6px; }
.skel-card-art {
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.05) 100%);
  background-size: 200% 100%;
  animation: skel-shimmer 1.6s ease-in-out infinite;
}
.skel-card-body { padding: 0 2px; display: flex; flex-direction: column; gap: 4px; }

/* stagger skeleton cards */
.skel-card:nth-child(2)  .skel-card-art, .skel-card:nth-child(2)  .skel-line { animation-delay: 0.08s; }
.skel-card:nth-child(3)  .skel-card-art, .skel-card:nth-child(3)  .skel-line { animation-delay: 0.16s; }
.skel-card:nth-child(4)  .skel-card-art, .skel-card:nth-child(4)  .skel-line { animation-delay: 0.24s; }
.skel-card:nth-child(5)  .skel-card-art, .skel-card:nth-child(5)  .skel-line { animation-delay: 0.32s; }
.skel-card:nth-child(6)  .skel-card-art, .skel-card:nth-child(6)  .skel-line { animation-delay: 0.40s; }
.skel-card:nth-child(7)  .skel-card-art, .skel-card:nth-child(7)  .skel-line { animation-delay: 0.48s; }
.skel-card:nth-child(8)  .skel-card-art, .skel-card:nth-child(8)  .skel-line { animation-delay: 0.56s; }

/* ─── Content layout ──────────────────────────────────────── */
.content-wrap { width: 100%; max-width: 100%; overflow-x: hidden; padding: 12px 6px 20px; box-sizing: border-box; }
@media (min-width: 360px) { .content-wrap { padding: 16px 8px 22px; } }
@media (min-width: 480px) { .content-wrap { padding: 18px 10px 24px; } }
@media (min-width: 640px) { .content-wrap { padding: 24px 16px 32px; } }
.content-section { margin-bottom: 40px; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap; gap: 4px; }
.section-kicker { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.14em; color: rgba(0,255,157,0.7); text-transform: uppercase; }
.section-title { font-size: clamp(0.9rem, 2.5vw, 1.4rem); font-weight: 800; color: #fff; }
.count-badge { font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
.poster-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; width: 100%; box-sizing: border-box; }
@media (min-width: 400px) { .poster-grid { grid-template-columns: repeat(3, 1fr); gap: 7px; } }
@media (min-width: 540px) { .poster-grid { grid-template-columns: repeat(4, 1fr); gap: 9px; } }
@media (min-width: 768px) { .poster-grid { grid-template-columns: repeat(5, 1fr); gap: 11px; } }
@media (min-width: 1024px) { .poster-grid { grid-template-columns: repeat(6, 1fr); gap: 13px; } }
@media (min-width: 1280px) { .poster-grid { grid-template-columns: repeat(7, 1fr); gap: 14px; } }
.poster-grid > * { min-width: 0; width: 100%; box-sizing: border-box; }
.empty-state { text-align: center; padding: 40px 16px; }

.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.hero-fade-enter-from { opacity: 0; transform: translateY(16px); }
.hero-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
