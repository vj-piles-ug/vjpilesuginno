<template>
  <div class="poster-card" @click="$emit('click')">
    <!-- Poster art -->
    <div class="poster-art" :style="posterStyle">
      <div class="shimmer-layer"></div>
      <div class="gloss-streak"></div>

      <!-- Top badge -->
      <div class="poster-top">
        <span class="poster-badge" :class="typeBadgeClass">{{ shortType }}</span>
        <span v-if="movie.rating >= 8.5" class="poster-badge badge-hot">HOT</span>
      </div>

      <!-- Bottom rating -->
      <div class="poster-bottom">
        <div class="poster-rating">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="#ffc107"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span>{{ movie.rating }}</span>
        </div>
      </div>
    </div>

    <!-- Info + Download below poster -->
    <div class="poster-info">
      <p class="poster-title">{{ movie.title }}</p>
      <p class="poster-type">{{ movie.type }}</p>
      <button class="poster-dl-btn">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        DOWNLOAD
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Movie } from '../data/movies'

const props = defineProps<{ movie: Movie }>()
defineEmits(['click'])

const liquidPalettes = [
  'linear-gradient(160deg, #ff0080 0%, #7928ca 40%, #1a0038 100%)',
  'linear-gradient(160deg, #00d4ff 0%, #0070f3 40%, #001a3a 100%)',
  'linear-gradient(160deg, #ff6b00 0%, #d90429 40%, #2d0010 100%)',
  'linear-gradient(160deg, #00ff9d 0%, #00b4d8 40%, #001a2c 100%)',
  'linear-gradient(160deg, #ffd700 0%, #ff6b35 40%, #1a0a00 100%)',
  'linear-gradient(160deg, #a855f7 0%, #ec4899 40%, #1a0026 100%)',
  'linear-gradient(160deg, #06d6a0 0%, #118ab2 40%, #001a2c 100%)',
  'linear-gradient(160deg, #f72585 0%, #7209b7 40%, #1a0030 100%)',
  'linear-gradient(160deg, #fb5607 0%, #ffbe0b 40%, #1a0a00 100%)',
  'linear-gradient(160deg, #3a86ff 0%, #8338ec 40%, #0a0020 100%)',
  'linear-gradient(160deg, #00f5d4 0%, #00bbf9 40%, #001520 100%)',
  'linear-gradient(160deg, #ff4d6d 0%, #c77dff 40%, #1a0030 100%)',
]

const posterStyle = computed(() => ({
  background: liquidPalettes[props.movie.id % liquidPalettes.length]
}))

const typeBadgeClass = computed(() => {
  if (props.movie.type === 'MOVIES') return 'badge-movie'
  if (props.movie.type === 'TV SERIES') return 'badge-series'
  return 'badge-anim'
})

const shortType = computed(() => {
  if (props.movie.type === 'MOVIES') return 'Movie'
  if (props.movie.type === 'TV SERIES') return 'Series'
  return 'Anime'
})
</script>

<style scoped>
.poster-card {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.poster-art {
  position: relative;
  aspect-ratio: 2 / 3;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.poster-card:hover .poster-art {
  transform: scale(1.03) translateY(-2px);
  box-shadow: 0 14px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.12);
}

.shimmer-layer {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.08) 70%, rgba(255,255,255,0) 100%);
  background-size: 200% 200%;
  animation: shimmer-move 3.5s ease-in-out infinite;
}
@keyframes shimmer-move {
  0%   { background-position: 0% 0%; }
  50%  { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}

.gloss-streak {
  position: absolute; top: -35%; left: -25%; width: 65%; height: 65%;
  background: radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%);
  border-radius: 50%; transform: rotate(-30deg); pointer-events: none;
}

.poster-top {
  position: absolute; top: 6px; left: 6px; right: 6px;
  display: flex; align-items: center; gap: 3px; flex-wrap: wrap;
}
.poster-badge {
  font-size: 0.55rem; font-weight: 800; letter-spacing: 0.06em;
  padding: 2px 6px; border-radius: 3px; text-transform: uppercase; line-height: 1.4;
}
.badge-movie   { background: rgba(0,0,0,0.6); color: #00ff9d; border: 1px solid rgba(0,255,157,0.3); }
.badge-series  { background: rgba(0,0,0,0.6); color: #ffa600; border: 1px solid rgba(255,166,0,0.3); }
.badge-anim    { background: rgba(0,0,0,0.6); color: #d08aff; border: 1px solid rgba(208,138,255,0.3); }
.badge-hot     { background: rgba(220,38,38,0.85); color: #fff; border: 1px solid rgba(255,80,80,0.3); }

.poster-bottom {
  position: absolute; bottom: 0; left: 0; right: 0;
  padding: 18px 7px 6px;
  background: linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 100%);
}
.poster-rating { display: inline-flex; align-items: center; gap: 3px; font-size: 0.62rem; font-weight: 700; color: #fff; }

/* Info below poster */
.poster-info { padding: 0 1px; display: flex; flex-direction: column; gap: 2px; }
.poster-title { font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.88); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.25; }
.poster-type { font-size: 0.6rem; color: rgba(255,255,255,0.36); font-weight: 500; margin-bottom: 3px; }

.poster-dl-btn {
  width: 100%;
  padding: 6px 0;
  border-radius: 7px;
  border: none;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-shadow: 0 4px 14px rgba(0,255,157,0.22);
  transition: filter 0.15s, opacity 0.15s;
}
.poster-dl-btn:hover {
  filter: brightness(1.07);
}
</style>
