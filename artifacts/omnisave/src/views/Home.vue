<template>
  <div class="min-h-screen" style="background-color: #0d1117; color: #e6edf3; font-family: 'Inter', sans-serif;">
    <!-- Header -->
    <header class="header sticky top-0 z-50" style="background-color: #0d1117; border-bottom: 1px solid #21262d;">
      <div class="header-inner" style="max-width: 1280px; margin: 0 auto; padding: 0 16px; display: flex; align-items: center; height: 56px; gap: 12px;">
        <!-- Logo -->
        <div class="logo" style="display: flex; align-items: center; gap: 8px; flex-shrink: 0; margin-right: 8px;">
          <div style="width: 28px; height: 28px; background: linear-gradient(135deg, #00e5cc, #0099ff); border-radius: 6px; display: flex; align-items: center; justify-content: center;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </div>
          <span style="font-weight: 700; font-size: 15px; color: #e6edf3; white-space: nowrap;">OmniSave</span>
        </div>

        <!-- Nav pills -->
        <nav class="nav-pills" style="display: flex; align-items: center; gap: 6px; flex-shrink: 0;">
          <button
            v-for="pill in navPills"
            :key="pill"
            @click="activeNav = pill"
            :style="{
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500',
              border: '1px solid',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: activeNav === pill ? 'rgba(0,229,204,0.12)' : 'transparent',
              borderColor: activeNav === pill ? '#00e5cc' : '#30363d',
              color: activeNav === pill ? '#00e5cc' : '#8b949e',
              whiteSpace: 'nowrap'
            }"
          >{{ pill }}</button>
        </nav>

        <div style="flex: 1;" />

        <!-- Downloaders badge -->
        <div style="display: flex; align-items: center; gap: 6px; padding: '4px 10px'; background: rgba(255,255,255,0.05); border-radius: 20px; border: 1px solid #30363d; padding: 4px 10px; flex-shrink: 0;">
          <span style="font-size: 11px; color: #8b949e; white-space: nowrap;">Downloaders</span>
          <div style="display: flex; gap: -4px;">
            <div v-for="i in 4" :key="i" :style="{ width: '18px', height: '18px', borderRadius: '50%', background: `hsl(${i * 60}, 70%, 50%)`, border: '2px solid #0d1117', marginLeft: i > 1 ? '-6px' : '0' }" />
          </div>
        </div>

        <!-- App button -->
        <button style="padding: 6px 14px; background: #00e5cc; color: #0d1117; border: none; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; flex-shrink: 0; white-space: nowrap;">
          App
        </button>

        <!-- Globe & Lang -->
        <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
          <button style="background: transparent; border: none; cursor: pointer; color: #8b949e;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          </button>
          <button style="background: transparent; border: 1px solid #30363d; border-radius: 4px; cursor: pointer; color: #8b949e; padding: 3px 8px; font-size: 12px; display: flex; align-items: center; gap: 4px;">
            EN
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section style="text-align: center; padding: 48px 16px 32px;">
      <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 12px;">
        <span style="font-size: 11px; color: #00e5cc; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">OMNISAVE</span>
        <span style="color: #30363d;">•</span>
        <span style="font-size: 11px; color: #8b949e; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">HD MP4</span>
        <span style="color: #30363d;">•</span>
        <span style="font-size: 11px; color: #8b949e; font-weight: 500; letter-spacing: 1px; text-transform: uppercase;">Subtitles</span>
      </div>
      <h1 style="font-size: clamp(24px, 4vw, 40px); font-weight: 700; color: #e6edf3; line-height: 1.2; margin-bottom: 12px;">
        Free Online Video Downloader
      </h1>
      <p style="font-size: 13px; color: #8b949e; max-width: 480px; margin: 0 auto;">
        Search movies, TV shows, and anime by title, then download HD MP4 videos with subtitle options.
      </p>
    </section>

    <!-- Search Bar -->
    <section style="max-width: 720px; margin: 0 auto; padding: 0 16px 40px;">
      <div style="display: flex; align-items: center; background: #161b22; border: 1px solid #30363d; border-radius: 8px; overflow: hidden; transition: border-color 0.2s;"
           :style="{ borderColor: searchFocused ? '#00e5cc' : '#30363d' }">
        <div style="padding: 0 14px; color: #8b949e;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <input
          v-model="query"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="The Expendables 2"
          style="flex: 1; background: transparent; border: none; outline: none; color: #e6edf3; font-size: 14px; padding: 13px 8px;"
        />
        <button
          @click="handleSearch"
          style="padding: 13px 28px; background: #00e5cc; color: #0d1117; border: none; font-size: 14px; font-weight: 600; cursor: pointer; white-space: nowrap; transition: background 0.15s;"
          @mouseenter="(e) => (e.target as HTMLElement).style.background = '#00c4b0'"
          @mouseleave="(e) => (e.target as HTMLElement).style.background = '#00e5cc'"
        >
          Search
        </button>
      </div>
    </section>

    <!-- Results Section -->
    <section style="max-width: 1280px; margin: 0 auto; padding: 0 16px 48px;">
      <!-- Result header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <span style="font-size: 11px; font-weight: 600; color: #8b949e; letter-spacing: 1px; text-transform: uppercase;">
          MATCHING VIDEOS
        </span>
        <span style="font-size: 12px; color: #8b949e;" v-if="searchTerm">
          Found {{ filteredMovies.length }} matching video resources
        </span>
      </div>

      <!-- Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px;">
        <div
          v-for="movie in filteredMovies"
          :key="movie.id"
          class="movie-card"
          style="background: #161b22; border-radius: 8px; overflow: hidden; cursor: pointer; transition: transform 0.15s, box-shadow 0.15s; border: 1px solid #21262d;"
          @mouseenter="hoveredId = movie.id"
          @mouseleave="hoveredId = null"
          :style="hoveredId === movie.id ? { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', borderColor: '#30363d' } : {}"
        >
          <!-- Poster -->
          <div style="position: relative; aspect-ratio: 2/3; overflow: hidden; background: #1c2128;">
            <div
              :style="{
                width: '100%',
                height: '100%',
                background: `linear-gradient(160deg, ${movie.color} 0%, #0d1117 100%)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                textAlign: 'center',
                gap: '8px'
              }"
            >
              <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(0,229,204,0.15); display: flex; align-items: center; justify-content: center; border: 1px solid rgba(0,229,204,0.25);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(0,229,204,0.7)"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <span style="font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.5); line-height: 1.3;">{{ movie.title }}</span>
            </div>
            <!-- Type badge -->
            <div style="position: absolute; top: 8px; left: 8px;">
              <span :style="{
                fontSize: '9px',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '3px',
                letterSpacing: '0.5px',
                background: movie.type === 'MOVIES' ? 'rgba(0,229,204,0.15)' : 'rgba(255,166,0,0.15)',
                color: movie.type === 'MOVIES' ? '#00e5cc' : '#ffa600',
                border: `1px solid ${movie.type === 'MOVIES' ? 'rgba(0,229,204,0.3)' : 'rgba(255,166,0,0.3)'}`,
              }">{{ movie.type }}</span>
            </div>
            <!-- Rating badge -->
            <div style="position: absolute; top: 8px; right: 8px; display: flex; align-items: center; gap: 3px; background: rgba(13,17,23,0.85); border-radius: 4px; padding: 3px 6px;">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffa600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style="font-size: 10px; font-weight: 600; color: #e6edf3;">{{ movie.rating }}</span>
            </div>
          </div>

          <!-- Info -->
          <div style="padding: 10px;">
            <div style="font-size: 13px; font-weight: 600; color: #e6edf3; margin-bottom: 4px; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              {{ movie.title }}
            </div>
            <div style="font-size: 11px; color: #8b949e; margin-bottom: 8px;">{{ movie.date }}</div>

            <!-- Genre tags -->
            <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;">
              <span
                v-for="genre in movie.genres.slice(0, 3)"
                :key="genre"
                style="font-size: 10px; padding: 2px 6px; border-radius: 3px; background: rgba(48,54,61,0.7); color: #8b949e; border: 1px solid #30363d;"
              >{{ genre }}</span>
            </div>

            <!-- Download button -->
            <button
              @click.stop="handleDownload(movie)"
              style="width: 100%; padding: 7px 0; background: transparent; border: 1px solid #00e5cc; border-radius: 5px; color: #00e5cc; font-size: 11px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s;"
              @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,204,0.1)' }"
              @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="searchTerm && filteredMovies.length === 0" style="text-align: center; padding: 64px 16px;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#30363d" stroke-width="1.5" style="margin: 0 auto 16px;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <p style="color: #8b949e; font-size: 14px;">No results found for "{{ searchTerm }}"</p>
        <p style="color: #30363d; font-size: 12px; margin-top: 6px;">Try a different search term</p>
      </div>
    </section>

    <!-- Download modal -->
    <div
      v-if="downloadTarget"
      style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px;"
      @click.self="downloadTarget = null"
    >
      <div style="background: #161b22; border: 1px solid #30363d; border-radius: 12px; padding: 28px; max-width: 400px; width: 100%;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
          <img :src="downloadTarget.poster" style="width: 48px; height: 72px; object-fit: cover; border-radius: 4px;" />
          <div>
            <div style="font-size: 15px; font-weight: 700; color: #e6edf3; margin-bottom: 4px;">{{ downloadTarget.title }}</div>
            <div style="font-size: 12px; color: #8b949e;">{{ downloadTarget.date }}</div>
          </div>
        </div>
        <p style="font-size: 13px; color: #8b949e; margin-bottom: 20px;">Select quality and format to download:</p>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
          <button
            v-for="opt in downloadOptions"
            :key="opt.label"
            style="padding: 10px 16px; background: rgba(0,229,204,0.08); border: 1px solid rgba(0,229,204,0.25); border-radius: 6px; color: #00e5cc; font-size: 13px; font-weight: 500; cursor: pointer; text-align: left; transition: all 0.15s; display: flex; align-items: center; justify-content: space-between;"
            @mouseenter="(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,204,0.15)' }"
            @mouseleave="(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,229,204,0.08)' }"
            @click="downloadTarget = null"
          >
            <span>{{ opt.label }}</span>
            <span style="font-size: 11px; color: #8b949e;">{{ opt.size }}</span>
          </button>
        </div>
        <button @click="downloadTarget = null" style="width: 100%; padding: 10px; background: transparent; border: 1px solid #30363d; border-radius: 6px; color: #8b949e; font-size: 13px; cursor: pointer;">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { allMovies, type Movie } from '../data/movies'

const navPills = ['Search', 'Pick quality', 'Download']
const activeNav = ref('Search')

const query = ref('The Expendables')
const searchTerm = ref('The Expendables')
const searchFocused = ref(false)
const hoveredId = ref<number | null>(null)
const downloadTarget = ref<Movie | null>(null)

const downloadOptions = [
  { label: '1080p Full HD — MP4', size: '~2.1 GB' },
  { label: '720p HD — MP4', size: '~900 MB' },
  { label: '480p SD — MP4', size: '~420 MB' },
  { label: '360p — MP4', size: '~210 MB' },
]

const filteredMovies = computed(() => {
  if (!searchTerm.value.trim()) return allMovies
  const q = searchTerm.value.toLowerCase()
  return allMovies.filter(m => m.title.toLowerCase().includes(q))
})

function handleSearch() {
  searchTerm.value = query.value
}

function handleDownload(movie: Movie) {
  downloadTarget.value = movie
}

</script>
