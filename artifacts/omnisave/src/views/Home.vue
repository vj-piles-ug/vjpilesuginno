<template>
  <div class="min-h-screen flex flex-col">

    <!-- ===== HEADER ===== -->
    <header class="sticky top-0 z-50">
      <div class="relative border-b border-white/[0.06] bg-black/30 backdrop-blur-2xl">
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]"></div>
        </div>
        <div class="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-4 px-4 py-2.5 md:px-6 xl:px-8">

          <!-- Left: Logo + Nav -->
          <div class="flex items-center gap-6">
            <!-- Logo -->
            <a class="flex items-center gap-2.5 flex-shrink-0" href="#">
              <div class="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0" style="background: linear-gradient(135deg,#00ff9d,#00c8b8,#00d4ff);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span class="text-base font-bold tracking-tight text-white">OmniSave</span>
            </a>

            <!-- Nav links -->
            <nav class="hidden items-center gap-5 md:flex">
              <button
                v-for="nav in navItems"
                :key="nav"
                class="nav-link"
                :class="{ active: activeNav === nav }"
                @click="activeNav = nav"
              >{{ nav }}</button>
            </nav>
          </div>

          <!-- Right: Subscribe + App + Login -->
          <div class="flex items-center gap-2 sm:gap-2.5">
            <!-- Subscribe -->
            <button class="button-outline hidden items-center gap-1.5 px-4 py-2 text-[13px] sm:flex">
              <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              Subscribe
            </button>

            <!-- App -->
            <button class="button-primary px-3 py-2 text-[13px] sm:px-4 sm:py-2">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <span class="hidden sm:inline">App</span>
            </button>

            <div class="h-6 w-px bg-white/10"></div>

            <!-- Login -->
            <button
              class="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-[13px] font-medium text-white/80 transition-all hover:bg-white/[0.09] hover:border-white/22"
              @click="showLogin = true"
            >
              <svg class="h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              Login
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== MAIN ===== -->
    <div class="flex-1">
      <main class="relative overflow-hidden">

        <!-- ===== HERO SLIDESHOW ===== -->
        <section class="relative h-[520px] md:h-[600px] overflow-hidden">
          <!-- Slides -->
          <div
            v-for="(slide, i) in heroSlides"
            :key="i"
            class="hero-slide"
            :class="{ active: currentSlide === i }"
          >
            <!-- Gradient background (no external images needed) -->
            <div class="absolute inset-0" :style="{ background: slide.bg }"></div>
            <!-- Overlay -->
            <div class="absolute inset-0" style="background: linear-gradient(to right, rgba(5,12,8,0.92) 35%, rgba(5,12,8,0.5) 65%, transparent 100%);"></div>
            <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(5,12,8,1) 0%, transparent 40%);"></div>

            <!-- Decorative shapes -->
            <div class="absolute right-10 top-1/2 -translate-y-1/2 hidden md:block" style="opacity:0.22;">
              <div class="h-64 w-44 rounded-2xl rotate-6 shadow-2xl flex items-center justify-center" :style="{ background: slide.cardBg }">
                <div class="text-center px-4">
                  <div class="h-16 w-16 rounded-full mx-auto mb-3 flex items-center justify-center" style="background: rgba(255,255,255,0.12);">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <p class="text-white text-xs font-semibold">{{ slide.title }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide content overlay -->
          <div class="relative z-10 flex h-full items-end md:items-center">
            <div class="mx-auto w-full max-w-[1380px] px-4 pb-14 md:px-6 md:pb-0 xl:px-8">
              <div class="max-w-xl">
                <!-- Category chip -->
                <div class="mb-4 flex items-center gap-2">
                  <span class="glass-chip" style="letter-spacing:0.2em; text-transform:uppercase;">OmniSave</span>
                  <span class="glass-chip">HD MP4</span>
                  <span class="glass-chip">Subtitles</span>
                </div>

                <!-- Title (animated key change) -->
                <transition name="slide-up" mode="out-in">
                  <div :key="currentSlide">
                    <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest" :style="{ color: heroSlides[currentSlide].accent }">
                      {{ heroSlides[currentSlide].type }}
                    </p>
                    <h1 class="text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl mb-3">
                      {{ heroSlides[currentSlide].title }}
                    </h1>
                    <p class="text-sm leading-6 text-white/60 md:text-base max-w-md">
                      {{ heroSlides[currentSlide].desc }}
                    </p>
                    <div class="mt-5 flex items-center gap-3">
                      <button class="button-primary px-5 py-2.5 text-sm" @click="openDownload(heroSlides[currentSlide])">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download
                      </button>
                      <button class="button-outline px-5 py-2.5 text-sm">
                        Learn more
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Dot indicators -->
          <div class="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            <button
              v-for="(_, i) in heroSlides"
              :key="i"
              @click="goToSlide(i)"
              class="transition-all duration-300"
              :style="{
                height: '6px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                background: currentSlide === i ? '#00ff9d' : 'rgba(255,255,255,0.3)',
                width: currentSlide === i ? '24px' : '6px',
              }"
            />
          </div>

          <!-- Progress bar -->
          <div class="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
            <div
              class="h-full transition-none"
              style="background: linear-gradient(90deg,#00ff9d,#00d4ff); transform-origin: left;"
              :style="{ width: progressWidth + '%', transition: 'width ' + slideInterval + 'ms linear' }"
            ></div>
          </div>
        </section>

        <!-- ===== SEARCH BAR ===== -->
        <div style="background: linear-gradient(to bottom, rgba(5,12,8,1) 0%, #050c08 100%);">
          <div class="relative mx-auto w-full max-w-[1380px] px-4 md:px-6 xl:px-8">
            <div class="relative z-40 -mt-6 mb-10">
              <form class="mx-auto w-full max-w-[1120px]" @submit.prevent="handleSearch">
                <div class="relative">
                  <div class="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-white/50">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <input
                    v-model="query"
                    type="text"
                    placeholder="Search video, movie, TV show, or anime title..."
                    class="input-shell w-full py-4 md:py-5"
                    style="padding-left:56px; padding-right:150px; font-size:0.9rem;"
                    autocomplete="off"
                  />
                  <button
                    type="submit"
                    class="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 flex min-w-[110px] items-center justify-center rounded-[20px] border border-white/10 px-5 py-2.5 text-sm font-semibold text-[#021a10]"
                    style="background: linear-gradient(135deg,#00ff9d 0%,#00c8b8 48%,#00d4ff 100%); box-shadow: 0 10px 28px rgba(0,255,157,0.2);"
                  >Search</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- ===== CONTENT ===== -->
        <div class="relative mx-auto w-full max-w-[1380px] px-4 pb-12 md:px-6 md:pb-16 xl:px-8">

          <!-- Search results -->
          <template v-if="searchTerm && filteredMovies.length > 0">
            <div class="mb-5 flex items-center justify-between">
              <div>
                <p class="section-kicker mb-0.5">Search results</p>
                <h2 class="text-lg font-semibold text-white">Results for "{{ searchTerm }}"</h2>
              </div>
              <span class="text-xs text-white/40">{{ filteredMovies.length }} results</span>
            </div>
            <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));">
              <div v-for="movie in filteredMovies" :key="movie.id" class="movie-card cursor-pointer" @click="openDownload(movie)">
                <MovieCard :movie="movie" />
              </div>
            </div>
          </template>

          <!-- No results -->
          <template v-else-if="searchTerm && filteredMovies.length === 0">
            <section class="w-full py-16 text-center">
              <svg class="mx-auto mb-5 h-20 w-20 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p class="section-kicker mb-3">Search</p>
              <h3 class="mb-2 text-xl font-semibold text-white">No results found</h3>
              <p class="text-sm text-white/50">Try different keywords</p>
            </section>
          </template>

          <!-- Default browsing state — static grid by active nav tab -->
          <template v-else>
            <!-- Trending / categorised grid -->
            <div v-for="group in displayGroups" :key="group.label" class="mb-10">
              <div class="mb-4 flex items-center justify-between">
                <div>
                  <p class="section-kicker mb-0.5">{{ group.kicker }}</p>
                  <h2 class="text-lg font-semibold text-white md:text-xl">{{ group.label }}</h2>
                </div>
              </div>
              <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(165px, 1fr));">
                <div v-for="movie in group.items" :key="movie.id" class="movie-card cursor-pointer" @click="openDownload(movie)">
                  <MovieCard :movie="movie" />
                </div>
              </div>
            </div>
          </template>

          <!-- FAQ -->
          <section class="mt-10 w-full md:mt-12">
            <div class="soft-divider mb-8 md:mb-10"></div>
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-white md:text-2xl">Frequently Asked Questions</h2>
            </div>
            <div class="space-y-3 md:space-y-4">
              <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
                <button class="relative flex w-full items-start justify-between gap-3 px-5 py-4 text-left md:px-6 md:py-5" @click="toggleFaq(i)">
                  <div class="flex min-w-0 flex-1 items-start gap-3">
                    <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white/70">
                      <span class="text-sm font-bold">Q</span>
                    </div>
                    <h3 class="pt-0.5 text-sm font-semibold leading-tight text-white md:text-base">{{ faq.q }}</h3>
                  </div>
                  <div class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                    <svg class="h-4 w-4 text-white/65 transition-transform duration-300" :style="{ transform: openFaq === i ? 'rotate(180deg)' : 'none' }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </div>
                </button>
                <div class="faq-answer" :class="{ open: openFaq === i }">
                  <div>
                    <div class="px-5 pb-5 pt-1 md:px-6 md:pb-6">
                      <div class="flex items-start gap-3">
                        <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-white/[0.08]">
                          <span class="text-sm font-bold text-white/72">A</span>
                        </div>
                        <p class="whitespace-pre-line pt-1 text-sm leading-7 text-white/66">{{ faq.a }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>

    <!-- ===== FOOTER ===== -->
    <footer class="relative border-t border-white/[0.06] pb-7 pt-10 md:pb-9 md:pt-12">
      <div class="mx-auto w-full max-w-[1380px] px-4 md:px-6 xl:px-8">
        <div class="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div class="mb-3 flex items-center gap-2.5">
              <div class="h-8 w-8 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg,#00ff9d,#00c8b8,#00d4ff);">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span class="text-base font-bold text-white">OmniSave</span>
            </div>
            <p class="max-w-xs text-sm text-white/40">Free online video downloader. Search movies, TV shows and anime, pick quality, and download.</p>
          </div>
          <div class="grid grid-cols-2 gap-x-16 gap-y-3 text-sm sm:grid-cols-3">
            <a href="#" class="text-white/50 hover:text-white/80 transition-colors">Movies</a>
            <a href="#" class="text-white/50 hover:text-white/80 transition-colors">TV Series</a>
            <a href="#" class="text-white/50 hover:text-white/80 transition-colors">Animation</a>
            <a href="#" class="text-white/50 hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="#" class="text-white/50 hover:text-white/80 transition-colors">Terms of Service</a>
            <a href="#" class="text-white/50 hover:text-white/80 transition-colors">Contact</a>
          </div>
        </div>
        <div class="soft-divider my-7"></div>
        <p class="text-center text-xs text-white/25">&copy; {{ new Date().getFullYear() }} OmniSave. All rights reserved.</p>
      </div>
    </footer>

    <!-- ===== DOWNLOAD MODAL ===== -->
    <div
      v-if="downloadTarget"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);"
      @click.self="downloadTarget = null"
    >
      <div class="w-full max-w-sm rounded-3xl border border-white/10 p-6" style="background: rgba(8,16,10,0.97);">
        <div class="mb-5 flex items-start gap-4">
          <div class="h-[72px] w-12 flex-shrink-0 rounded-xl flex items-center justify-center" :style="{ background: `linear-gradient(160deg, ${downloadTarget.color}, #050c08)` }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(0,255,157,0.7)"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div class="flex-1">
            <p class="font-semibold text-white">{{ downloadTarget.title }}</p>
            <p class="mt-0.5 text-xs text-white/40">{{ downloadTarget.date }}</p>
            <div class="mt-2 flex flex-wrap gap-1">
              <span v-for="g in (downloadTarget.genres || []).slice(0,3)" :key="g" class="rounded px-1.5 py-0.5 text-[10px] text-white/50" style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1);">{{ g }}</span>
            </div>
          </div>
        </div>
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Select quality</p>
        <div class="space-y-2 mb-4">
          <button v-for="opt in downloadOptions" :key="opt.label" class="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-all hover:border-white/20 hover:bg-white/[0.07]" @click="downloadTarget = null">
            <span class="text-sm font-medium text-white">{{ opt.label }}</span>
            <span class="text-xs text-white/40">{{ opt.size }}</span>
          </button>
        </div>
        <button @click="downloadTarget = null" class="w-full rounded-2xl border border-white/10 bg-transparent py-2.5 text-sm text-white/50 hover:text-white/70 transition-colors">Cancel</button>
      </div>
    </div>

    <!-- ===== LOGIN MODAL ===== -->
    <div
      v-if="showLogin"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.8); backdrop-filter: blur(10px);"
      @click.self="showLogin = false"
    >
      <div class="w-full max-w-sm rounded-3xl border border-white/10 p-8" style="background: rgba(8,16,10,0.97);">
        <div class="mb-6 text-center">
          <div class="mx-auto mb-3 h-10 w-10 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg,#00ff9d,#00c8b8,#00d4ff);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <h2 class="text-xl font-bold text-white">Sign in to OmniSave</h2>
          <p class="mt-1 text-sm text-white/45">Access downloads, history and more</p>
        </div>
        <!-- Google sign-in -->
        <button class="w-full flex items-center justify-center gap-3 rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/[0.09] transition-all mb-3">
          <svg class="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <div class="flex items-center gap-3 my-4">
          <div class="flex-1 h-px bg-white/10"></div>
          <span class="text-xs text-white/30">or</span>
          <div class="flex-1 h-px bg-white/10"></div>
        </div>
        <div class="space-y-3">
          <input type="email" placeholder="Email address" class="input-shell w-full px-4 py-3 text-sm" />
          <input type="password" placeholder="Password" class="input-shell w-full px-4 py-3 text-sm" />
          <button class="button-primary w-full justify-center py-3 text-sm">Sign In</button>
        </div>
        <p class="mt-4 text-center text-xs text-white/35">Don't have an account? <span class="text-[#00ff9d] cursor-pointer hover:underline">Sign up free</span></p>
        <button @click="showLogin = false" class="mt-4 w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors">Cancel</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import { allMovies, type Movie } from '../data/movies'

