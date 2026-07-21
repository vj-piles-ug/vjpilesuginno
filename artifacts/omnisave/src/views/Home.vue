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

      <!-- Carousel arrows — positioned relative to .hero-section -->
      <template v-if="heroSlides.length > 1">
        <button class="hero-arrow hero-arrow--left" @click="prevSlide(); resetTimer()" aria-label="Previous slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="hero-arrow hero-arrow--right" @click="nextSlide(); resetTimer()" aria-label="Next slide">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </template>

    </section>

    <!-- MOBILE SEARCH BAR (below carousel, hidden on desktop) -->
    <div class="mobile-search-bar">
      <form class="mobile-search-form" @submit.prevent="doMobileSearch">
        <svg class="ms-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="mobileSearch" type="text" placeholder="Search movies, series, anime..." class="ms-input" @keyup.enter="doMobileSearch" />
        <button type="submit" class="ms-btn">GO</button>
      </form>
    </div>

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

        <template v-else>

          <!-- ── LATEST UPLOADS (last 48 hours) ───────────────────── -->
          <section v-if="latestUploads.length > 0" class="content-section latest-section">
            <div class="section-header">
              <div class="latest-title-wrap">
                <span class="live-dot"></span>
                <div>
                  <h2 class="section-title">Latest Movies</h2>
                </div>
              </div>
              <span class="count-badge">{{ latestUploads.length }} NEW</span>
            </div>
            <div class="latest-scroll-wrap">
              <button class="scroll-arrow scroll-arrow--left" @click="scrollLatest(-1)" aria-label="Scroll left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div class="latest-scroll-track" ref="latestTrackRef">
                <div
                  v-for="movie in latestUploads"
                  :key="movie.id"
                  class="latest-card-wrap"
                  @click="openDownload(movie)"
                >
                  <div class="latest-new-badge">NEW</div>
                  <MovieCard :movie="movie" />
                </div>
              </div>
              <button class="scroll-arrow scroll-arrow--right" @click="scrollLatest(1)" aria-label="Scroll right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </section>

          <!-- ── ALL CONTENT ──────────────────────────────────────── -->
          <section class="content-section">
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
              <div class="loading-msg">
                <div class="loading-dots"><span></span><span></span><span></span></div>
                <p>LOADING PLEASE WAIT</p>
              </div>
            </div>
          </section>

        </template>
      </template>

    </div>

    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import type { Movie } from '../data/movies'
import { publicAll, dbLoading, dbCarousel } from '../store/db'
import { trackActivity } from '../store/activity'

const route = useRoute()
const router = useRouter()
const externalQuery = computed(() => (route.query.q as string) || '')

const mobileSearch = ref('')
function doMobileSearch() {
  if (mobileSearch.value.trim()) {
    router.push({ path: '/', query: { q: mobileSearch.value.trim() } })
  }
}

const searchResults = computed(() => {
  if (!externalQuery.value) return []
  const q = externalQuery.value.toLowerCase()
  return publicAll.value.filter(m => m.title.toLowerCase().includes(q))
})

const downloadTarget = ref<Movie | null>(null)
function openDownload(item: Movie) { downloadTarget.value = item }

