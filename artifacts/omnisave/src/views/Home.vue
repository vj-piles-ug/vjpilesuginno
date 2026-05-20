<template>
  <main class="relative overflow-x-hidden">

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

      <!-- Particle dots -->
      <div class="hero-particles">
        <div v-for="n in 18" :key="n" class="particle" :style="particleStyle(n)"></div>
      </div>

      <!-- Hero content -->
      <div class="hero-content-wrap">
        <div class="hero-content">
          <!-- Chips -->
          <div class="hero-chips">
            <span class="glass-chip">OMNISAVE</span>
            <span class="glass-chip">HD MP4</span>
            <span class="glass-chip">SUBTITLES</span>
          </div>

          <!-- Slide content (animated) -->
          <transition name="hero-fade" mode="out-in">
            <div :key="currentSlide" class="hero-text-block">
              <p class="hero-category" :style="{ color: heroSlides[currentSlide].accent }">
                {{ heroSlides[currentSlide].type }}
              </p>
              <h1 class="hero-title">{{ heroSlides[currentSlide].title }}</h1>
              <p class="hero-desc">{{ heroSlides[currentSlide].desc }}</p>
              <div class="hero-actions">
                <button class="btn-hero-primary" @click="openDownload(heroSlides[currentSlide])">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  DOWNLOAD
                </button>
                <button class="btn-hero-outline">LEARN MORE</button>
              </div>
            </div>
          </transition>

          <!-- Slide indicators -->
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

      <!-- Progress bar -->
      <div class="hero-progress-track">
        <div class="hero-progress-fill" :style="{ width: progressWidth + '%' }"></div>
      </div>
    </section>

    <!-- ===== SEARCH BAR ===== -->
    <section class="search-section">
      <div class="search-glow"></div>
      <div class="section-container">
        <form class="search-form" @submit.prevent="handleSearch">
          <div class="search-icon">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            v-model="query"
            type="text"
            placeholder="Search movies, TV shows, anime by title..."
            class="search-input"
            autocomplete="off"
          />
          <button type="submit" class="search-btn">SEARCH</button>
        </form>
      </div>
    </section>

    <!-- ===== RESULTS / GRID ===== -->
    <div class="section-container pb-16 pt-2">

      <!-- Search results -->
      <template v-if="searchTerm && filteredMovies.length > 0">
        <div class="grid-header">
          <div>
            <p class="section-kicker">SEARCH RESULTS</p>
            <h2 class="section-title">Results for "{{ searchTerm }}"</h2>
          </div>
          <span class="result-count">{{ filteredMovies.length }} FOUND</span>
        </div>
        <div class="movie-grid">
          <div v-for="movie in filteredMovies" :key="movie.id" class="movie-card cursor-pointer" @click="openDownload(movie)">
            <MovieCard :movie="movie" />
          </div>
        </div>
      </template>

      <!-- No results -->
      <template v-else-if="searchTerm && filteredMovies.length === 0">
        <div class="empty-state">
          <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <p class="section-kicker mb-2">SEARCH</p>
          <h3 class="text-xl font-bold text-white mb-1">No results found</h3>
          <p class="text-sm text-white/45">Try different keywords</p>
        </div>
      </template>

      <!-- Default: Trending sections -->
      <template v-else>
        <!-- Trending Movies -->
        <div class="content-section">
          <div class="grid-header">
            <div>
              <p class="section-kicker">TRENDING</p>
              <h2 class="section-title">Popular Movies</h2>
            </div>
            <RouterLink to="/movies" class="see-all-link">SEE ALL →</RouterLink>
          </div>
          <div class="movie-grid">
            <div v-for="movie in trendingMovies" :key="movie.id" class="movie-card cursor-pointer" @click="openDownload(movie)">
              <MovieCard :movie="movie" />
            </div>
          </div>
        </div>

        <!-- Trending Series -->
        <div class="content-section">
          <div class="grid-header">
            <div>
              <p class="section-kicker">TRENDING</p>
              <h2 class="section-title">Popular TV Series</h2>
            </div>
            <RouterLink to="/series" class="see-all-link">SEE ALL →</RouterLink>
          </div>
          <div class="movie-grid">
            <div v-for="movie in trendingSeries" :key="movie.id" class="movie-card cursor-pointer" @click="openDownload(movie)">
              <MovieCard :movie="movie" />
            </div>
          </div>
        </div>

        <!-- Trending Animation -->
        <div class="content-section">
          <div class="grid-header">
            <div>
              <p class="section-kicker">TRENDING</p>
              <h2 class="section-title">Animation &amp; Anime</h2>
            </div>
            <RouterLink to="/animation" class="see-all-link">SEE ALL →</RouterLink>
          </div>
          <div class="movie-grid">
            <div v-for="movie in trendingAnimation" :key="movie.id" class="movie-card cursor-pointer" @click="openDownload(movie)">
              <MovieCard :movie="movie" />
            </div>
          </div>
        </div>
      </template>

      <!-- FAQ -->
      <section class="mt-12 md:mt-16">
        <div class="soft-divider mb-10"></div>
        <div class="mb-6">
          <p class="section-kicker mb-1">HELP</p>
          <h2 class="section-title">Frequently Asked Questions</h2>
        </div>
        <div class="space-y-3">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <button class="faq-btn" @click="toggleFaq(i)">
              <div class="flex min-w-0 flex-1 items-center gap-3">
                <div class="faq-q-badge">Q</div>
                <h3 class="text-sm font-semibold text-white md:text-base">{{ faq.q }}</h3>
              </div>
              <div class="faq-chevron">
                <svg class="h-4 w-4 text-white/50 transition-transform duration-300" :style="{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>
            <div class="faq-answer" :class="{ open: openFaq === i }">
              <div>
                <div class="px-5 pb-5 pt-1 md:px-6 md:pb-6">
                  <div class="flex items-start gap-3">
                    <div class="faq-a-badge">A</div>
                    <p class="whitespace-pre-line pt-1 text-sm leading-7 text-white/60">{{ faq.a }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Download Modal -->
    <DownloadModal :movie="downloadTarget" @close="downloadTarget = null" />
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import DownloadModal from '../components/DownloadModal.vue'
import { allMovies, movies, series, animation, type Movie } from '../data/movies'

// Search
const query = ref('')
const searchTerm = ref('')
function handleSearch() { searchTerm.value = query.value.trim() }
const filteredMovies = computed(() => {
  if (!searchTerm.value) return []
  const q = searchTerm.value.toLowerCase()
  return allMovies.filter(m => m.title.toLowerCase().includes(q))
})

// Trending slices
const trendingMovies    = computed(() => movies.slice(0, 6))
const trendingSeries    = computed(() => series.slice(0, 6))
const trendingAnimation = computed(() => animation.slice(0, 6))

// Download modal
const downloadTarget = ref<Movie | null>(null)
function openDownload(item: Movie | typeof heroSlides[0]) { downloadTarget.value = item as Movie }

// FAQ
const openFaq = ref<number | null>(null)
function toggleFaq(i: number) { openFaq.value = openFaq.value === i ? null : i }

const faqs = [
  { q: 'How does VJ Piles UG work as a video downloader?', a: 'VJ Piles UG uses a search-first workflow:\n1. Enter the title you want in the search bar\n2. Open the matching movie, TV show, or anime result\n3. Choose the available video quality and subtitle option\n4. Start the download and save the file for offline viewing' },
  { q: 'Can I download videos with subtitles?', a: 'Yes! Supported results include subtitle files in addition to the video file. When subtitles are available, choose the language you want and download the subtitle file alongside the video.' },
  { q: 'What video qualities are available?', a: 'We offer practical MP4 download options: 480P, 720P HD, and 1080P Full HD when the source provides them. Available quality levels can vary by title and source.' },
  { q: 'Do I need to paste a video link?', a: 'No. The VJ Piles UG experience is optimized for searching by title. Find the video resource from search results, then open its download options — no URL pasting required.' },
  { q: 'Is VJ Piles UG free to use?', a: 'Yes! VJ Piles UG is completely free and does not require extra software. Availability of files, subtitles, and quality options depends on the source attached to each result.' },
]

// ===== HERO SLIDESHOW =====
const heroSlides = [
  { id: 1, title: 'The Expendables 2',   type: 'ACTION  •  ADVENTURE',  desc: 'Barney and his crew of elite mercenaries face their most lethal adversary yet, unleashing unstoppable firepower.',          bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0d2a4a 0%, #071220 55%, #050c08 100%)', accent: '#4db8ff',  color: '#0d2a4a', genres: ['Action','Adventure','Thriller'], rating: 6.6, date: '2012-08-17' },
  { id: 2, title: 'Breaking Bad',         type: 'TV SERIES  •  DRAMA',   desc: 'A high school chemistry teacher diagnosed with terminal cancer turns to a life of crime to secure his family\'s future.',      bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a1a08 0%, #100f06 55%, #050c08 100%)', accent: '#ffd700',  color: '#1a1a08', genres: ['Drama','Crime','Thriller'],     rating: 9.5, date: '2008-01-20' },
  { id: 3, title: 'Spider-Man: Across the Spider-Verse', type: 'ANIMATION  •  ACTION', desc: 'Miles Morales catapults across the multiverse where he encounters a team of Spider-People charged with protecting it.', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a0a3a 0%, #0f0620 55%, #050c08 100%)', accent: '#ff6bde',  color: '#1a0a3a', genres: ['Animation','Action','Adventure'], rating: 8.6, date: '2023-06-02' },
  { id: 4, title: 'The Last of Us',       type: 'TV SERIES  •  DRAMA',   desc: 'A hardened survivor and a teenage girl journey across a post-apocalyptic America, forming an unlikely bond.',               bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0a1f0a 0%, #071207 55%, #050c08 100%)', accent: '#7aff5c',  color: '#0a1f0a', genres: ['Drama','Action','Sci-Fi'],      rating: 8.8, date: '2023-01-15' },
  { id: 5, title: 'John Wick 4',          type: 'ACTION  •  THRILLER',   desc: 'John Wick takes on his most powerful adversaries yet in his quest to earn his freedom from the High Table.',                  bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #2a0a0a 0%, #180606 55%, #050c08 100%)', accent: '#ff6b6b',  color: '#2a0a0a', genres: ['Action','Thriller','Crime'],    rating: 7.7, date: '2023-03-24' },
]

const currentSlide = ref(0)
const SLIDE_MS = 6000
const progressWidth = ref(0)
let autoTimer: ReturnType<typeof setInterval> | null = null
let progressAnim: ReturnType<typeof setInterval> | null = null

function goToSlide(i: number) {
  currentSlide.value = i
  restartProgress()
}
function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
  restartProgress()
}
function restartProgress() {
  progressWidth.value = 0
  if (progressAnim) clearInterval(progressAnim)
  const step = 100 / (SLIDE_MS / 40)
  progressAnim = setInterval(() => {
    progressWidth.value = Math.min(progressWidth.value + step, 100)
  }, 40)
}
onMounted(() => { restartProgress(); autoTimer = setInterval(nextSlide, SLIDE_MS) })
onUnmounted(() => { if (autoTimer) clearInterval(autoTimer); if (progressAnim) clearInterval(progressAnim) })

// Particles
function particleStyle(n: number) {
  return {
    left: `${(n * 37 + 11) % 100}%`,
    top: `${(n * 53 + 7) % 100}%`,
    width: `${2 + (n % 3)}px`,
    height: `${2 + (n % 3)}px`,
    opacity: 0.08 + (n % 5) * 0.04,
    animationDelay: `${n * 0.4}s`,
  }
}
</script>

<style scoped>
/* HERO */
.hero-section {
  position: relative;
  min-height: 82vh;
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
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(5,12,8,0.96) 0%, rgba(5,12,8,0.7) 55%, rgba(5,12,8,0.15) 100%);
}
.hero-overlay-v {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 45%);
}
.hero-particles { position: absolute; inset: 0; pointer-events: none; }
.particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(0,255,157,0.6);
  animation: pulse-particle 4s ease-in-out infinite;
}
@keyframes pulse-particle {
  0%, 100% { transform: scale(1); opacity: inherit; }
  50% { transform: scale(1.8); }
}

.hero-content-wrap {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  align-items: center;
}
.hero-content {
  width: 100%;
  max-width: 1380px;
  margin: 0 auto;
  padding: 60px 32px 100px;
}
@media (min-width: 768px) { .hero-content { padding: 80px 48px 120px; } }
@media (min-width: 1280px) { .hero-content { padding: 80px 64px 120px; } }

/* chips */
.hero-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px; }

/* slide text */
.hero-text-block { max-width: 600px; }
.hero-category {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.2em;
  margin-bottom: 14px;
  text-transform: uppercase;
}
.hero-title {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.06;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: -0.01em;
}
.hero-desc {
  font-size: 1rem;
  line-height: 1.75;
  color: rgba(255,255,255,0.58);
  max-width: 500px;
  margin-bottom: 32px;
}
@media (min-width: 768px) { .hero-desc { font-size: 1.05rem; } }

.hero-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 28px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #00ff9d 0%, #00c8b8 50%, #00d4ff 100%);
  color: #021a10;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
  box-shadow: 0 14px 38px rgba(0,255,157,0.28);
  transition: filter 0.2s, box-shadow 0.2s, transform 0.15s;
}
.btn-hero-primary:hover {
  filter: brightness(1.07);
  box-shadow: 0 18px 48px rgba(0,255,157,0.36);
  transform: translateY(-1px);
}
.btn-hero-outline {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.8);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.btn-hero-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); }

