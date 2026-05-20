<template>
  <main class="relative w-full overflow-x-hidden">

    <!-- HERO SLIDESHOW -->
    <section class="hero-section">
      <div
        v-for="(slide, i) in heroSlides"
        :key="i"
        class="hero-slide"
        :class="{ active: currentSlide === i }"
      >
        <div class="hero-slide-bg" :style="{ background: slide.bg }"></div>
        <div class="hero-overlay-h"></div>
        <div class="hero-overlay-v"></div>
      </div>

      <div class="hero-particles">
        <div v-for="n in 14" :key="n" class="particle" :style="particleStyle(n)"></div>
      </div>

      <div class="hero-content-wrap">
        <div class="hero-content">
          <transition name="hero-fade" mode="out-in">
            <div :key="currentSlide" class="hero-text-block">
              <p class="hero-category" :style="{ color: heroSlides[currentSlide].accent }">
                {{ heroSlides[currentSlide].type }}
              </p>
              <h1 class="hero-title">{{ heroSlides[currentSlide].title }}</h1>
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
        <!-- Loading state -->
        <div v-if="dbLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p class="loading-text">Loading content...</p>
        </div>

        <section v-else class="content-section">
          <div class="section-header">
            <div>
              <p class="section-kicker">TRENDING</p>
              <h2 class="section-title">Movies, Series &amp; Animation</h2>
            </div>
          </div>
          <div v-if="displayContent.length > 0" class="poster-grid">
            <MovieCard
              v-for="movie in displayContent"
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

      <!-- FAQ -->
      <section class="faq-section">
        <div class="soft-divider mb-8"></div>
        <p class="section-kicker mb-1">HELP</p>
        <h2 class="section-title mb-6">Frequently Asked Questions</h2>
        <div class="space-y-3">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <button class="faq-btn" @click="toggleFaq(i)">
              <div class="flex min-w-0 flex-1 items-center gap-3">
                <div class="faq-q-badge">Q</div>
                <h3 class="text-sm font-semibold text-white">{{ faq.q }}</h3>
              </div>
              <svg class="faq-chevron" :style="{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div class="faq-answer" :class="{ open: openFaq === i }">
              <div>
                <div class="px-5 pb-5 pt-1">
                  <div class="flex items-start gap-3">
                    <div class="faq-a-badge">A</div>
                    <p class="pt-1 text-sm leading-7 text-white/55 whitespace-pre-line">{{ faq.a }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import type { Movie } from '../data/movies'
import { publicAll, publicTrending, dbLoading } from '../store/db'

const route = useRoute()
const externalQuery = computed(() => (route.query.q as string) || '')

const searchResults = computed(() => {
  if (!externalQuery.value) return []
  const q = externalQuery.value.toLowerCase()
  return publicAll.value.filter(m => m.title.toLowerCase().includes(q))
})

const displayContent = computed(() => {
  const trending = publicTrending.value
  if (trending.length > 0) return trending
  return publicAll.value.slice(0, 24)
})

const downloadTarget = ref<Movie | null>(null)
function openDownload(item: Movie) { downloadTarget.value = item }

const openFaq = ref<number | null>(null)
function toggleFaq(i: number) { openFaq.value = openFaq.value === i ? null : i }

const faqs = [
  { q: 'How does VJ Piles UG work as a video downloader?', a: 'Use the search bar in the header to find movies, TV shows, or anime by title. Open a result and choose your preferred quality and subtitle option, then download.' },
  { q: 'Can I download videos with subtitles?', a: 'Yes! When available, subtitle files are listed alongside the video file. Choose your preferred language and download both.' },
  { q: 'What video qualities are available?', a: 'We offer 360P, 480P, 720P HD, and 1080P Full HD MP4 options. Available qualities vary by title and source.' },
  { q: 'Is VJ Piles UG free to use?', a: 'Browse content freely. A subscription unlocks unlimited HD downloads.' },
]

const heroSlides = [
  { title: 'The Expendables 2',   type: 'ACTION  •  ADVENTURE',  bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0d2a4a 0%, #071220 60%, #050c08 100%)', accent: '#4db8ff' },
  { title: 'Breaking Bad',         type: 'TV SERIES  •  DRAMA',   bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a1a08 0%, #100f06 60%, #050c08 100%)', accent: '#ffd700' },
  { title: 'Spider-Man: Across the Spider-Verse', type: 'ANIMATION  •  ACTION', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a0a3a 0%, #0f0620 60%, #050c08 100%)', accent: '#ff6bde' },
  { title: 'The Last of Us',       type: 'TV SERIES  •  DRAMA',   bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0a1f0a 0%, #071207 60%, #050c08 100%)', accent: '#7aff5c' },
  { title: 'John Wick 4',          type: 'ACTION  •  THRILLER',   bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #2a0a0a 0%, #180606 60%, #050c08 100%)', accent: '#ff6b6b' },
]

const currentSlide = ref(0)
const SLIDE_MS = 6000
let autoTimer: ReturnType<typeof setInterval> | null = null

function goToSlide(i: number) { currentSlide.value = i }
function nextSlide() { currentSlide.value = (currentSlide.value + 1) % heroSlides.length }

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
.hero-slide-bg { position: absolute; inset: 0; }
.hero-overlay-h { position: absolute; inset: 0; background: linear-gradient(to right, rgba(5,12,8,0.96) 0%, rgba(5,12,8,0.7) 55%, rgba(5,12,8,0.1) 100%); }
.hero-overlay-v { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 50%); }
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
.content-wrap { width: 100%; padding: 20px 12px 60px; }
@media (min-width: 640px) { .content-wrap { padding: 24px 16px 60px; } }
.content-section { margin-bottom: 40px; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 14px; }
.section-kicker { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.16em; color: rgba(0,255,157,0.7); text-transform: uppercase; }
.section-title { font-size: clamp(1.1rem, 2.5vw, 1.4rem); font-weight: 800; color: #fff; }
.count-badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); margin-bottom: 4px; }
.poster-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
@media (min-width: 640px) { .poster-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px; } }
@media (min-width: 1024px) { .poster-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; } }
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 16px; gap: 16px; }
.loading-spinner { width: 36px; height: 36px; border: 3px solid rgba(0,255,157,0.15); border-top-color: #00ff9d; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-size: 0.82rem; color: rgba(255,255,255,0.35); }
.empty-state { text-align: center; padding: 60px 16px; }
.faq-section { margin-top: 8px; }
.faq-item { border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); overflow: hidden; transition: border-color 0.2s; }
.faq-item:hover { border-color: rgba(255,255,255,0.13); }
.faq-btn { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 12px; padding: 16px 18px; background: transparent; border: none; cursor: pointer; text-align: left; }
.faq-q-badge, .faq-a-badge { flex-shrink: 0; width: 26px; height: 26px; border-radius: 8px; background: rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: rgba(255,255,255,0.6); }
.faq-chevron { flex-shrink: 0; width: 18px; height: 18px; color: rgba(255,255,255,0.4); transition: transform 0.3s; }
.faq-answer { display: grid; grid-template-rows: 0fr; opacity: 0; transition: grid-template-rows 0.3s ease-out, opacity 0.3s ease-out; }
.faq-answer.open { grid-template-rows: 1fr; opacity: 1; }
.faq-answer > div { overflow: hidden; }
.soft-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent); }
.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.hero-fade-enter-from { opacity: 0; transform: translateY(16px); }
.hero-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
