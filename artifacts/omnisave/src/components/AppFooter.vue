<template>
  <footer class="relative border-t border-white/[0.06] pb-8 pt-12">
    <div class="mx-auto w-full max-w-[1380px] px-6 md:px-8 xl:px-10">
      <div class="flex flex-col gap-10 md:flex-row md:justify-between">
        <!-- Brand -->
        <div class="max-w-xs">
          <div class="mb-4 flex items-center gap-3">
            <div class="h-9 w-9 rounded-xl flex items-center justify-center" style="background: linear-gradient(135deg,#00ff9d,#00c8b8,#00d4ff);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div>
              <div class="flex items-baseline gap-0.5">
                <span class="text-sm font-extrabold tracking-wider text-white">VJ PILES UG</span>
                <span class="text-xs font-bold text-[#00ff9d]">.COM</span>
              </div>
              <p class="text-[10px] text-white/30 tracking-wider uppercase">Free Online Video Downloader</p>
            </div>
          </div>
          <p class="text-sm leading-6 text-white/40">Search movies, TV shows, and anime by title, then download HD MP4 videos with subtitle options.</p>
        </div>

        <!-- Links grid -->
        <div class="grid grid-cols-2 gap-x-16 gap-y-2 sm:grid-cols-3">
          <div>
            <p class="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">Browse</p>
            <div class="flex flex-col gap-2">
              <RouterLink to="/" class="footer-link">HOME</RouterLink>
              <RouterLink to="/movies" class="footer-link">MOVIES</RouterLink>
              <RouterLink to="/series" class="footer-link">SERIES</RouterLink>
              <RouterLink to="/animation" class="footer-link">ANIMATION</RouterLink>
            </div>
          </div>
          <div>
            <p class="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">Download</p>
            <div class="flex flex-col gap-2">
              <a href="#" class="footer-link">HD MP4</a>
              <a href="#" class="footer-link">SUBTITLES</a>
              <a href="#" class="footer-link">480P</a>
              <a href="#" class="footer-link">1080P</a>
            </div>
          </div>
          <div>
            <p class="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/30">Company</p>
            <div class="flex flex-col gap-2">
              <a href="#" class="footer-link">PRIVACY POLICY</a>
              <a href="#" class="footer-link">TERMS OF SERVICE</a>
              <a href="#" class="footer-link">CONTACT</a>
            </div>
          </div>
        </div>
      </div>

      <div class="my-8 h-px" style="background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent);"></div>

      <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p class="text-xs text-white/25">&copy; {{ new Date().getFullYear() }} VJ PILES UG.COM — All rights reserved.</p>
        <p class="text-xs text-white/20">Free online video downloader for movies, TV shows &amp; anime</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer-link {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: rgba(255,255,255,0.42);
  text-decoration: none;
  transition: color 0.15s;
}
.footer-link:hover { color: rgba(255,255,255,0.8); }
</style>
