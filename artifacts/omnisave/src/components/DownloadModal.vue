<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="movie" class="modal-backdrop" @click.self="$emit('close')">
        <div class="modal-box">
          <div class="modal-header">
            <div class="modal-poster" :style="posterThumbStyle">
              <img v-if="movie.image" :src="movie.image" alt="" class="thumb-img" />
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="rgba(0,255,157,0.7)"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="modal-info">
              <p class="modal-title">{{ movie.title }}</p>
              <p class="modal-meta">{{ movie.date }} &nbsp;·&nbsp; ⭐ {{ movie.rating }}</p>
              <div class="modal-tags">
                <span v-for="g in (movie.genres || []).slice(0, 3)" :key="g" class="modal-tag">{{ g }}</span>
              </div>
            </div>
            <button class="modal-close" @click="$emit('close')">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- NOT LOGGED IN -->
          <template v-if="!isLoggedIn">
            <div class="gate-box">
              <div class="gate-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <p class="gate-title">Login Required</p>
              <p class="gate-desc">You need to be logged in to download content.</p>
              <button class="gate-btn gate-btn--primary" @click="openLogin">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                LOGIN TO DOWNLOAD
              </button>
            </div>
          </template>

          <!-- LOGGED IN BUT NO SUBSCRIPTION -->
          <template v-else-if="!isSubscribed">
            <div class="gate-box">
              <div class="gate-icon gate-icon--sub">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffa600" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p class="gate-title">Subscription Required</p>
              <p class="gate-desc">Subscribe to unlock HD downloads. Plans from 500 UGX/day.</p>
              <button class="gate-btn gate-btn--sub" @click="openSubscribe">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                Subscribe to Download
              </button>
            </div>
          </template>

          <!-- SUBSCRIBED OR ADMIN: show download -->
          <template v-else>
            <!-- MOVIE or ANIMATION: direct download -->
            <template v-if="movie.type === 'MOVIES' || movie.type === 'ANIMATION'">
              <p class="section-label">DOWNLOAD</p>
              <a
                v-if="movie.streamlink"
                :href="directLink(movie.streamlink)"
                target="_blank"
                rel="noopener noreferrer"
                class="big-dl-btn"
                @click="$emit('close')"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                DOWNLOAD MP4
              </a>
              <button v-else class="big-dl-btn big-dl-btn--disabled" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                NO DOWNLOAD LINK
              </button>
              <p class="dl-note">Available in HD · MP4 format</p>
            </template>

            <!-- TV SERIES: episode grid -->
            <template v-else>
              <p class="section-label">SELECT EPISODE</p>
              <div v-if="movie.episodes && movie.episodes.length > 0" class="episode-grid">
                <button
                  v-for="ep in movie.episodes"
                  :key="ep.episodeNumber"
                  class="ep-box"
                  :class="{ selected: selectedEpNum === ep.episodeNumber, 'ep-box--no-link': !ep.streamlink }"
                  @click="selectedEpNum = ep.episodeNumber"
                >{{ ep.episodeNumber }}</button>
              </div>
              <div v-else class="ep-empty">No episodes available yet.</div>

              <div v-if="selectedEpisode" class="ep-selected-info">
                <span class="ep-selected-label">EP {{ selectedEpisode.episodeNumber }}</span>
                <span class="ep-selected-title">{{ selectedEpisode.title }}</span>
              </div>

              <a
                v-if="selectedEpisode && selectedEpisode.streamlink"
                :href="directLink(selectedEpisode.streamlink)"
                target="_blank"
                rel="noopener noreferrer"
                class="big-dl-btn"
                @click="$emit('close')"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                DOWNLOAD EP {{ selectedEpisode.episodeNumber }}
              </a>
              <button v-else-if="selectedEpisode && !selectedEpisode.streamlink" class="big-dl-btn big-dl-btn--disabled" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                NO LINK FOR THIS EPISODE
              </button>
              <button v-else class="big-dl-btn big-dl-btn--disabled" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                SELECT AN EPISODE
              </button>
            </template>
          </template>

          <button class="modal-cancel" @click="$emit('close')">CANCEL</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Movie } from '../data/movies'
import { useAuth } from '../store/auth'
import { isSubscribed } from '../store/subscription'
import { loginOpen, subscribeOpen } from '../store/ui'
import { toDirectDownload } from '../lib/utils'

const props = defineProps<{ movie: Movie | null }>()
defineEmits(['close'])

const { isLoggedIn } = useAuth()

function openLogin() {
  loginOpen.value = true
}

function openSubscribe() {
  subscribeOpen.value = true
}

function directLink(url: string): string {
  return toDirectDownload(url)
}

const selectedEpNum = ref<number | null>(null)
watch(() => props.movie, () => { selectedEpNum.value = null })

const selectedEpisode = computed(() => {
  if (!props.movie?.episodes || selectedEpNum.value === null) return null
  return props.movie.episodes.find(ep => ep.episodeNumber === selectedEpNum.value) ?? null
})