// Header nav
const navItems = ['Movies', 'Series', 'Animation']
const activeNav = ref('Movies')

// Auth modals
const showLogin = ref(false)

// Search
const query = ref('')
const searchTerm = ref('')
function handleSearch() { searchTerm.value = query.value.trim() }
const filteredMovies = computed(() => {
  if (!searchTerm.value) return []
  const q = searchTerm.value.toLowerCase()
  return allMovies.filter(m => m.title.toLowerCase().includes(q))
})

// Download modal
const downloadTarget = ref<(Movie & { desc?: string; bg?: string; cardBg?: string; accent?: string }) | null>(null)
function openDownload(item: Movie | typeof heroSlides[0]) {
  downloadTarget.value = item as Movie & { desc?: string }
}
const downloadOptions = [
  { label: '1080p Full HD — MP4', size: '~2.1 GB' },
  { label: '720p HD — MP4', size: '~900 MB' },
  { label: '480p SD — MP4', size: '~420 MB' },
  { label: '360p — MP4', size: '~210 MB' },
]

// Display groups for static grid
const displayGroups = computed(() => {
  if (activeNav.value === 'Movies') {
    const movies = allMovies.filter(m => m.type === 'MOVIES')
    return [
      { kicker: 'Trending', label: 'Popular Movies', items: movies.slice(0, 10) },
    ]
  }
  if (activeNav.value === 'Series') {
    const series = allMovies.filter(m => m.type === 'TV SERIES')
    return [
      { kicker: 'Trending', label: 'Popular TV Series', items: series },
    ]
  }
  // Animation
  return [
    { kicker: 'Trending', label: 'Animation & Anime', items: allMovies.filter(m => m.genres.some(g => ['Animation','Anime','Fantasy','Documentary'].includes(g))) },
  ]
})

