<template>
  <div>
    <!-- Poster area -->
    <div class="relative" style="aspect-ratio: 2/3; overflow: hidden;">
      <div
        class="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3 text-center"
        :style="{ background: `linear-gradient(160deg, ${movie.color} 0%, #050c08 100%)` }"
      >
        <div class="flex h-9 w-9 items-center justify-center rounded-full" style="background: rgba(0,255,157,0.12); border: 1px solid rgba(0,255,157,0.2);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(0,255,157,0.7)"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <span class="text-[10px] font-medium leading-tight text-white/40">{{ movie.title }}</span>
      </div>

      <!-- Type badge -->
      <div class="absolute left-2 top-2">
        <span
          class="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wide"
          :class="movie.type === 'MOVIES' ? 'badge-movie' : 'badge-series'"
        >{{ movie.type }}</span>
      </div>

      <!-- Rating badge -->
      <div class="absolute right-2 top-2 flex items-center gap-1 rounded-md px-1.5 py-0.5" style="background: rgba(5,12,8,0.82);">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#ffa600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span class="text-[10px] font-semibold text-white">{{ movie.rating }}</span>
      </div>
    </div>

    <!-- Card body -->
    <div class="p-2.5">
      <p class="mb-0.5 truncate text-[13px] font-semibold text-white">{{ movie.title }}</p>
      <p class="mb-2 text-[11px] text-white/40">{{ movie.date }}</p>
      <div class="mb-2.5 flex flex-wrap gap-1">
        <span
          v-for="genre in movie.genres.slice(0, 2)"
          :key="genre"
          class="rounded px-1.5 py-0.5 text-[10px] text-white/50"
          style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);"
        >{{ genre }}</span>
      </div>
      <button class="card-dl-btn">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Movie } from '../data/movies'
defineProps<{ movie: Movie }>()
</script>