/* dots */
.hero-dots { display: flex; align-items: center; gap: 8px; margin-top: 44px; }
.hero-dot {
  height: 5px;
  border-radius: 3px;
  border: none;
  cursor: pointer;
  background: rgba(255,255,255,0.25);
  width: 6px;
  transition: background 0.3s, width 0.3s;
}
.hero-dot.active { background: #00ff9d; width: 28px; }

/* progress bar */
.hero-progress-track { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,0.08); z-index: 20; }
.hero-progress-fill { height: 100%; background: linear-gradient(90deg, #00ff9d, #00d4ff); transition: width 0.1s linear; }

/* SEARCH */
.search-section {
  position: relative;
  padding: 0 24px;
  margin-top: -28px;
  margin-bottom: 40px;
  z-index: 30;
}
@media (min-width: 768px) { .search-section { padding: 0 48px; margin-top: -36px; margin-bottom: 52px; } }
.search-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 60% 200% at 50% 50%, rgba(0,255,157,0.05), transparent);
}
.search-form {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 9999px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,157,0.06);
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.search-form:focus-within {
  border-color: rgba(0,255,157,0.35);
  box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 0 0 3px rgba(0,255,157,0.08);
}
.search-icon {
  flex-shrink: 0;
  padding: 0 20px;
  color: rgba(255,255,255,0.4);
}
.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 18px 0;
}
.search-input::placeholder { color: rgba(255,255,255,0.35); }
.search-btn {
  flex-shrink: 0;
  margin: 6px;
  padding: 12px 32px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #00ff9d 0%, #00c8b8 50%, #00d4ff 100%);
  color: #021a10;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,255,157,0.22);
  transition: filter 0.2s;
}
.search-btn:hover { filter: brightness(1.06); }