// ===== HERO SLIDESHOW =====
const heroSlides = [
  {
    id: 1,
    title: 'The Expendables 2',
    type: 'Action • Adventure',
    date: '2012-08-17',
    desc: 'Barney and his crew of elite mercenaries face their most lethal adversary yet, unleashing unstoppable firepower in an all-out battle.',
    bg: 'radial-gradient(ellipse at 80% 30%, #1a3a5c 0%, #0a1a2a 50%, #050c08 100%)',
    cardBg: 'linear-gradient(160deg,#1a3a5c,#0a1a2a)',
    accent: '#4db8ff',
    color: '#1a3a5c',
    genres: ['Action', 'Adventure', 'Thriller'],
    rating: 6.6,
  },
  {
    id: 2,
    title: 'The Expendables 3',
    type: 'Action • Comedy',
    date: '2014-08-15',
    desc: 'Barney augments his team with new blood for a personal battle against Conrad Stonebanks, a ruthless arms trader who co-founded The Expendables.',
    bg: 'radial-gradient(ellipse at 80% 30%, #2a1a3a 0%, #160a1a 50%, #050c08 100%)',
    cardBg: 'linear-gradient(160deg,#2a1a3a,#160a1a)',
    accent: '#c07cff',
    color: '#2a1a3a',
    genres: ['Action', 'Adventure', 'Comedy'],
    rating: 6.1,
  },
  {
    id: 3,
    title: 'The Vietnam War',
    type: 'TV Series • Documentary',
    date: '2017-09-17',
    desc: 'An immersive 10-part documentary series that examines the Vietnam War through testimonials from all sides of the conflict.',
    bg: 'radial-gradient(ellipse at 80% 30%, #1a2a0a 0%, #0a160a 50%, #050c08 100%)',
    cardBg: 'linear-gradient(160deg,#1a2a0a,#0a160a)',
    accent: '#7aff5c',
    color: '#1a2a0a',
    genres: ['Documentary', 'History', 'War'],
    rating: 9.1,
  },
  {
    id: 4,
    title: 'The Traitors',
    type: 'TV Series • Reality',
    date: '2022-11-14',
    desc: 'A group of players must work together to complete missions while trying to identify who among them are the Traitors sabotaging the game.',
    bg: 'radial-gradient(ellipse at 80% 30%, #2a1a0a 0%, #160e0a 50%, #050c08 100%)',
    cardBg: 'linear-gradient(160deg,#2a1a0a,#160e0a)',
    accent: '#ffa600',
    color: '#2a1a0a',
    genres: ['Game Show', 'Reality TV'],
    rating: 7.7,
  },
  {
    id: 5,
    title: 'The Cape',
    type: 'TV Series • Action',
    date: '2011-01-09',
    desc: 'A framed cop fakes his death, takes the identity of his son\'s favorite comic book hero, and fights crime while trying to clear his name.',
    bg: 'radial-gradient(ellipse at 80% 30%, #1a0a0a 0%, #160a0a 50%, #050c08 100%)',
    cardBg: 'linear-gradient(160deg,#3a0a0a,#160a0a)',
    accent: '#ff6b6b',
    color: '#3a0a0a',
    genres: ['Action', 'Crime', 'Drama'],
    rating: 6.3,
  },
]

