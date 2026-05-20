<template>
  <header class="sticky top-0 z-50">
    <div class="header-bar">
      <!-- Shimmer line -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-px" style="background: linear-gradient(90deg, transparent, rgba(0,255,157,0.18), transparent);"></div>

      <div class="header-inner">
        <!-- LEFT: Logo + Nav -->
        <div class="flex items-center gap-8">
          <!-- Logo / Brand name -->
          <RouterLink to="/" class="brand-link">
            <div class="brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">VJ PILES UG</span>
              <span class="brand-dot">.COM</span>
            </div>
          </RouterLink>

          <!-- Desktop nav -->
          <nav class="hidden items-center gap-1 lg:flex">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'nav-item--active': $route.path === item.path }"
            >{{ item.label }}</RouterLink>
          </nav>
        </div>

        <!-- RIGHT: Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <button class="btn-subscribe hidden sm:flex">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            SUBSCRIBE
          </button>

          <button class="btn-app">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
            <span class="hidden sm:inline">APP</span>
          </button>

          <div class="h-5 w-px bg-white/15"></div>

          <button class="btn-login" @click="$emit('openLogin')">
            <svg class="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            LOGIN
          </button>

          <!-- Mobile hamburger -->
          <button class="flex lg:hidden items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05]" @click="mobileOpen = !mobileOpen">
            <svg class="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile nav drawer -->
      <div v-if="mobileOpen" class="border-t border-white/[0.06] px-4 py-3 lg:hidden">
        <div class="flex flex-col gap-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="mobile-nav-item"
            :class="{ 'mobile-nav-item--active': $route.path === item.path }"
            @click="mobileOpen = false"
          >{{ item.label }}</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

defineEmits(['openLogin'])

const mobileOpen = ref(false)

const navItems = [
  { label: 'HOME', path: '/' },
  { label: 'MOVIES', path: '/movies' },
  { label: 'SERIES', path: '/series' },
  { label: 'ANIMATION', path: '/animation' },
]
</script>

<style scoped>
.header-bar {
  position: relative;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1380px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
}
@media (min-width: 768px) {
  .header-inner { padding: 0 32px; }
}

/* Brand */
.brand-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  flex-shrink: 0;
}
.brand-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00ff9d 0%, #00c8b8 50%, #00d4ff 100%);
  flex-shrink: 0;
}
.brand-text {
  display: flex;
  align-items: baseline;
  gap: 1px;
}
.brand-name {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #ffffff;
  line-height: 1;
}
.brand-dot {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #00ff9d;
  line-height: 1;
}

/* Nav */
.nav-item {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}
.nav-item:hover {
  color: rgba(255,255,255,0.9);
  background: rgba(255,255,255,0.06);
}
.nav-item--active {
  color: #ffffff;
  background: rgba(0,255,157,0.1);
  border: 1px solid rgba(0,255,157,0.18);
}

/* Buttons */
.btn-subscribe {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.75);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.btn-subscribe:hover {
  background: rgba(255,255,255,0.09);
  border-color: rgba(255,255,255,0.25);
  color: #fff;
}

.btn-app {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 9999px;
  border: 1px solid rgba(0,255,157,0.25);
  background: linear-gradient(135deg, #00ff9d 0%, #00c8b8 50%, #00d4ff 100%);
  color: #021a10;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,255,157,0.2);
  transition: filter 0.2s, box-shadow 0.2s;
}
.btn-app:hover {
  filter: brightness(1.08);
  box-shadow: 0 10px 30px rgba(0,255,157,0.3);
}

.btn-login {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: transparent;
  color: rgba(255,255,255,0.7);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
}
.btn-login:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.22);
  color: #fff;
}

/* Mobile nav */
.mobile-nav-item {
  display: block;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}
.mobile-nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
.mobile-nav-item--active { color: #00ff9d; }
</style>
