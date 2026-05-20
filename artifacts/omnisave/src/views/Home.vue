<template>
  <main class="relative w-full overflow-x-hidden">

    <!-- ===== HERO SLIDESHOW ===== -->
    <section class="hero-section">
      <!-- Slides -->
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

      <!-- Particles -->
      <div class="hero-particles">
        <div v-for="n in 14" :key="n" class="particle" :style="particleStyle(n)"></div>
      </div>

      <!-- Hero content -->
      <div class="hero-content-wrap">
        <div class="hero-content">
          <transition name="hero-fade" mode="out-in">
            <div :key="currentSlide" class="hero-text-block">
              <p class="hero-category" :style="{ color: heroSlides[currentSlide].accent }">
                {{ heroSlides[currentSlide].type }}
              </p>
              <h1 class="hero-title">{{ heroSlides[currentSlide].title }}</h1>
              <p class="hero-desc">{{ heroSlides[currentSlide].desc }}</p>
              <div class="hero-actions">
                <button class="btn-hero-download" @click="openDownload(heroSlides[currentSlide])">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  DOWNLOAD
                </button>
                <button class="btn-hero-outline">DETAILS</button>
              </div>
            </div>
          </transition>

          <!-- Slide dots -->
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

    <!-- ===== CONTENT GRIDS ===== -->
    <div class="content-wrap">

      <!-- Search results -->
      <template v-if="externalQuery && filteredMovies.length > 0">
        <div class="section-header">
          <div>
            <p class="section-kicker">RESULTS</p>
            <h2 class="section-title">Results for "{{ externalQuery }}"</h2>
          </div>
          <span class="count-badge">{{ filteredMovies.length }}</span>
        </div>
        <div class="poster-grid">
          <MovieCard
            v-for="movie in filteredMovies"
            :key="movie.id"
            :movie="movie"
            @click="openDownload(movie)"
          />
        </div>
      </template>

      <template v-else-if="externalQuery && filteredMovies.length === 0">
        <div class="empty-state">
          <svg width="52" height="52" fill="none" stroke="currentColor" viewBox="0 0 24 24" class="opacity-20">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <h3 class="mt-4 text-base font-bold text-white">No results for "{{ externalQuery }}"</h3>
          <p class="mt-1 text-sm text-white/40">Try a different keyword</p>
        </div>
      </template>

      <!-- Default sections: ALL content in one mixed section -->
      <template v-else>
        <section class="content-section">
          <div class="section-header">
            <div>
              <p class="section-kicker">TRENDING</p>
              <h2 class="section-title">Movies, Series &amp; Animation</h2>
            </div>
          </div>
          <div class="poster-grid">
            <MovieCard
              v-for="movie in allTrending"
              :key="movie.id"
              :movie="movie"
              @click="openDownload(movie)"
            />
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

    <!-- Download modal -->
    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import { allMovies, movies, series, animation, type Movie } from '../data/movies'

// Search from header query param
const route = useRoute()
const externalQuery = computed(() => (route.query.q as string) || '')
const filteredMovies = computed(() => {
  if (!externalQuery.value) return []
  const q = externalQuery.value.toLowerCase()
  return allMovies.filter(m => m.title.toLowerCase().includes(q))
})

// Single mixed trending section
const allTrending = computed(() => {
  const m = movies.slice(0, 8)
  const s = series.slice(0, 8)
  const a = animation.slice(0, 8)
  const mixed: typeof m = []
  const max = Math.max(m.length, s.length, a.length)
  for (let i = 0; i < max; i++) {
    if (m[i]) mixed.push(m[i])
    if (s[i]) mixed.push(s[i])
    if (a[i]) mixed.push(a[i])
  }
  return mixed
})

// Download modal
const downloadTarget = ref<Movie | null>(null)
function openDownload(item: any) { downloadTarget.value = item as Movie }

// FAQ
const openFaq = ref<number | null>(null)
function toggleFaq(i: number) { openFaq.value = openFaq.value === i ? null : i }

