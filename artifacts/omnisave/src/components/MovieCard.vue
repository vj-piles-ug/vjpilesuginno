<template>
  <div class="card-root">
    <!-- Poster -->
    <div class="card-poster" :style="{ background: `linear-gradient(160deg, ${movie.color} 0%, #050c08 100%)` }">
      <div class="card-play-wrap">
        <div class="card-play-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(0,255,157,0.9)"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <span class="card-play-title">{{ movie.title }}</span>
      </div>

      <!-- Type badge -->
      <span class="card-type-badge" :class="typeBadgeClass">{{ movie.type }}</span>

      <!-- Rating -->
      <div class="card-rating">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="#ffa600"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span>{{ movie.rating }}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <p class="card-title">{{ movie.title }}</p>
      <p class="card-date">{{ movie.date }}</p>
      <div class="card-genres">
        <span v-for="g in movie.genres.slice(0, 2)" :key="g" class="card-genre">{{ g }}</span>
      </div>
      <button class="card-dl-btn">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        DOWNLOAD
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Movie } from '../data/movies'

const props = defineProps<{ movie: Movie }>()

const typeBadgeClass = computed(() => {
  if (props.movie.type === 'MOVIES') return 'badge-movie'
  if (props.movie.type === 'TV SERIES') return 'badge-series'
  return 'badge-animation'
})
</script>

<style scoped>
.card-root {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.card-root:hover {
  transform: translateY(-4px);
  border-color: rgba(0,255,157,0.22);
  box-shadow: 0 16px 40px rgba(0,0,0,0.55);
}

/* Poster */
.card-poster {
  position: relative;
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-play-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 12px;
  text-align: center;
}
.card-play-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(0,255,157,0.25);
  background: rgba(0,255,157,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-play-title {
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(255,255,255,0.35);
  line-height: 1.3;
}

/* Type badge */
.card-type-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 3px 7px;
  border-radius: 5px;
  text-transform: uppercase;
}
.badge-movie    { background: rgba(0,255,157,0.14); color: #00ff9d; border: 1px solid rgba(0,255,157,0.28); }
.badge-series   { background: rgba(255,166,0,0.14);  color: #ffa600; border: 1px solid rgba(255,166,0,0.28); }
.badge-animation { background: rgba(255,107,222,0.14); color: #ff6bde; border: 1px solid rgba(255,107,222,0.28); }

/* Rating */
.card-rating {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(5,12,8,0.85);
  border-radius: 6px;
  padding: 3px 6px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #fff;
}

/* Body */
.card-body { padding: 12px; }
.card-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 3px;
}
.card-date { font-size: 0.68rem; color: rgba(255,255,255,0.35); margin-bottom: 8px; }
.card-genres { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
.card-genre {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.09);
  color: rgba(255,255,255,0.45);
}
.card-dl-btn {
  width: 100%;
  padding: 8px 0;
  background: rgba(0,255,157,0.07);
  border: 1px solid rgba(0,255,157,0.2);
  border-radius: 9px;
  color: #00ff9d;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.15s, border-color 0.15s;
}
.card-dl-btn:hover {
  background: rgba(0,255,157,0.14);
  border-color: rgba(0,255,157,0.35);
}
</style>