/* SHARED LAYOUT */
.section-container {
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (min-width: 768px) { .section-container { padding: 0 48px; } }
@media (min-width: 1280px) { .section-container { padding: 0 64px; } }

.content-section { margin-bottom: 52px; }

.grid-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 20px;
}
.see-all-link {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: rgba(0,255,157,0.7);
  text-decoration: none;
  transition: color 0.15s;
  white-space: nowrap;
  margin-bottom: 4px;
}
.see-all-link:hover { color: #00ff9d; }
.result-count {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.3);
  margin-bottom: 4px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}
@media (min-width: 768px) { .movie-grid { gap: 20px; } }

.empty-state { text-align: center; padding: 80px 16px; }
.empty-icon { width: 72px; height: 72px; margin: 0 auto 20px; color: rgba(255,255,255,0.12); }

/* FAQ */
.faq-item {
  border-radius: 18px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  overflow: hidden;
  transition: border-color 0.2s, background 0.2s;
}
.faq-item:hover { border-color: rgba(255,255,255,0.14); background: rgba(255,255,255,0.05); }
.faq-btn {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
}
.faq-q-badge, .faq-a-badge {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 800;
  color: rgba(255,255,255,0.65);
}
.faq-chevron {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}
.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition: grid-template-rows 0.3s ease-out, opacity 0.3s ease-out;
}
.faq-answer.open { grid-template-rows: 1fr; opacity: 1; }
.faq-answer > div { overflow: hidden; }

/* Hero transition */
.hero-fade-enter-active, .hero-fade-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.hero-fade-enter-from { opacity: 0; transform: translateY(22px); }
.hero-fade-leave-to { opacity: 0; transform: translateY(-14px); }
</style>