const faqs = [
  { q: 'How does VJ Piles UG work as a video downloader?', a: 'Use the search bar in the header to find movies, TV shows, or anime by title. Open a result and choose your preferred quality and subtitle option, then download.' },
  { q: 'Can I download videos with subtitles?', a: 'Yes! When available, subtitle files are listed alongside the video file. Choose your preferred language and download both.' },
  { q: 'What video qualities are available?', a: 'We offer 360P, 480P, 720P HD, and 1080P Full HD MP4 options. Available qualities vary by title and source.' },
  { q: 'Is VJ Piles UG free to use?', a: 'Yes — VJ Piles UG is completely free. No extra software or account required to browse and download.' },
]

// ===== HERO SLIDESHOW =====
const heroSlides = [
  { title: 'The Expendables 2',   type: 'ACTION  •  ADVENTURE',  desc: 'Barney and his crew of elite mercenaries face their most lethal adversary yet.',             bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0d2a4a 0%, #071220 60%, #050c08 100%)', accent: '#4db8ff',  color: '#0d2a4a', genres: ['Action','Adventure'], rating: 6.6, date: '2012-08-17' },
  { title: 'Breaking Bad',         type: 'TV SERIES  •  DRAMA',   desc: 'A chemistry teacher turns to a life of crime to secure his family\'s future.',                bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a1a08 0%, #100f06 60%, #050c08 100%)', accent: '#ffd700',  color: '#1a1a08', genres: ['Drama','Crime'],       rating: 9.5, date: '2008-01-20' },
  { title: 'Spider-Man: Across the Spider-Verse', type: 'ANIMATION  •  ACTION', desc: 'Miles Morales catapults across the multiverse in a breathtaking new adventure.',   bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a0a3a 0%, #0f0620 60%, #050c08 100%)', accent: '#ff6bde',  color: '#1a0a3a', genres: ['Animation','Action'],  rating: 8.6, date: '2023-06-02' },
  { title: 'The Last of Us',       type: 'TV SERIES  •  DRAMA',   desc: 'A hardened survivor and a teenage girl journey across a post-apocalyptic America.',           bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0a1f0a 0%, #071207 60%, #050c08 100%)', accent: '#7aff5c',  color: '#0a1f0a', genres: ['Drama','Action'],      rating: 8.8, date: '2023-01-15' },
  { title: 'John Wick 4',          type: 'ACTION  •  THRILLER',   desc: 'John Wick takes on his most powerful adversaries yet in his quest for freedom.',              bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #2a0a0a 0%, #180606 60%, #050c08 100%)', accent: '#ff6b6b',  color: '#2a0a0a', genres: ['Action','Thriller'],   rating: 7.7, date: '2023-03-24' },
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
/* HERO */
.hero-section {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.hero-slide {
  position: absolute;
  inset: 0;
  transition: opacity 1.2s ease-in-out;
  opacity: 0;
}
.hero-slide.active { opacity: 1; }
.hero-slide-bg { position: absolute; inset: 0; }
.hero-overlay-h {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(5,12,8,0.96) 0%, rgba(5,12,8,0.7) 55%, rgba(5,12,8,0.1) 100%);
}
.hero-overlay-v {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 50%);
}
.hero-particles { position: absolute; inset: 0; pointer-events: none; }
.particle {
  position: absolute; border-radius: 50%;
  background: rgba(0,255,157,0.6);
  animation: pp 4s ease-in-out infinite;
}
@keyframes pp { 0%,100% { transform: scale(1); } 50% { transform: scale(2); } }

.hero-content-wrap {
  position: relative; z-index: 10;
  flex: 1; display: flex; align-items: center;
}
.hero-content {
  width: 100%;
  padding: 32px 24px 28px;
}
@media (min-width: 768px) { .hero-content { padding: 36px 48px 32px; } }
@media (min-width: 1280px) { .hero-content { padding: 40px 72px 32px; } }
@media (min-width: 1920px) { .hero-content { padding: 40px 120px 32px; } }

.hero-text-block { max-width: 540px; }
.hero-category {
  font-size: 0.7rem; font-weight: 800; letter-spacing: 0.2em;
  margin-bottom: 10px; text-transform: uppercase;
}
.hero-title {
  font-size: clamp(1.8rem, 4vw, 3.2rem);
  font-weight: 800; line-height: 1.06;
  color: #fff; margin-bottom: 14px; letter-spacing: -0.01em;
}
.hero-desc {
  font-size: 0.9rem; line-height: 1.65;
  color: rgba(255,255,255,0.52); max-width: 480px; margin-bottom: 24px;
}
.hero-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.btn-hero-download {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 26px; border-radius: 12px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.76rem; font-weight: 800; letter-spacing: 0.1em;
  border: none; cursor: pointer;
  box-shadow: 0 10px 30px rgba(0,255,157,0.25);
  transition: filter 0.2s, opacity 0.2s;
}
.btn-hero-download:hover { filter: brightness(1.06); }

.btn-hero-outline {
  display: inline-flex; align-items: center;
  padding: 10px 24px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.8); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em;
  cursor: pointer; transition: background 0.2s, border-color 0.2s;
}
.btn-hero-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }

.hero-dots { display: flex; align-items: center; gap: 7px; margin-top: 28px; }
.hero-dot {
  height: 4px; border-radius: 2px; border: none; cursor: pointer;
  background: rgba(255,255,255,0.22); width: 5px;
  transition: background 0.3s, width 0.3s;
}
.hero-dot.active { background: #00ff9d; width: 24px; }

/* CONTENT */
.content-wrap {
  width: 100%;
  padding: 24px 16px 60px;
}
@media (min-width: 640px) { .content-wrap { padding: 28px 24px 60px; } }
@media (min-width: 1024px) { .content-wrap { padding: 32px 48px 60px; } }
@media (min-width: 1280px) { .content-wrap { padding: 32px 72px 60px; } }
@media (min-width: 1920px) { .content-wrap { padding: 32px 120px 60px; } }

.content-section { margin-bottom: 40px; }

.section-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 14px;
}
.count-badge {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em;
  color: rgba(255,255,255,0.3); margin-bottom: 4px;
}
.see-all {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.12em;
  color: rgba(0,255,157,0.65); text-decoration: none;
  transition: color 0.15s; margin-bottom: 4px; white-space: nowrap;
}
.see-all:hover { color: #00ff9d; }

/* Dense poster grid — matches reference image */
.poster-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
}
@media (min-width: 480px) {
  .poster-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 11px; }
}
@media (min-width: 768px) {
  .poster-grid { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
}
@media (min-width: 1024px) {
  .poster-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 14px; }
}
@media (min-width: 1280px) {
  .poster-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
}

.empty-state { text-align: center; padding: 60px 16px; }

/* FAQ */
.faq-section { margin-top: 8px; }
.faq-item {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  overflow: hidden;
  transition: border-color 0.2s;
}
.faq-item:hover { border-color: rgba(255,255,255,0.13); }
.faq-btn {
  display: flex; width: 100%; align-items: center; justify-content: space-between;
  gap: 12px; padding: 16px 18px; background: transparent; border: none; cursor: pointer; text-align: left;
}
.faq-q-badge, .faq-a-badge {
  flex-shrink: 0; width: 26px; height: 26px; border-radius: 8px;
  background: rgba(255,255,255,0.07); display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 800; color: rgba(255,255,255,0.6);
}
.faq-chevron {
  flex-shrink: 0; width: 18px; height: 18px; color: rgba(255,255,255,0.4);
  transition: transform 0.3s;
}
.faq-answer {
  display: grid; grid-template-rows: 0fr;
  opacity: 0; transition: grid-template-rows 0.3s ease-out, opacity 0.3s ease-out;
}
.faq-answer.open { grid-template-rows: 1fr; opacity: 1; }
.faq-answer > div { overflow: hidden; }

/* Shared globals */
.soft-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.08) 70%, transparent);
}

/* Transitions */
.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 0.45s ease, transform 0.45s ease; }
.hero-fade-enter-from { opacity: 0; transform: translateY(16px); }
.hero-fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
