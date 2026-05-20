<template>
  <header class="sticky top-0 z-50">
    <div class="header-bar">
      <div class="header-inner">

        <!-- Brand -->
        <RouterLink to="/" class="brand-link">
          <img src="/logo.png" alt="VJ Piles UG" class="brand-logo" />
          <div class="brand-text">
            <span class="brand-name">VJ PILES UG</span><span class="brand-dot">.COM</span>
          </div>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden items-center gap-0.5 lg:flex">
          <RouterLink v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" :class="{ 'nav-item--active': $route.path === item.path, 'nav-item--admin': item.label === 'ADMIN' }">{{ item.label }}</RouterLink>
        </nav>

        <!-- Search bar — visible on desktop always, on mobile shown inline -->
        <form class="header-search" @submit.prevent="doSearch">
          <svg class="hs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Search movies, series, anime..." class="hs-input" @keyup.enter="doSearch" />
          <button type="submit" class="hs-btn">GO</button>
        </form>

        <!-- Right actions -->
        <div class="flex items-center gap-2 shrink-0">

          <!-- Install App -->
          <button v-if="isInstallable" class="btn-install" @click="promptInstall" title="Install App">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            <span class="install-label">INSTALL</span>
          </button>

          <!-- Subscribe -->
          <button class="btn-subscribe" @click="handleSubscribeClick">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20v2H2v-2zm2-3l3-8 5 4 4-6 3 10H4z"/></svg>
            <span class="sub-label">SUBSCRIBE</span>
          </button>

          <div class="h-4 w-px bg-white/15"></div>

          <!-- Logged in -->
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

          <!-- Logged out -->
          <button v-else class="btn-login" @click="loginOpen = true">
            <svg class="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span class="login-label">LOGIN</span>
          </button>

        </div>
      </div>
    </div>
  </header>

  <!-- Bottom mobile navigation bar -->
  <nav class="mobile-bottom-nav">
    <RouterLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="mob-nav-item"
      :class="{ 'mob-nav-item--active': $route.path === item.path, 'mob-nav-item--admin': item.label === 'ADMIN' }"
    >
      <!-- Home icon -->
      <svg v-if="item.label === 'HOME'" class="mob-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
      </svg>
      <!-- Movies icon -->
      <svg v-else-if="item.label === 'MOVIES'" class="mob-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
      </svg>
      <!-- Series icon -->
      <svg v-else-if="item.label === 'SERIES'" class="mob-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      <!-- Animation icon -->
      <svg v-else-if="item.label === 'ANIMATION'" class="mob-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <!-- Admin icon -->
      <svg v-else-if="item.label === 'ADMIN'" class="mob-nav-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <span class="mob-nav-label">{{ item.label === 'ANIMATION' ? 'ANIME' : item.label }}</span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '../store/auth'
import { loginOpen, subscribeOpen } from '../store/ui'
import { usePWAInstall } from '../composables/usePWAInstall'

const router = useRouter()
const menuOpen = ref(false)
const searchQuery = ref('')

const { currentUser, isLoggedIn, isAdmin, logOut } = useAuth()
const { isInstallable, promptInstall } = usePWAInstall()

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
  }
}
</script>

