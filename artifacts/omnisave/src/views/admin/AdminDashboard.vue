<template>
  <div class="admin-layout">
    <!-- Mobile menu toggle -->
    <button class="mobile-toggle" @click="sidebarOpen = !sidebarOpen">
      <span v-if="!sidebarOpen">☰</span>
      <span v-else>✕</span>
    </button>

    <!-- Sidebar overlay (mobile) -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ open: sidebarOpen }">
      <!-- Brand -->
      <div class="sidebar-brand">
        <div class="brand-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        </div>
        <div>
          <div class="brand-name">VJ PILES UG</div>
          <div class="brand-sub">Admin Panel</div>
        </div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="activeTab = item.id; sidebarOpen = false"
          :class="['nav-item', { active: activeTab === item.id }]"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span>{{ item.label }}</span>
          <span v-if="item.count !== undefined" class="nav-count">{{ item.count }}</span>
        </button>
      </nav>

      <!-- Stats quick view -->
      <div class="sidebar-stats">
        <div class="stat-row"><span class="stat-label">Movies</span><span class="stat-val">{{ adminStore.movies.length }}</span></div>
        <div class="stat-row"><span class="stat-label">Series</span><span class="stat-val">{{ adminStore.series.length }}</span></div>
        <div class="stat-row"><span class="stat-label">Active Users</span><span class="stat-val green">{{ activeUsers }}</span></div>
        <div class="stat-row"><span class="stat-label">Blocked</span><span class="stat-val red">{{ blockedUsers }}</span></div>
      </div>

      <!-- Back link -->
      <div class="sidebar-footer">
        <RouterLink to="/" class="back-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          Back to Site
        </RouterLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="admin-main">
      <!-- Overview -->
      <div v-if="activeTab === 'overview'" class="tab-page">
        <div class="overview-header">
          <h1 class="ov-title">Dashboard Overview</h1>
          <p class="ov-sub">Welcome back, Admin</p>
        </div>
        <div class="stat-cards">
          <div class="stat-card" v-for="c in statCards" :key="c.label" @click="activeTab = c.tab">
            <div class="sc-icon" v-html="c.icon"></div>
            <div class="sc-val">{{ c.val }}</div>
            <div class="sc-label">{{ c.label }}</div>
          </div>
        </div>
        <div class="ov-sections">
          <div class="ov-box">
            <h2 class="ov-box-title">Recent Uploads</h2>
            <div class="mini-list">
              <div v-for="m in recentMovies" :key="m.id" class="mini-item">
                <span class="mini-dot" :class="typeDotCls(m.type)"></span>
                <span class="mini-title">{{ m.title }}</span>
                <span class="mini-date">{{ m.createdAt }}</span>
              </div>
              <div v-if="recentMovies.length === 0" class="mini-empty">No uploads yet</div>
            </div>
          </div>
          <div class="ov-box">
            <h2 class="ov-box-title">Recent Activity</h2>
            <div class="mini-list">
              <div v-for="a in recentActivity" :key="a.id" class="mini-item">
                <div class="mini-avatar">{{ a.userName[0] }}</div>
                <div class="mini-info">
                  <span class="mini-title">{{ a.userName }}</span>
                  <span class="mini-sub">{{ a.title }}</span>
                </div>
                <span class="mini-date">{{ a.watchedAt.split(' ')[0] }}</span>
              </div>
              <div v-if="recentActivity.length === 0" class="mini-empty">No activity yet</div>
            </div>
          </div>
        </div>
      </div>

      <AdminMoviesTab v-else-if="activeTab === 'movies'" />
      <AdminSeriesTab v-else-if="activeTab === 'series'" />
      <AdminUsersTab v-else-if="activeTab === 'users'" />
      <AdminActivitiesTab v-else-if="activeTab === 'activities'" />
      <AdminHeroSlidesTab v-else-if="activeTab === 'heroSlides'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { adminStore } from '../../store/admin'
import AdminMoviesTab from './AdminMoviesTab.vue'
import AdminSeriesTab from './AdminSeriesTab.vue'
import AdminUsersTab from './AdminUsersTab.vue'
import AdminActivitiesTab from './AdminActivitiesTab.vue'
import AdminHeroSlidesTab from './AdminHeroSlidesTab.vue'

const activeTab = ref('overview')
const sidebarOpen = ref(false)

const activeUsers = computed(() => adminStore.users.filter(u => u.status === 'active').length)
const blockedUsers = computed(() => adminStore.users.filter(u => u.status === 'blocked').length)

