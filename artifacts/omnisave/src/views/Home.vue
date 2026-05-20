<template>
  <div class="min-h-screen flex flex-col">

    <!-- ===== HEADER ===== -->
    <header class="sticky top-0 z-50">
      <div class="relative border-b border-white/[0.06] bg-black/20 backdrop-blur-2xl">
        <div class="pointer-events-none absolute inset-0 overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)]"></div>
        </div>
        <div class="mx-auto flex w-full max-w-[1380px] flex-wrap items-center justify-between gap-2 px-4 py-2 sm:flex-nowrap sm:gap-4 sm:py-3 md:px-6 xl:px-8">
          <!-- Left: Logo + Steps -->
          <div class="flex min-w-0 items-center gap-3 sm:gap-4 lg:gap-5">
            <a class="group inline-flex items-center gap-2.5" href="#">
              <!-- Logo icon -->
              <div class="block h-9 w-9 rounded-xl overflow-hidden flex-shrink-0" style="background: linear-gradient(135deg,#00ff9d,#00c8b8,#00d4ff);">
                <div class="w-full h-full flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <span class="hidden text-lg font-semibold tracking-[0.01em] text-white sm:inline md:text-xl">OmniSave</span>
            </a>
            <!-- Step pills -->
            <div class="hidden items-center gap-2 xl:flex">
              <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
                <span class="rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5 font-mono text-[0.66rem] font-semibold tracking-[0.12em] text-white/70">01</span>
                <span class="text-[0.86rem] font-medium text-white/80">Search</span>
                <svg class="ml-0.5 h-3.5 w-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
                <span class="rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5 font-mono text-[0.66rem] font-semibold tracking-[0.12em] text-white/70">02</span>
                <span class="text-[0.86rem] font-medium text-white/80">Pick quality</span>
                <svg class="ml-0.5 h-3.5 w-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
              </span>
              <span class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5">
                <span class="rounded-full border border-white/12 bg-white/[0.06] px-2 py-0.5 font-mono text-[0.66rem] font-semibold tracking-[0.12em] text-white/70">03</span>
                <span class="text-[0.86rem] font-medium text-white/80">Download</span>
              </span>
            </div>
          </div>

          <!-- Right: Actions -->
          <div class="flex items-center gap-2 sm:gap-2.5">
            <!-- Downloaders button -->
            <button class="button-secondary flex items-center gap-2 px-3 py-2 text-[13px] sm:px-4 sm:py-2.5">
              <span class="hidden sm:inline text-white/80">Downloaders</span>
              <span class="flex items-center gap-1.5">
                <!-- YouTube -->
                <svg class="h-3.5 w-3.5 opacity-60" viewBox="0 0 24 24" fill="#ff4444"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <!-- Facebook -->
                <span class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-[#1877f2] text-[0.45rem] font-bold text-white opacity-60">f</span>
                <!-- Instagram -->
                <span class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 text-[0.42rem] font-bold text-white opacity-60">IG</span>
                <!-- TikTok -->
                <span class="inline-flex h-3.5 w-3.5 items-center justify-center rounded bg-[#ff2442] text-[0.4rem] font-bold text-white opacity-60">TT</span>
              </span>
              <svg class="h-3.5 w-3.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>

            <!-- App button -->
            <button class="button-primary px-3 py-2 text-[13px] sm:px-4 sm:py-2.5">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              <span class="hidden sm:inline">App</span>
            </button>

            <!-- Google sign-in -->
            <button title="Sign in with Google" class="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:border-white/20 hover:bg-white/[0.09]">
              <svg class="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>

            <div class="hidden h-8 w-px bg-white/10 md:block"></div>

            <!-- Language -->
            <button class="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-2.5 py-2 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.08] sm:px-3">
              <svg class="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
              <span class="hidden sm:inline">EN</span>
              <svg class="hidden h-3 w-3 text-white/55 sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== MAIN ===== -->
    <div class="flex-1">
      <main class="relative overflow-hidden">
        <!-- Radial gradient background glow -->
        <div class="pointer-events-none absolute inset-x-0 top-0 h-[38rem]" style="background: radial-gradient(circle at top, rgba(0,255,157,0.16), transparent 42%), radial-gradient(circle at top right, rgba(0,212,255,0.16), transparent 28%);"></div>

        <div class="relative mx-auto w-full max-w-[1380px] px-4 pb-12 pt-4 md:px-6 md:pb-16 md:pt-6 xl:px-8">

          <!-- Hero section -->
          <section class="mb-8 pt-6 text-center md:mb-10 md:pt-10">
            <div class="mb-4 flex items-center justify-center gap-2">
              <span class="glass-chip" style="letter-spacing:0.2em; text-transform:uppercase;">OmniSave</span>
              <span class="glass-chip">HD MP4</span>
              <span class="glass-chip">Subtitles</span>
            </div>
            <h1 class="text-balance text-2xl font-semibold leading-[1.08] text-white md:text-3xl lg:text-[3rem] xl:text-[3.35rem]">Free Online Video Downloader</h1>
            <p class="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/60 md:text-base">Search movies, TV shows, and anime by title, then download HD MP4 videos with subtitle options.</p>
          </section>

          <!-- Search bar -->
          <section class="relative z-40 mb-6 md:mb-10">
            <form class="mx-auto w-full max-w-[1120px]" @submit.prevent="handleSearch">
              <div class="relative">
                <div class="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-white/50">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input
                  v-model="query"
                  type="text"
                  placeholder="Search video, movie, TV show, or anime title..."
                  class="input-shell w-full py-4 text-sm font-medium text-white placeholder:text-white/44 focus:outline-none md:py-5 md:text-base"
                  style="padding-left:56px; padding-right:140px;"
                  autocomplete="off"
                />
                <button
                  type="submit"
                  class="absolute right-2.5 top-1/2 z-10 -translate-y-1/2 flex min-w-[100px] items-center justify-center rounded-[20px] border border-white/10 px-4 py-2 text-xs font-semibold text-[#021a10] md:min-w-[112px] md:px-5 md:py-2.5 md:text-sm"
                  style="background: linear-gradient(135deg,#00ff9d 0%,#00c8b8 48%,#00d4ff 100%); box-shadow: 0 14px 34px rgba(0,255,157,0.22);"
                >Search</button>
              </div>
            </form>
          </section>

          <!-- Results or Carousel -->
          <div class="mb-8 md:mb-10">

            <!-- When search is active and has results -->
            <template v-if="searchTerm && filteredMovies.length > 0">
              <div class="mb-4 flex items-center justify-between">
                <span class="section-kicker">Matching Videos</span>
                <span class="text-xs text-white/40">Found {{ filteredMovies.length }} matching video resources</span>
              </div>
              <div class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));">
                <div
                  v-for="movie in filteredMovies"
                  :key="movie.id"
                  class="movie-card cursor-pointer"
                  @click="openDownload(movie)"
                >
                  <MovieCard :movie="movie" />
                </div>
              </div>
            </template>

            <!-- When search returns no results -->
            <template v-else-if="searchTerm && filteredMovies.length === 0">
              <section class="w-full py-12 text-center md:py-16">
                <div class="mb-5">
                  <svg class="mx-auto h-20 w-20 text-white/18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <p class="section-kicker mb-3">Search</p>
                <h3 class="mb-3 text-xl font-semibold text-white md:text-2xl">No results found</h3>
                <p class="mb-2 text-sm text-white/68 md:text-base">Try using other keywords</p>
              </section>
            </template>

            <!-- Default state: auto-sliding carousel -->
            <template v-else>
              <div class="mb-6">
                <p class="section-kicker mb-1">Trending Now</p>
                <h2 class="text-lg font-semibold text-white md:text-xl">Popular Movies &amp; Series</h2>
              </div>

              <!-- Row 1: slides left -->
              <div class="relative mb-4 overflow-hidden" style="mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);">
                <div class="marquee-track">
                  <div v-for="movie in doubledMovies" :key="`r1-${movie.uid}`" class="movie-card mx-2 cursor-pointer" style="width:170px;" @click="openDownload(movie)">
                    <MovieCard :movie="movie" />
                  </div>
                </div>
              </div>

              <!-- Row 2: slides right -->
              <div class="relative overflow-hidden" style="mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent); -webkit-mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);">
                <div class="marquee-track-rev">
                  <div v-for="movie in doubledMoviesRev" :key="`r2-${movie.uid}`" class="movie-card mx-2 cursor-pointer" style="width:170px;" @click="openDownload(movie)">
                    <MovieCard :movie="movie" />
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- FAQ -->
          <section class="mt-10 w-full md:mt-12">
            <div class="soft-divider mb-8 md:mb-10"></div>
            <div class="mb-6 md:mb-8">
              <h2 class="text-xl font-semibold text-white md:text-2xl">Frequently Asked Questions</h2>
            </div>
            <div class="space-y-3 md:space-y-4">
              <div
                v-for="(faq, i) in faqs"
                :key="i"
                class="faq-item"
              >
                <button
                  class="relative flex w-full items-start justify-between gap-3 px-5 py-4 text-left md:px-6 md:py-5"
                  @click="toggleFaq(i)"
                >
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
    <footer class="relative mt-10 border-t border-white/[0.06] pb-7 pt-10 md:mt-12 md:pb-9 md:pt-12">
      <div class="mx-auto w-full max-w-[1380px] px-4 md:px-6 xl:px-8">
        <div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2.5">
              <div class="h-8 w-8 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg,#00ff9d,#00c8b8,#00d4ff);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span class="text-base font-semibold text-white">OmniSave</span>
            </div>
            <p class="max-w-xs text-sm text-white/45">Free online video downloader. Search, pick quality, and download.</p>
          </div>
          <div class="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/50">
            <a href="#" class="hover:text-white/80 transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-white/80 transition-colors">Terms of Service</a>
            <a href="#" class="hover:text-white/80 transition-colors">Contact</a>
          </div>
        </div>
        <div class="soft-divider my-7"></div>
        <p class="text-center text-xs text-white/30">&copy; {{ new Date().getFullYear() }} OmniSave. All rights reserved.</p>
      </div>
    </footer>

    <!-- ===== DOWNLOAD MODAL ===== -->
    <div
      v-if="downloadTarget"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style="background: rgba(0,0,0,0.75); backdrop-filter: blur(8px);"
      @click.self="downloadTarget = null"
    >
      <div class="w-full max-w-sm rounded-3xl border border-white/10 p-6" style="background: rgba(10,18,12,0.95);">
        <div class="mb-5 flex items-start gap-4">
          <!-- poster placeholder -->
          <div class="h-[72px] w-12 flex-shrink-0 rounded-lg flex items-center justify-center" :style="{ background: `linear-gradient(160deg, ${downloadTarget.color}, #050c08)` }">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(0,255,157,0.6)"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <div>
            <p class="font-semibold text-white">{{ downloadTarget.title }}</p>
            <p class="text-xs text-white/45 mt-0.5">{{ downloadTarget.date }}</p>
            <div class="mt-1.5 flex flex-wrap gap-1">
              <span v-for="g in downloadTarget.genres.slice(0,3)" :key="g" class="text-[10px] rounded px-1.5 py-0.5 text-white/50" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);">{{ g }}</span>
            </div>
          </div>
        </div>
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">Select quality</p>
        <div class="space-y-2 mb-4">
          <button
            v-for="opt in downloadOptions"
            :key="opt.label"
            class="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left transition-all hover:border-white/20 hover:bg-white/[0.07]"
            @click="downloadTarget = null"
          >
            <span class="text-sm font-medium text-white">{{ opt.label }}</span>
            <span class="text-xs text-white/40">{{ opt.size }}</span>
          </button>
        </div>
        <button @click="downloadTarget = null" class="w-full rounded-2xl border border-white/10 bg-transparent py-2.5 text-sm text-white/50 hover:text-white/70 transition-colors">Cancel</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import { allMovies, type Movie } from '../data/movies'

