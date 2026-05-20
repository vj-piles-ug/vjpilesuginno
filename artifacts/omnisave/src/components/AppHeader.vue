<template>
  <header class="sticky top-0 z-50">
    <div class="header-bar">
      <div class="header-inner">
        <div class="flex items-center gap-5 shrink-0">
          <RouterLink to="/" class="brand-link">
            <img src="/logo.png" alt="VJ Piles UG" class="brand-logo" />
            <div class="brand-text">
              <span class="brand-name">VJ PILES UG</span><span class="brand-dot">.COM</span>
            </div>
          </RouterLink>
          <nav class="hidden items-center gap-0.5 lg:flex">
            <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" :class="{ 'nav-item--active': $route.path === item.path, 'nav-item--admin': item.label === 'ADMIN' }">{{ item.label }}</RouterLink>
          </nav>
        </div>

        <form class="header-search" @submit.prevent="doSearch">
          <svg class="hs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search movies, series, anime..." class="hs-input" @keyup.enter="doSearch" />
          <button type="submit" class="hs-btn">GO</button>
        </form>

        <div class="flex items-center gap-2 shrink-0">
          <button class="btn-subscribe hidden lg:flex" @click="handleSubscribeClick">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20v2H2v-2zm2-3l3-8 5 4 4-6 3 10H4z"/></svg>
            SUBSCRIBE
          </button>

          <div class="h-4 w-px bg-white/15 hidden sm:block"></div>

          <!-- Logged in state -->
          <div v-if="isLoggedIn" class="user-menu">
            <button class="user-btn" @click="menuOpen = !menuOpen">
              <div class="user-avatar">{{ userInitial }}</div>
              <span class="hidden sm:inline user-name-short">{{ userName }}</span>
              <svg class="h-3 w-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div v-if="menuOpen" class="user-dropdown">
              <div class="dropdown-email">{{ currentUser?.email }}</div>
              <button class="dropdown-item" @click="handleLogout">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                Sign out
              </button>
            </div>
          </div>

          <!-- Logged out state -->
          <button v-else class="btn-login" @click="loginOpen = true">
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

      <div v-if="mobileOpen" class="border-t border-white/[0.06] px-4 py-3 lg:hidden">
        <form class="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5" @submit.prevent="doSearch">
          <svg class="h-3.5 w-3.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="searchQuery" type="text" placeholder="Search..." class="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30" />
        </form>
        <div class="flex flex-col gap-0.5">
          <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="mobile-nav-item" :class="{ 'mobile-nav-item--active': $route.path === item.path }" @click="mobileOpen = false">{{ item.label }}</RouterLink>
          <button class="mobile-nav-item text-left" @click="handleSubscribeClick(); mobileOpen = false">SUBSCRIBE TO DOWNLOAD</button>
          <button v-if="isLoggedIn" class="mobile-nav-item text-left text-red-400" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../store/auth'
import { loginOpen, subscribeOpen } from '../store/ui'

const router = useRouter()
const mobileOpen = ref(false)
const menuOpen = ref(false)
const searchQuery = ref('')

const { currentUser, isLoggedIn, isAdmin, logOut } = useAuth()

const userInitial = computed(() => {
  const name = currentUser.value?.displayName || currentUser.value?.email || '?'
  return name[0].toUpperCase()
})

const userName = computed(() => {
  const name = currentUser.value?.displayName || currentUser.value?.email || ''
  return name.length > 14 ? name.slice(0, 12) + '…' : name
})

async function handleLogout() {
  await logOut()
  menuOpen.value = false
  mobileOpen.value = false
}

const navItems = computed(() => [
  { label: 'HOME', path: '/' },
  { label: 'MOVIES', path: '/movies' },
  { label: 'SERIES', path: '/series' },
  { label: 'ANIMATION', path: '/animation' },
  ...(isAdmin.value ? [{ label: 'ADMIN', path: '/admin' }] : []),
])

function handleSubscribeClick() {
  if (!isLoggedIn.value) {
    loginOpen.value = true
  } else {
    subscribeOpen.value = true
  }
}

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/', query: { q: searchQuery.value.trim() } })
    mobileOpen.value = false
  }
}
</script>