const navItems = computed(() => [
  { id: 'overview',    label: 'Overview',    count: undefined,                       icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { id: 'movies',      label: 'Movies',      count: adminStore.movies.length,        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/></svg>' },
  { id: 'series',      label: 'Series',      count: adminStore.series.length,        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12l-2-5z"/></svg>' },
  { id: 'users',       label: 'Users',       count: adminStore.users.length,         icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
  { id: 'activities',  label: 'Activities',  count: adminStore.activities.length,    icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { id: 'heroSlides',  label: 'Hero Slides', count: adminStore.heroSlides.length,    icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="5" width="22" height="14" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' },
])

const statCards = computed(() => [
  { label: 'Total Movies', val: adminStore.movies.length, tab: 'movies', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>' },
  { label: 'Total Series', val: adminStore.series.length, tab: 'series', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffa600" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { label: 'Active Users', val: activeUsers.value, tab: 'users', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { label: 'Blocked Users', val: blockedUsers.value, tab: 'users', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>' },
  { label: 'Watch Events', val: adminStore.activities.length, tab: 'activities', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d08aff" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { label: 'Hero Slides', val: adminStore.heroSlides.length, tab: 'heroSlides', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4db8ff" stroke-width="2"><rect x="1" y="5" width="22" height="14" rx="2"/></svg>' },
])

const recentMovies = computed(() => [...adminStore.movies].sort((a, b) => b.id - a.id).slice(0, 5))
const recentActivity = computed(() => [...adminStore.activities].sort((a, b) => b.id - a.id).slice(0, 5))

function typeDotCls(t: string) {
  if (t === 'MOVIES') return 'dot-movie'
  if (t === 'TV SERIES') return 'dot-series'
  return 'dot-anim'
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #050c08;
  position: relative;
}

/* SIDEBAR */
.admin-sidebar {
  width: 230px;
  flex-shrink: 0;
  background: rgba(0,0,0,0.5);
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 18px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.brand-icon {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  background: linear-gradient(135deg, #00ff9d, #00c8b8, #00d4ff);
  display: flex; align-items: center; justify-content: center;
}
.brand-name { font-size: 0.82rem; font-weight: 900; color: #fff; letter-spacing: 0.06em; line-height: 1.1; }
.brand-sub { font-size: 0.62rem; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; text-transform: uppercase; }

.sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 14px 10px; flex: 1; }
.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; border-radius: 10px; border: none;
  background: transparent; color: rgba(255,255,255,0.5);
  font-size: 0.8rem; font-weight: 600; cursor: pointer;
  transition: all 0.15s; text-align: left; width: 100%;
}
.nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.85); }
.nav-item.active { background: rgba(0,255,157,0.1); color: #00ff9d; border: 1px solid rgba(0,255,157,0.15); }
.nav-icon { flex-shrink: 0; display: flex; align-items: center; }
.nav-count { margin-left: auto; background: rgba(255,255,255,0.1); border-radius: 9999px; padding: 1px 7px; font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.5); }
.nav-item.active .nav-count { background: rgba(0,255,157,0.15); color: #00ff9d; }

.sidebar-stats { padding: 12px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
.stat-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; }
.stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.35); }
.stat-val { font-size: 0.78rem; font-weight: 700; color: rgba(255,255,255,0.7); }
.stat-val.green { color: #00ff9d; }
.stat-val.red { color: #f87171; }

.sidebar-footer { padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.06); }
.back-btn {
  display: flex; align-items: center; gap: 7px;
  color: rgba(255,255,255,0.4); font-size: 0.78rem; font-weight: 600;
  text-decoration: none; transition: color 0.15s; padding: 6px 0;
}
.back-btn:hover { color: rgba(255,255,255,0.8); }

/* MAIN */
.admin-main {
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}

/* OVERVIEW */
.tab-page { padding: 28px 24px; }
.overview-header { margin-bottom: 24px; }
.ov-title { font-size: 1.6rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.ov-sub { font-size: 0.85rem; color: rgba(255,255,255,0.4); }

.stat-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; margin-bottom: 28px; }
.stat-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px; padding: 20px 18px; cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  display: flex; flex-direction: column; gap: 6px;
}
.stat-card:hover { border-color: rgba(0,255,157,0.2); background: rgba(0,255,157,0.03); }
.sc-icon { margin-bottom: 4px; }
.sc-val { font-size: 2rem; font-weight: 900; color: #fff; line-height: 1; }
.sc-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

.ov-sections { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ov-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 20px; }
.ov-box-title { font-size: 0.88rem; font-weight: 700; color: rgba(255,255,255,0.7); margin-bottom: 14px; }
.mini-list { display: flex; flex-direction: column; gap: 10px; }
.mini-item { display: flex; align-items: center; gap: 10px; }
.mini-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot-movie { background: #00ff9d; }
.dot-series { background: #ffa600; }
.dot-anim { background: #d08aff; }
.mini-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #00ff9d, #00d4ff); display: flex; align-items: center; justify-content: center; font-size: 0.68rem; font-weight: 800; color: #021a10; flex-shrink: 0; }
.mini-info { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.mini-title { font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.8); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-sub { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
.mini-date { font-size: 0.7rem; color: rgba(255,255,255,0.3); white-space: nowrap; }
.mini-empty { font-size: 0.8rem; color: rgba(255,255,255,0.2); text-align: center; padding: 12px 0; }

/* MOBILE */
.mobile-toggle {
  display: none;
  position: fixed; top: 14px; left: 14px; z-index: 1000;
  width: 38px; height: 38px; border-radius: 10px;
  background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.15);
  color: #fff; font-size: 1.1rem; cursor: pointer;
  align-items: center; justify-content: center;
  backdrop-filter: blur(12px);
}
.sidebar-overlay { display: none; }

@media (max-width: 768px) {
  .admin-sidebar {
    position: fixed; left: -240px; top: 0; bottom: 0; z-index: 999;
    width: 230px; transition: left 0.25s ease;
  }
  .admin-sidebar.open { left: 0; }
  .mobile-toggle { display: flex; }
  .sidebar-overlay { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 998; backdrop-filter: blur(2px); }
  .tab-page { padding: 60px 14px 24px; }
  .ov-sections { grid-template-columns: 1fr; }
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
}
</style>
