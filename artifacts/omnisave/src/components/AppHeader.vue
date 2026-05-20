<template>
  <header class="sticky top-0 z-50">
    <div class="header-bar">
      <div class="header-inner">
        <!-- LEFT: Logo + Nav -->
        <div class="flex items-center gap-6 shrink-0">
          <RouterLink to="/" class="brand-link">
            <div class="brand-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">VJ PILES UG</span>
              <span class="brand-dot">.COM</span>
            </div>
          </RouterLink>

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

        <!-- CENTER: Search -->
        <form class="header-search" @submit.prevent="doSearch">
          <svg class="hs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search movies, series, anime..."
            class="hs-input"
            @keyup.enter="doSearch"
          />
          <button type="submit" class="hs-btn">GO</button>
        </form>

        <!-- RIGHT: Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <button class="btn-subscribe hidden lg:flex">
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
          <div class="h-5 w-px bg-white/15 hidden sm:block"></div>
          <button class="btn-login">
            <svg class="h-4 w-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            <span class="hidden sm:inline">LOGIN</span>
          </button>
          <!-- Mobile hamburger -->
          <button class="flex lg:hidden items-center justify-center h-8 w-8 rounded-lg border border-white/10 bg-white/[0.05]" @click="mobileOpen = !mobileOpen">
            <svg class="h-4 w-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <div v-if="mobileOpen" class="border-t border-white/[0.06] px-4 py-3 lg:hidden">
        <form class="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2" @submit.prevent="doSearch">
          <svg class="h-4 w-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Search..." class="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
        </form>
        <div class="flex flex-col gap-1">
          <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="mobile-nav-item" :class="{ 'mobile-nav-item--active': $route.path === item.path }" @click="mobileOpen = false">{{ item.label }}</RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const mobileOpen = ref(false)
const searchQuery = ref('')

const navItems = [
  { label: 'HOME', path: '/' },
  { label: 'MOVIES', path: '/movies' },
  { label: 'SERIES', path: '/series' },
  { label: 'ANIMATION', path: '/animation' },
]

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/', query: { q: searchQuery.value.trim() } })
    mobileOpen.value = false
  }
}
</script>

<style scoped>
.header-bar {
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  height: 56px;
}
@media (min-width: 1024px) { .header-inner { padding: 0 32px; } }

.brand-link { display: flex; align-items: center; gap: 9px; text-decoration: none; }
.brand-icon {
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
}
.brand-text { display: flex; align-items: baseline; gap: 1px; }
.brand-name { font-size: 0.95rem; font-weight: 800; letter-spacing: 0.05em; color: #fff; }
.brand-dot { font-size: 0.72rem; font-weight: 700; color: #00ff9d; }

.nav-item {
  padding: 5px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.1em; color: rgba(255,255,255,0.5); text-decoration: none;
  transition: color 0.15s, background 0.15s;
}
.nav-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
.nav-item--active { color: #fff; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.18); }

/* Header search */
.header-search {
  flex: 1;
  max-width: 480px;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9999px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
  height: 36px;
}
.header-search:focus-within {
  border-color: rgba(0,255,157,0.35);
  box-shadow: 0 0 0 3px rgba(0,255,157,0.08);
}
.hs-icon { width: 16px; height: 16px; flex-shrink: 0; margin-left: 14px; color: rgba(255,255,255,0.35); }
.hs-input {
  flex: 1; background: transparent; border: none; outline: none;
  color: #fff; font-size: 0.82rem; padding: 0 10px;
  min-width: 0;
}
.hs-input::placeholder { color: rgba(255,255,255,0.3); }
.hs-btn {
  flex-shrink: 0;
  margin: 4px;
  padding: 0 16px;
  height: 28px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
  transition: filter 0.2s;
}
.hs-btn:hover { filter: brightness(1.06); }

/* Action buttons */
.btn-subscribe {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7);
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-subscribe:hover { background: rgba(255,255,255,0.09); color: #fff; }

.btn-app {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 9999px;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  color: #021a10; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; cursor: pointer;
  box-shadow: 0 6px 20px rgba(0,255,157,0.22); transition: filter 0.2s;
}
.btn-app:hover { filter: brightness(1.07); }

.btn-login {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.1); background: transparent;
  color: rgba(255,255,255,0.65); font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn-login:hover { background: rgba(255,255,255,0.07); color: #fff; }

.mobile-nav-item {
  display: block; padding: 9px 12px; border-radius: 8px;
  font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em;
  color: rgba(255,255,255,0.55); text-decoration: none; transition: color 0.15s, background 0.15s;
}
.mobile-nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
.mobile-nav-item--active { color: #00ff9d; }
</style>
