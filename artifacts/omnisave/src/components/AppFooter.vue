<template>
  <footer class="footer-root">

    <!-- Customer Care Banner -->
    <div class="care-banner">
      <div class="care-inner">
        <div class="care-left">
          <div class="care-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 2.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
          </div>
          <div>
            <p class="care-label">CUSTOMER CARE &amp; HELP</p>
            <p class="care-desc">Available Mon–Sat · 8am – 8pm EAT</p>
          </div>
        </div>
        <a href="tel:0774356888" class="care-phone">0774 356 888</a>
      </div>
    </div>

    <!-- Main footer body -->
    <div class="footer-body">
      <div class="footer-top">
        <!-- Brand -->
        <div class="brand-col">
          <div class="brand-row">
            <div class="brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div>
              <div class="brand-name-row">
                <span class="brand-name">VJ PILES UG</span>
                <span class="brand-dot">.COM</span>
              </div>
              <p class="brand-tagline">Free Online Video Downloader</p>
            </div>
          </div>
          <p class="brand-desc">Search movies, TV shows, and anime by title, then download HD MP4 videos with subtitle options.</p>

          <!-- Phone repeat (mobile friendly) -->
          <div class="phone-inline">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 2.18 2 2 0 012.03 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
            <a href="tel:0774356888" class="phone-inline-num">0774 356 888</a>
          </div>
        </div>

        <!-- Links grid -->
        <div class="links-grid">
          <div class="links-col">
            <p class="links-heading">Browse</p>
            <div class="links-list">
              <RouterLink to="/" class="footer-link">HOME</RouterLink>
              <RouterLink to="/movies" class="footer-link">MOVIES</RouterLink>
              <RouterLink to="/series" class="footer-link">SERIES</RouterLink>
              <RouterLink to="/animation" class="footer-link">ANIMATION</RouterLink>
            </div>
          </div>
          <div class="links-col">
            <p class="links-heading">Download</p>
            <div class="links-list">
              <a href="#" class="footer-link">HD MP4</a>
              <a href="#" class="footer-link">SUBTITLES</a>
              <a href="#" class="footer-link">480P</a>
              <a href="#" class="footer-link">1080P</a>
            </div>
          </div>
          <div class="links-col">
            <p class="links-heading">Company</p>
            <div class="links-list">
              <a href="#" class="footer-link">PRIVACY POLICY</a>
              <a href="#" class="footer-link">TERMS OF SERVICE</a>
              <a href="#" class="footer-link">CONTACT</a>
              <RouterLink to="/admin" class="footer-link admin-link">ADMIN PANEL</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="footer-bottom">
        <p class="copy">&copy; {{ new Date().getFullYear() }} VJ PILES UG.COM — All rights reserved.</p>
        <p class="copy-sub">Free online video downloader for movies, TV shows &amp; anime</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.footer-root {
  width: 100%;
  border-top: 1px solid rgba(255,255,255,0.06);
}

/* Care banner */
.care-banner {
  width: 100%;
  background: linear-gradient(90deg, rgba(0,255,157,0.07) 0%, rgba(0,212,255,0.05) 100%);
  border-bottom: 1px solid rgba(0,255,157,0.12);
}
.care-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 18px 16px;
  flex-wrap: wrap;
}
.care-left {
  display: flex;
  align-items: center;
  gap: 14px;
}
.care-icon {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  background: rgba(0,255,157,0.12);
  border: 1px solid rgba(0,255,157,0.2);
  display: flex; align-items: center; justify-content: center;
  color: #00ff9d;
}
.care-label {
  font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em;
  color: rgba(0,255,157,0.8); text-transform: uppercase; margin-bottom: 2px;
}
.care-desc { font-size: 0.75rem; color: rgba(255,255,255,0.45); }
.care-phone {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 900;
  color: #00ff9d;
  letter-spacing: 0.04em;
  text-decoration: none;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: filter 0.2s;
  white-space: nowrap;
}
.care-phone:hover { filter: brightness(1.15); }

/* Footer body */
.footer-body { padding: 40px 16px 24px; }
.footer-top {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.brand-col { flex: 0 0 220px; }
.brand-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.brand-icon {
  width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
  background: linear-gradient(135deg,#00ff9d,#00c8b8,#00d4ff);
  display: flex; align-items: center; justify-content: center;
}
.brand-name-row { display: flex; align-items: baseline; gap: 1px; }
.brand-name { font-size: 0.85rem; font-weight: 900; letter-spacing: 0.08em; color: #fff; }
.brand-dot { font-size: 0.75rem; font-weight: 800; color: #00ff9d; }
.brand-tagline { font-size: 0.6rem; color: rgba(255,255,255,0.3); letter-spacing: 0.08em; text-transform: uppercase; }
.brand-desc { font-size: 0.8rem; line-height: 1.65; color: rgba(255,255,255,0.38); margin-bottom: 14px; }

.phone-inline { display: flex; align-items: center; gap: 7px; }
.phone-inline-num {
  font-size: 0.95rem; font-weight: 800; color: #00ff9d;
  text-decoration: none; letter-spacing: 0.04em;
  transition: color 0.2s;
}
.phone-inline-num:hover { color: #00d4ff; }

.links-grid { display: flex; gap: 40px; flex-wrap: wrap; flex: 1; }
.links-col { min-width: 100px; }
.links-heading { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 12px; }
.links-list { display: flex; flex-direction: column; gap: 8px; }
.footer-link { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.07em; color: rgba(255,255,255,0.42); text-decoration: none; transition: color 0.15s; }
.footer-link:hover { color: rgba(255,255,255,0.85); }
.admin-link { color: rgba(0,255,157,0.45); }
.admin-link:hover { color: #00ff9d; }

.divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 30%, rgba(255,255,255,0.07) 70%, transparent); margin-bottom: 20px; }

.footer-bottom { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.copy { font-size: 0.72rem; color: rgba(255,255,255,0.22); text-align: center; }
.copy-sub { font-size: 0.68rem; color: rgba(255,255,255,0.15); text-align: center; }

@media (min-width: 640px) {
  .footer-bottom { flex-direction: row; justify-content: space-between; }
}
</style>