<style scoped>
.header-bar {
  width: 100%; background: rgba(0,0,0,0.65);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  display: flex; align-items: center; justify-content: space-between; gap: 14px;
  width: 100%; padding: 0 12px; height: 52px;
}
.brand-link { display: flex; align-items: center; gap: 7px; text-decoration: none; }
.brand-logo { height: 36px; width: 36px; object-fit: cover; border-radius: 50%; display: block; flex-shrink: 0; }
.brand-text { display: flex; align-items: baseline; gap: 1px; }
.brand-name { font-size: 0.88rem; font-weight: 800; letter-spacing: 0.05em; color: #fff; }
.brand-dot { font-size: 0.68rem; font-weight: 700; color: #00ff9d; }

@media (max-width: 640px) {
  .header-inner { height: 44px; gap: 8px; padding: 0 10px; }
  .brand-logo { height: 28px; width: 28px; }
  .brand-name { font-size: 0.75rem; }
  .brand-dot { font-size: 0.58rem; }
  .header-search { display: none; }
}

.nav-item { padding: 4px 11px; border-radius: 7px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.48); text-decoration: none; transition: color 0.15s, background 0.15s; }
.nav-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
.nav-item--active { color: #fff; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.18); }
.nav-item--admin { color: #ffa600; }
.nav-item--admin:hover { color: #ffbe42; background: rgba(255,166,0,0.08); }
.nav-item--admin.nav-item--active { color: #ffa600; background: rgba(255,166,0,0.1); border-color: rgba(255,166,0,0.25); }
.header-search {
  flex: 1; max-width: 440px; display: flex; align-items: center;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9999px; overflow: hidden; height: 34px; transition: border-color 0.2s, box-shadow 0.2s;
}
.header-search:focus-within { border-color: rgba(0,255,157,0.35); box-shadow: 0 0 0 3px rgba(0,255,157,0.08); }
.hs-icon { width: 14px; height: 14px; flex-shrink: 0; margin-left: 12px; color: rgba(255,255,255,0.35); }
.hs-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 0.78rem; padding: 0 8px; min-width: 0; }
.hs-input::placeholder { color: rgba(255,255,255,0.3); }
.hs-btn { flex-shrink: 0; margin: 3px; padding: 0 14px; height: 26px; border-radius: 9999px; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); color: #021a10; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.1em; border: none; cursor: pointer; transition: filter 0.2s; }
.hs-btn:hover { filter: brightness(1.06); }
.btn-subscribe { display: inline-flex; align-items: center; gap: 5px; padding: 5px 14px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.68); font-size: 0.67rem; font-weight: 700; letter-spacing: 0.08em; cursor: pointer; transition: background 0.2s, color 0.2s; }
.btn-subscribe:hover { background: rgba(255,255,255,0.09); color: #fff; }
.sub-from { font-size: 0.55rem; font-weight: 500; letter-spacing: 0.06em; color: #00ff9d; opacity: 0.85; }
.btn-login { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: rgba(255,255,255,0.65); font-size: 0.67rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: background 0.2s, color 0.2s; }
.btn-login:hover { background: rgba(255,255,255,0.07); color: #fff; }

.user-menu { position: relative; }
.user-btn { display: flex; align-items: center; gap: 7px; padding: 4px 10px; border-radius: 9999px; border: 1px solid rgba(0,255,157,0.25); background: rgba(0,255,157,0.07); cursor: pointer; transition: background 0.15s; }
.user-btn:hover { background: rgba(0,255,157,0.12); }
.user-avatar { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #00ff9d, #00d4ff); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; color: #021a10; flex-shrink: 0; }
.user-name-short { font-size: 0.67rem; font-weight: 600; color: rgba(255,255,255,0.8); max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-dropdown {
  position: absolute; top: calc(100% + 6px); right: 0;
  min-width: 180px; background: rgba(7,14,10,0.98); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.5); z-index: 200;
}
.dropdown-email { font-size: 0.68rem; color: rgba(255,255,255,0.38); padding: 4px 8px 8px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dropdown-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 10px; border-radius: 8px; background: transparent; border: none; color: #f87171; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.dropdown-item:hover { background: rgba(220,38,38,0.1); }

.mobile-nav-item { display: block; padding: 8px 10px; border-radius: 7px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.52); text-decoration: none; transition: color 0.15s, background 0.15s; background: transparent; border: none; width: 100%; cursor: pointer; }
.mobile-nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
.mobile-nav-item--active { color: #00ff9d; }
</style>