const currentSlide = ref(0)
const slideInterval = 5000
const progressWidth = ref(0)
let autoTimer: ReturnType<typeof setInterval> | null = null
let progressTimer: ReturnType<typeof setInterval> | null = null

function goToSlide(i: number) {
  currentSlide.value = i
  resetProgress()
}

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.length
  resetProgress()
}

function resetProgress() {
  progressWidth.value = 0
  if (progressTimer) clearInterval(progressTimer)
  // Animate from 0 to 100 over slideInterval
  const step = 100 / (slideInterval / 50)
  progressTimer = setInterval(() => {
    progressWidth.value = Math.min(progressWidth.value + step, 100)
  }, 50)
}

onMounted(() => {
  resetProgress()
  autoTimer = setInterval(nextSlide, slideInterval)
})
onUnmounted(() => {
  if (autoTimer) clearInterval(autoTimer)
  if (progressTimer) clearInterval(progressTimer)
})

// FAQ
const openFaq = ref<number | null>(null)
function toggleFaq(i: number) { openFaq.value = openFaq.value === i ? null : i }

const faqs = [
  { q: 'How does OmniSave work as a video downloader?', a: 'OmniSave uses a search-first workflow:\n1. Enter the title you want in the search bar\n2. Open the matching movie, TV show, or anime result\n3. Choose the available video quality and subtitle option if provided\n4. Start the download and save the files for offline viewing' },
  { q: 'Can I download videos with subtitles?', a: 'Yes, supported results can include subtitle files in addition to the video file. When subtitles are available, choose the language you want and download the subtitle file separately from the video.' },
  { q: 'What video qualities are available?', a: 'OmniSave currently focuses on practical MP4 download options such as 480P, 720P, and 1080P when the source provides them. Available quality levels can vary by title and source.' },
  { q: 'Do I need to paste a video link?', a: 'No. The current OmniSave experience is optimized for searching by title instead of pasting a direct URL. You can find the video resource you want from search results and then open its download options.' },
  { q: 'Is OmniSave free to use?', a: 'Yes. OmniSave is a free online video downloader and does not require extra software for the web experience. Availability of files, subtitles, and quality options depends on the source attached to each result.' },
]
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