// ─── Latest uploads: anything added in the last 48 hours ───────────────────
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000
const latestUploads = computed<Movie[]>(() => {
  const cutoff = Date.now() - TWO_DAYS_MS
  return publicAll.value
    .filter(m => m.createdAt && new Date(m.createdAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
})

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

function resetTimer() {
  if (autoTimer) clearInterval(autoTimer)
  autoTimer = setInterval(nextSlide, SLIDE_MS)
}

function goToSlide(i: number) { currentSlide.value = i; resetTimer() }
function nextSlide() {
  if (heroSlides.value.length > 0)
    currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}
function prevSlide() {
  if (heroSlides.value.length > 0)
    currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
  resetTimer()
}

// ─── Latest scroll ──────────────────────────────────────────────────────────
const latestTrackRef = ref<HTMLElement | null>(null)
function scrollLatest(dir: 1 | -1) {
  const el = latestTrackRef.value
  if (!el) return
  const cardWidth = (el.firstElementChild as HTMLElement)?.offsetWidth || 120
  el.scrollBy({ left: dir * cardWidth * 3, behavior: 'smooth' })
}

watch(() => heroSlides.value.length, (len) => {
  if (currentSlide.value >= len) currentSlide.value = 0
})

onMounted(() => {
  autoTimer = setInterval(nextSlide, SLIDE_MS)
  trackActivity('Page Visit', 'Home', '/')
})
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
/* Mobile search bar — shown only below 640px */
.mobile-search-bar { display: block; padding: 8px 10px 4px; }
@media (min-width: 640px) { .mobile-search-bar { display: none; } }
.mobile-search-form { display: flex; align-items: center; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.12); border-radius: 9999px; overflow: hidden; height: 36px; width: 100%; box-sizing: border-box; }
.ms-icon { width: 14px; height: 14px; flex-shrink: 0; margin-left: 10px; color: rgba(255,255,255,0.4); }
.ms-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 0.8rem; padding: 0 8px; min-width: 0; }
.ms-input::placeholder { color: rgba(255,255,255,0.3); font-size: 0.75rem; }
.ms-btn { flex-shrink: 0; margin: 3px; padding: 0 14px; height: 28px; border-radius: 9999px; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); color: #021a10; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.1em; border: none; cursor: pointer; }

.hero-section { position: relative; display: flex; flex-direction: column; overflow: hidden; height: 200px; }
@media (min-width: 480px) { .hero-section { height: 260px; } }
@media (min-width: 768px) { .hero-section { height: 360px; } }
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

.hero-content-wrap { position: relative; z-index: 10; flex: 1; display: flex; align-items: flex-end; }
.hero-content { width: 100%; padding: 10px 12px 12px; }
@media (min-width: 768px) { .hero-content-wrap { align-items: center; } }
@media (min-width: 768px) { .hero-content { padding: 36px 24px 32px; } }
.hero-text-block { display: inline-block; max-width: 90%; background: rgba(10,40,120,0.72); border-radius: 10px; padding: 8px 12px 6px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
@media (min-width: 768px) { .hero-text-block { display: block; max-width: 540px; background: transparent; border-radius: 0; padding: 0; backdrop-filter: none; -webkit-backdrop-filter: none; } }
.hero-category { font-size: 0.58rem; font-weight: 800; letter-spacing: 0.2em; margin-bottom: 4px; text-transform: uppercase; }
@media (min-width: 768px) { .hero-category { font-size: 0.7rem; margin-bottom: 10px; } }
.hero-title { font-size: clamp(0.95rem, 3.5vw, 3.2rem); font-weight: 800; line-height: 1.1; color: #fff; margin-bottom: 6px; letter-spacing: -0.01em; }
@media (min-width: 768px) { .hero-title { font-size: clamp(1.8rem, 4vw, 3.2rem); margin-bottom: 14px; } }
.hero-dots { display: flex; align-items: center; gap: 7px; margin-top: 8px; }
@media (min-width: 768px) { .hero-dots { margin-top: 28px; } }
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
.poster-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; width: 100%; box-sizing: border-box; }
@media (min-width: 480px) { .poster-grid { gap: 7px; } }
@media (min-width: 540px) { .poster-grid { grid-template-columns: repeat(4, 1fr); gap: 9px; } }
@media (min-width: 768px) { .poster-grid { grid-template-columns: repeat(5, 1fr); gap: 11px; } }
@media (min-width: 1024px) { .poster-grid { grid-template-columns: repeat(6, 1fr); gap: 13px; } }
@media (min-width: 1280px) { .poster-grid { grid-template-columns: repeat(7, 1fr); gap: 14px; } }
.poster-grid > * { min-width: 0; width: 100%; box-sizing: border-box; }
.empty-state { text-align: center; padding: 40px 16px; }

.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.hero-fade-enter-from { opacity: 0; transform: translateY(16px); }
.hero-fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* ─── Latest section ──────────────────────────────────────── */
.latest-section {
  margin-bottom: 28px;
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0,255,157,0.08);
}
.latest-title-wrap {
  display: flex; align-items: center; gap: 10px;
}
.live-dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: #00ff9d; flex-shrink: 0;
  box-shadow: 0 0 0 0 rgba(0,255,157,0.6);
  animation: live-pulse 1.8s ease-in-out infinite;
}
@keyframes live-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(0,255,157,0.6); }
  60%  { box-shadow: 0 0 0 7px rgba(0,255,157,0); }
  100% { box-shadow: 0 0 0 0 rgba(0,255,157,0); }
}
.latest-kicker { color: #00ff9d !important; }

/* ─── Carousel arrows ─────────────────────────────────────── */
.hero-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  border-radius: 50%;
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background 0.2s, border-color 0.2s;
  padding: 0;
}
.hero-arrow:hover { background: rgba(0,255,157,0.2); border-color: rgba(0,255,157,0.4); }
.hero-arrow--left  { left: 10px; }
.hero-arrow--right { right: 10px; }
@media (min-width: 768px) {
  .hero-arrow { width: 42px; height: 42px; }
  .hero-arrow--left  { left: 20px; }
  .hero-arrow--right { right: 20px; }
}