const posterThumbStyle = computed(() => {
  if (!props.movie) return {}
  return { background: `linear-gradient(160deg, ${props.movie.color || '#0d2035'} 0%, #050c08 100%)` }
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 200;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.78); backdrop-filter: blur(14px);
}
.modal-box {
  width: 100%; max-width: 380px; border-radius: 22px;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(8,16,12,0.98);
  padding: 20px; box-shadow: 0 32px 70px rgba(0,0,0,0.6);
  max-height: 90vh; overflow-y: auto;
}
.modal-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 18px; }
.modal-poster {
  width: 46px; height: 62px; flex-shrink: 0; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
.thumb-img { width: 100%; height: 100%; object-fit: cover; }
.modal-info { flex: 1; min-width: 0; }
.modal-title { font-size: 0.88rem; font-weight: 700; color: #fff; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.modal-meta { font-size: 0.68rem; color: rgba(255,255,255,0.36); margin-bottom: 6px; }
.modal-tags { display: flex; flex-wrap: wrap; gap: 3px; }
.modal-tag { font-size: 0.6rem; padding: 1px 7px; border-radius: 4px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09); color: rgba(255,255,255,0.48); font-weight: 600; }
.modal-close { flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.5); cursor: pointer; transition: background 0.15s; }
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

/* Gate boxes */
.gate-box {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; padding: 20px 12px 12px;
  border: 1px solid rgba(255,255,255,0.07); border-radius: 14px;
  background: rgba(255,255,255,0.02); margin-bottom: 12px;
}
.gate-icon {
  width: 52px; height: 52px; border-radius: 50%;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center; margin-bottom: 10px;
}
.gate-icon--sub { background: rgba(255,166,0,0.08); border-color: rgba(255,166,0,0.2); }
.gate-title { font-size: 0.9rem; font-weight: 800; color: #fff; margin-bottom: 5px; }
.gate-desc { font-size: 0.72rem; color: rgba(255,255,255,0.42); margin-bottom: 14px; line-height: 1.6; }
.gate-btn {
  width: 100%; padding: 12px; border: none; border-radius: 12px;
  font-size: 0.72rem; font-weight: 800; letter-spacing: 0.08em;
  cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: filter 0.2s;
}
.gate-btn--primary {
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; box-shadow: 0 8px 24px rgba(0,255,157,0.22);
}
.gate-btn--sub {
  background: linear-gradient(135deg, #ffa600, #ff7c00);
  color: #1a0a00; box-shadow: 0 8px 24px rgba(255,166,0,0.22);
}
.gate-btn:hover { filter: brightness(1.07); }

.section-label { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em; color: rgba(255,255,255,0.28); margin-bottom: 10px; }

.episode-grid { display: grid; grid-template-columns: repeat(8, 1fr); gap: 5px; margin-bottom: 10px; max-height: 200px; overflow-y: auto; padding-right: 2px; }
.ep-box {
  aspect-ratio: 1; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55);
  font-size: 0.66rem; font-weight: 700; cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; justify-content: center;
}
.ep-box:hover { border-color: rgba(0,255,157,0.3); color: #fff; background: rgba(0,255,157,0.06); }
.ep-box.selected { border-color: rgba(0,255,157,0.6); background: rgba(0,255,157,0.15); color: #00ff9d; }
.ep-box--no-link { opacity: 0.4; }
.ep-box--no-link:hover { border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.04); }
.ep-empty { font-size: 0.75rem; color: rgba(255,255,255,0.25); text-align: center; padding: 20px 0 12px; }
.ep-selected-info {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px; margin-bottom: 10px;
  background: rgba(0,255,157,0.06); border: 1px solid rgba(0,255,157,0.18); border-radius: 8px;
}
.ep-selected-label { font-size: 0.65rem; font-weight: 800; color: #00ff9d; white-space: nowrap; }
.ep-selected-title { font-size: 0.75rem; color: rgba(255,255,255,0.75); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }

.big-dl-btn {
  width: 100%; padding: 13px; text-decoration: none;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.76rem; font-weight: 800; letter-spacing: 0.1em;
  border: none; border-radius: 12px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 10px 30px rgba(0,255,157,0.25); margin-bottom: 10px;
  transition: filter 0.2s; box-sizing: border-box;
}
.big-dl-btn:hover { filter: brightness(1.06); }
.big-dl-btn--disabled, .big-dl-btn:disabled {
  opacity: 0.45; cursor: not-allowed; filter: none;
  background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.4); box-shadow: none;
}
.dl-note { text-align: center; font-size: 0.64rem; color: rgba(255,255,255,0.3); margin-bottom: 10px; }

.modal-cancel { width: 100%; padding: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.07); background: transparent; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.3); cursor: pointer; transition: color 0.15s, background 0.15s; }
.modal-cancel:hover { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.04); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.22s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.22s ease; }
.modal-enter-from .modal-box { transform: scale(0.95) translateY(10px); }
.modal-leave-to .modal-box { transform: scale(0.97) translateY(6px); }
</style>