<style scoped>
/* ── Header bar ─────────────────────────────────────────────── */
.header-bar {
  width: 100%;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.header-inner {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px; width: 100%; padding: 0 12px; height: 52px;
}

/* ── Brand ──────────────────────────────────────────────────── */
.brand-link { display: flex; align-items: center; gap: 7px; text-decoration: none; flex-shrink: 0; }
.brand-logo { height: 30px; width: 30px; object-fit: cover; border-radius: 50%; display: block; flex-shrink: 0; }
.brand-text { display: flex; align-items: baseline; gap: 1px; }
.brand-name { font-size: 0.82rem; font-weight: 800; letter-spacing: 0.05em; color: #fff; white-space: nowrap; }
.brand-dot { font-size: 0.62rem; font-weight: 700; color: #00ff9d; }

/* ── Desktop nav ────────────────────────────────────────────── */
.nav-item { padding: 4px 11px; border-radius: 7px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; color: rgba(255,255,255,0.48); text-decoration: none; transition: color 0.15s, background 0.15s; }
.nav-item:hover { color: rgba(255,255,255,0.9); background: rgba(255,255,255,0.06); }
.nav-item--active { color: #fff; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.18); }
.nav-item--admin { color: #ffa600; }
.nav-item--admin:hover { color: #ffbe42; background: rgba(255,166,0,0.08); }
.nav-item--admin.nav-item--active { color: #ffa600; background: rgba(255,166,0,0.1); border-color: rgba(255,166,0,0.25); }

/* ── Search bar ─────────────────────────────────────────────── */
.header-search {
  flex: 1; max-width: 440px; display: flex; align-items: center;
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9999px; overflow: hidden; height: 32px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.header-search:focus-within { border-color: rgba(0,255,157,0.35); box-shadow: 0 0 0 3px rgba(0,255,157,0.08); }
.hs-icon { width: 13px; height: 13px; flex-shrink: 0; margin-left: 10px; color: rgba(255,255,255,0.35); }
.hs-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 0.75rem; padding: 0 6px; min-width: 0; }
.hs-input::placeholder { color: rgba(255,255,255,0.3); }
.hs-btn { flex-shrink: 0; margin: 3px; padding: 0 12px; height: 24px; border-radius: 9999px; background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff); color: #021a10; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.1em; border: none; cursor: pointer; transition: filter 0.2s; }
.hs-btn:hover { filter: brightness(1.06); }

/* ── Install App button ─────────────────────────────────────── */
.btn-install {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 11px; border-radius: 9999px;
  border: 1px solid rgba(0,255,157,0.35);
  background: rgba(0,255,157,0.1);
  color: #00ff9d; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.08em; cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
  white-space: nowrap; flex-shrink: 0;
}
.btn-install:hover { background: rgba(0,255,157,0.18); border-color: rgba(0,255,157,0.55); }
.install-label { display: none; }
@media (min-width: 360px) { .install-label { display: inline; } }

/* ── Subscribe button ───────────────────────────────────────── */
.btn-subscribe {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 12px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.68); font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.08em; cursor: pointer; transition: background 0.2s, color 0.2s;
  white-space: nowrap; flex-shrink: 0;
}
.btn-subscribe:hover { background: rgba(255,255,255,0.09); color: #fff; }
.sub-label { display: none; }
@media (min-width: 380px) { .sub-label { display: inline; } }

/* ── Login button ───────────────────────────────────────────── */
.btn-login {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 9999px;
  border: 1px solid rgba(255,255,255,0.1); background: transparent;
  color: rgba(255,255,255,0.65); font-size: 0.65rem; font-weight: 700;
  letter-spacing: 0.1em; cursor: pointer; transition: background 0.2s, color 0.2s;
  white-space: nowrap; flex-shrink: 0;
}
.btn-login:hover { background: rgba(255,255,255,0.07); color: #fff; }
.login-label { display: none; }
@media (min-width: 360px) { .login-label { display: inline; } }

/* ── User menu ──────────────────────────────────────────────── */
.user-menu { position: relative; }
.user-btn { display: flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 9999px; border: 1px solid rgba(0,255,157,0.25); background: rgba(0,255,157,0.07); cursor: pointer; transition: background 0.15s; }
.user-btn:hover { background: rgba(0,255,157,0.12); }
.user-avatar { width: 22px; height: 22px; border-radius: 50%; background: linear-gradient(135deg, #00ff9d, #00d4ff); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; color: #021a10; flex-shrink: 0; }
.user-name-short { font-size: 0.67rem; font-weight: 600; color: rgba(255,255,255,0.8); max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-dropdown {
  position: absolute; top: calc(100% + 6px); right: 0;
  min-width: 180px; background: rgba(7,14,10,0.98); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 8px; box-shadow: 0 12px 32px rgba(0,0,0,0.5); z-index: 200;
}
.dropdown-email { font-size: 0.68rem; color: rgba(255,255,255,0.38); padding: 4px 8px 8px; border-bottom: 1px solid rgba(255,255,255,0.06); margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dropdown-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 10px; border-radius: 8px; background: transparent; border: none; color: #f87171; font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.dropdown-item:hover { background: rgba(220,38,38,0.1); }

/* ── Mobile bottom navigation bar ──────────────────────────── */
@media (min-width: 1024px) {
  .mobile-bottom-nav { display: none !important; }
}

.mobile-bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
  display: flex;
  align-items: stretch;
  height: 60px;
  background: rgba(5, 10, 7, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-bottom: env(safe-area-inset-bottom);
}
.mob-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  text-decoration: none;
  color: rgba(255,255,255,0.38);
  transition: color 0.15s;
  padding: 6px 2px;
  min-width: 0;
}
.mob-nav-item:hover { color: rgba(255,255,255,0.7); }
.mob-nav-item--active { color: #00ff9d; }
.mob-nav-item--admin { color: rgba(255,166,0,0.6); }
.mob-nav-item--admin.mob-nav-item--active { color: #ffa600; }
.mob-nav-icon { width: 20px; height: 20px; flex-shrink: 0; }
.mob-nav-label { font-size: 0.52rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
</style>