/* ─── Latest scroll wrapper + arrows ─────────────────────── */
.latest-scroll-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}
.scroll-arrow {
  flex-shrink: 0;
  background: rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.13);
  color: #fff;
  border-radius: 50%;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background 0.2s, border-color 0.2s;
  padding: 0;
  z-index: 2;
}
.scroll-arrow:hover { background: rgba(0,255,157,0.2); border-color: rgba(0,255,157,0.4); }
/* arrows visible on all screen sizes */

/* Horizontal scroll track */
.latest-scroll-track {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  padding-bottom: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-snap-type: x mandatory;
}
.latest-scroll-track::-webkit-scrollbar { display: none; }

/* Each card wrapper */
.latest-card-wrap {
  position: relative;
  flex: 0 0 calc(33.333% - 5px);
  min-width: 100px;
  max-width: 160px;
  cursor: pointer;
  scroll-snap-align: start;
}
@media (min-width: 480px)  { .latest-card-wrap { flex: 0 0 calc(25% - 6px); } }
@media (min-width: 640px)  { .latest-card-wrap { flex: 0 0 calc(20% - 7px); } }
@media (min-width: 768px)  { .latest-card-wrap { flex: 0 0 calc(16.666% - 7px); } }
@media (min-width: 1024px) { .latest-card-wrap { flex: 0 0 calc(14.285% - 8px); max-width: 180px; } }

/* NEW badge */
.latest-new-badge {
  position: absolute; top: 6px; left: 6px; z-index: 20;
  background: linear-gradient(135deg, #00ff9d, #00d4ff);
  color: #021a10; font-size: 0.52rem; font-weight: 900;
  letter-spacing: 0.1em; padding: 2px 7px; border-radius: 4px;
  pointer-events: none;
}

/* Type tag */
.latest-type-tag {
  font-size: 0.56rem; font-weight: 700; letter-spacing: 0.08em;
  color: rgba(255,255,255,0.35); text-transform: uppercase;
  margin-top: 4px; padding: 0 2px; text-align: center;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

.loading-msg { display: flex; flex-direction: column; align-items: center; gap: 10px; color: rgba(255,255,255,0.3); font-size: 0.75rem; letter-spacing: 0.1em; }
.loading-dots { display: flex; gap: 5px; }
.loading-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(0,255,157,0.4); animation: dot-bounce 1.2s ease-in-out infinite; }
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dot-bounce { 0%,80%,100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
</style>
