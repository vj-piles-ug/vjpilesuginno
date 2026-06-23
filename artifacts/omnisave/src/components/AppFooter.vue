<template>
  <footer class="footer-root">
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
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.footer-root {
  width: 100%;
  border-top: 1px solid rgba(255,255,255,0.06);
}
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

@media (max-width: 1023px) {
  .footer-root {
    padding-bottom: calc(60px + env(safe-area-inset-bottom));
  }
}
</style>
