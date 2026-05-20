<template>
  <header class="sticky top-0 z-50">
    <div class="header-bar">
      <div class="header-inner">
        <!-- LEFT: Logo + Nav -->
        <div class="flex items-center gap-5 shrink-0">
          <RouterLink to="/" class="brand-link">
            <div class="brand-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div class="brand-text">
              <span class="brand-name">VJ PILES UG</span>
              <span class="brand-dot">.COM</span>
            </div>
          </RouterLink>
          <nav class="hidden items-center gap-0.5 lg:flex">
            <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" :class="{ 'nav-item--active': $route.path === item.path }">{{ item.label }}</RouterLink>
          </nav>
        </div>

        <!-- CENTER: Search -->
        <form class="header-search" @submit.prevent="doSearch">
          <svg class="hs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search movies, series, anime..." class="hs-input" @keyup.enter="doSearch" />
          <button type="submit" class="hs-btn">GO</button>
        </form>

        <!-- RIGHT: Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <button class="btn-subscribe hidden lg:flex" @click="$emit('openSubscribe')">
            <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            SUBSCRIBE
          </button>
          <button class="btn-app">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span class="hidden sm:inline">APP</span>
          </button>
          <div class="h-4 w-px bg-white/15 hidden sm:block"></div>
          <button class="btn-login" @click="$emit('openLogin')">
            <svg class="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span class="hidden sm:inline">LOGIN</span>
          </button>
          <button class="flex lg:hidden items-center justify-center h-7 w-7 rounded-lg border border-white/10 bg-white/[0.05]" @click="mobileOpen = !mobileOpen">
            <svg class="h-3.5 w-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" :d="mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <div v-if="mobileOpen" class="border-t border-white/[0.06] px-4 py-3 lg:hidden">
        <form class="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5" @submit.prevent="doSearch">
          <svg class="h-3.5 w-3.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Search..." class="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
        </form>
        <div class="flex flex-col gap-0.5">
          <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="mobile-nav-item" :class="{ 'mobile-nav-item--active': $route.path === item.path }" @click="mobileOpen = false">{{ item.label }}</RouterLink>
          <button class="mobile-nav-item text-left" @click="$emit('openSubscribe'); mobileOpen = false">SUBSCRIBE</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

defineEmits(['openLogin', 'openSubscribe'])

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
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  width: 100%; max-width: 100%;
  margin: 0 auto; padding: 0 20px; height: 52px;
}
@media (min-width: 1024px) { .header-inner { padding: 0 36px; } }
@media (min-width: 1536px) { .header-inner { padding: 0 56px; } }

.brand-link { display: flex; align-items: center; gap: 8px; text-decoration: none; }
.brand-icon { width: 28px; height: 28px; border-radius: 7px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); }
.brand-text { display: flex; align-items: baseline; gap: 1px; }
.brand-name { font-size: 0.88rem; font-weight: 800; letter-spacing: 0.05em; color: #fff; }
.brand-dot { font-size: 0.68rem; font-weight: 700; color: #00ff9d; }

.nav-item { padding: 4px 11px; border-radius: 7px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.48); text-decoration: none; transition: color 0.15s, background 0.15s; }
.nav-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
.nav-item--active { color: #fff; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.18); }

.header-search {
  flex: 1; max-width: 440px; display: flex; align-items: center;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9999px; overflow: hidden; height: 34px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.header-search:focus-within { border-color: rgba(0,255,157,0.35); box-shadow: 0 0 0 3px rgba(0,255,157,0.08); }
.hs-icon { width: 14px; height: 14px; flex-shrink: 0; margin-left: 12px; color: rgba(255,255,255,0.35); }
.hs-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 0.78rem; padding: 0 8px; min-width: 0; }
.hs-input::placeholder { color: rgba(255,255,255,0.3); }
.hs-btn { flex-shrink: 0; margin: 3px; padding: 0 14px; height: 26px; border-radius: 9999px; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); color: #021a10; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; border: none; cursor: pointer; transition: filter 0.2s; }
.hs-btn:hover { filter: brightness(1.06); }

.btn-subscribe { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.68); font-size: 0.67rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: background 0.2s, color 0.2s; }
.btn-subscribe:hover { background: rgba(255,255,255,0.09); color: #fff; }

.btn-app { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); color: #021a10; font-size: 0.67rem; font-weight: 800; letter-spacing: 0.1em; cursor: pointer; box-shadow: 0 4px 16px rgba(0,255,157,0.2); transition: filter 0.2s; }
.btn-app:hover { filter: brightness(1.07); }

.btn-login { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,255,255,0.65); font-size: 0.67rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: background 0.2s, color 0.2s; }
.btn-login:hover { background: rgba(255,255,255,0.07); color: #fff; }

.mobile-nav-item { display: block; padding: 8px 10px; border-radius: 7px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.52); text-decoration: none; transition: color 0.15s, background 0.15s; background: transparent; border: none; width: 100%; cursor: pointer; }
.mobile-nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
.mobile-nav-item--active { color: #00ff9d; }
</style>