const query = ref('')
const searchTerm = ref('')
const downloadTarget = ref<Movie | null>(null)
const openFaq = ref<number | null>(null)

// Search
function handleSearch() {
  searchTerm.value = query.value.trim()
}
const filteredMovies = computed(() => {
  if (!searchTerm.value) return []
  const q = searchTerm.value.toLowerCase()
  return allMovies.filter(m => m.title.toLowerCase().includes(q))
})

// Carousel: duplicate movies for seamless infinite loop, attach unique uid
const doubledMovies = computed(() =>
  [...allMovies, ...allMovies].map((m, i) => ({ ...m, uid: `${m.id}-${i}` }))
)
const doubledMoviesRev = computed(() => {
  const rev = [...allMovies].reverse()
  return [...rev, ...rev].map((m, i) => ({ ...m, uid: `rev-${m.id}-${i}` }))
})

function openDownload(movie: Movie) {
  downloadTarget.value = movie
}

// FAQ
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

const downloadOptions = [
  { label: '1080p Full HD — MP4', size: '~2.1 GB' },
  { label: '720p HD — MP4', size: '~900 MB' },
  { label: '480p SD — MP4', size: '~420 MB' },
  { label: '360p — MP4', size: '~210 MB' },
]

const faqs = [
  {
    q: 'How does OmniSave work as a video downloader?',
    a: `OmniSave uses a search-first workflow:\n1. Enter the title you want in the search bar\n2. Open the matching movie, TV show, or anime result\n3. Choose the available video quality and subtitle option if provided\n4. Start the download and save the files for offline viewing`,
  },
  {
    q: 'Can I download videos with subtitles?',
    a: 'Yes, supported results can include subtitle files in addition to the video file. When subtitles are available, choose the language you want and download the subtitle file separately from the video.',
  },
  {
    q: 'What video qualities are available?',
    a: 'OmniSave currently focuses on practical MP4 download options such as 480P, 720P, and 1080P when the source provides them. Available quality levels can vary by title and source.',
  },
  {
    q: 'Do I need to paste a video link?',
    a: 'No. The current OmniSave experience is optimized for searching by title instead of pasting a direct URL. You can find the video resource you want from search results and then open its download options.',
  },
  {
    q: 'What kind of content can I search for right now?',
    a: 'The current site experience is centered on searchable video resources for movies, TV shows, and anime. More source types and platform-based download flows are part of the next development phase.',
  },
  {
    q: 'Where are downloaded files saved?',
    a: "Downloaded files usually go to your browser's default download folder unless you changed that setting. Video files and subtitle files are downloaded separately, so check your recent browser downloads if you do not see them immediately.",
  },
  {
    q: 'Is OmniSave free to use?',
    a: 'Yes. OmniSave is a free online video downloader and does not require extra software for the web experience. Availability of files, subtitles, and quality options depends on the source attached to each result.',
  },
]
</script>
