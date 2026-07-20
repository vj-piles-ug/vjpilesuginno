<template>
  <div class="admin-wrap">
    <!-- Top nav — hidden on mobile, shown on desktop -->
    <nav class="admin-topnav">
      <a href="/" class="topnav-back" title="Back to website">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span class="topnav-label">Site</span>
      </a>
      <div class="topnav-divider"></div>
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="activeTab = item.id"
        :class="['topnav-item', { active: activeTab === item.id }]"
      >
        <span class="topnav-icon" v-html="item.icon"></span>
        <span class="topnav-label">{{ item.label }}</span>
      </button>
    </nav>

    <!-- Mobile top mini-bar (just title + back link) -->
    <div class="admin-mobile-topbar">
      <a href="/" class="mob-back-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </a>
      <span class="mob-topbar-title">Admin</span>
      <img src="/logo.png" alt="" class="mob-topbar-logo" />
    </div>

    <main class="admin-content">
      <div v-if="activeTab === 'overview'" class="tab-page">
        <div class="ov-header">
          <h1 class="ov-title">Admin Dashboard</h1>
          <p class="ov-sub">Welcome back, okotstephen57@gmail.com</p>
        </div>

        <div class="stat-grid">
          <div class="stat-card" v-for="c in statCards" :key="c.label" @click="activeTab = c.tab">
            <div class="stat-icon" v-html="c.icon"></div>
            <div class="stat-val">{{ c.val }}</div>
            <div class="stat-label">{{ c.label }}</div>
          </div>
        </div>

        <div class="qa-section">
          <h2 class="qa-title">Quick Actions</h2>
          <div class="qa-grid">
            <button v-for="a in quickActions" :key="a.tab" class="qa-btn" @click="activeTab = a.tab">
              <span class="qa-icon" v-html="a.icon"></span>
              <div class="qa-text">
                <span class="qa-name">{{ a.label }}</span>
                <span class="qa-desc">{{ a.desc }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AdminUsersTab v-else-if="activeTab === 'users'" />
      <AdminCarouselTab v-else-if="activeTab === 'carousel'" />
      <AdminMoviesTab v-else-if="activeTab === 'movies'" />
      <AdminSeriesTab v-else-if="activeTab === 'series'" />
      <AdminAnimationTab v-else-if="activeTab === 'animation'" />
      <AdminTransactionsTab v-else-if="activeTab === 'wallet'" />
      <AdminActivitiesTab v-else-if="activeTab === 'activities'" />
      <AdminSubscriptionTab v-else-if="activeTab === 'subscriptions'" />
    </main>

    <!-- Mobile bottom nav — admin tabs -->
    <nav class="admin-mob-nav">
      <button
        v-for="item in mobNavItems"
        :key="item.id"
        @click="activeTab = item.id"
        :class="['amob-item', { active: activeTab === item.id }]"
      >
        <span class="amob-icon" v-html="item.icon"></span>
        <span class="amob-label">{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ref as dbRef, get } from 'firebase/database'
import { db } from '../../lib/firebase'
import { isAdmin } from '../../store/auth'
import { dbMovies, dbSeries, dbAnimation, dbCarousel } from '../../store/db'
import AdminUsersTab from './AdminUsersTab.vue'
import AdminCarouselTab from './AdminCarouselTab.vue'
import AdminMoviesTab from './AdminMoviesTab.vue'
import AdminSeriesTab from './AdminSeriesTab.vue'
import AdminAnimationTab from './AdminAnimationTab.vue'
import AdminTransactionsTab from './AdminTransactionsTab.vue'
import AdminActivitiesTab from './AdminActivitiesTab.vue'
import AdminSubscriptionTab from './AdminSubscriptionTab.vue'

const activeTab = ref('overview')

// Counts fetched directly after auth — not from module-level store
const userCount = ref(0)
const paymentCount = ref(0)

async function loadOverviewCounts() {
  if (!isAdmin.value) return
  try {
    const [usersSnap, logsSnap, subsSnap] = await Promise.all([
      get(dbRef(db, 'users')),
      get(dbRef(db, 'paymentLogs')),
      get(dbRef(db, 'subscriptions')),
    ])
    userCount.value = usersSnap.exists() ? Object.keys(usersSnap.val()).length : 0
    // Merge paymentLogs + subscriptions (same logic as wallet tab)
    const logsKeys = new Set(logsSnap.exists() ? Object.keys(logsSnap.val()) : [])
    let subsExtra = 0
    if (subsSnap.exists()) {
      for (const [uid, v] of Object.entries(subsSnap.val() as Record<string, any>)) {
        const tid = v.orderTrackingId || `sub-${uid}`
        if (!logsKeys.has(tid)) subsExtra++
      }
    }
    paymentCount.value = logsKeys.size + subsExtra
  } catch (_) {}
}

watch(isAdmin, (val) => { if (val) loadOverviewCounts() }, { immediate: false })
onMounted(() => { if (isAdmin.value) loadOverviewCounts() })

const navItems = [
  { id: 'overview',       label: 'Dashboard',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>' },
  { id: 'users',          label: 'Users',        icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
  { id: 'carousel',       label: 'Carousel',     icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { id: 'movies',         label: 'Movies',       icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/></svg>' },
  { id: 'series',         label: 'Series',       icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { id: 'animation',      label: 'Animation',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M9.5 8.5L16 12l-6.5 3.5V8.5z" fill="currentColor"/></svg>' },
  { id: 'wallet',         label: 'Wallet',       icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
  { id: 'activities',     label: 'Activities',   icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { id: 'subscriptions',  label: 'Sub Plans',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/><circle cx="17" cy="15" r="3" fill="none"/><path d="M17 13v2l1 1"/></svg>' },
]

const mobNavItems = [
  { id: 'overview',      label: 'Home',      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>' },
  { id: 'movies',        label: 'Movies',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>' },
  { id: 'series',        label: 'Series',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { id: 'animation',     label: 'Anime',     icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.5 8.5L16 12l-6.5 3.5V8.5z" fill="currentColor"/></svg>' },
  { id: 'users',         label: 'Users',     icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { id: 'wallet',        label: 'Wallet',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
  { id: 'activities',    label: 'Activity',  icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { id: 'subscriptions', label: 'Sub Plans', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
]

const statCards = computed(() => [
  { label: 'Total Users',    val: userCount.value,           tab: 'users',     icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
  { label: 'Total Movies',   val: dbMovies.value.length,     tab: 'movies',    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>' },
  { label: 'Total Series',   val: dbSeries.value.length,     tab: 'series',    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { label: 'Animation',      val: dbAnimation.value.length,  tab: 'animation', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="rgba(167,139,250,0.3)"/></svg>' },
  { label: 'Carousel Items', val: dbCarousel.value.length,   tab: 'carousel',  icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { label: 'Payments',       val: paymentCount.value,        tab: 'wallet',    icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
])

const quickActions = [
  { label: 'Manage Movies',    desc: 'Add, edit, or delete movies',          tab: 'movies',        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>' },
  { label: 'Manage Series',    desc: 'Add series with episodes',              tab: 'series',        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { label: 'Animation',        desc: 'Upload animated content',               tab: 'animation',     icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="rgba(167,139,250,0.3)"/></svg>' },
  { label: 'Manage Carousel',  desc: 'Update featured banners',               tab: 'carousel',      icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { label: 'Manage Users',     desc: 'View & activate subscriptions',         tab: 'users',         icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { label: 'Payment Wallet',   desc: 'View payment history',                  tab: 'wallet',        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
  { label: 'User Activities',  desc: 'Track all user clicks & actions',       tab: 'activities',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb923c" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' },
  { label: 'Sub Plans',        desc: 'Manage subscription plans & prices',    tab: 'subscriptions', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e879f9" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
]
</script>

<style scoped>
.admin-wrap { min-height: 100vh; background: #050c08; display: flex; flex-direction: column; }

/* ── Desktop top nav (hidden on mobile) ── */
.admin-topnav { display: none; }
@media (min-width: 1024px) {
  .admin-topnav { display: flex; align-items: stretch; background: rgba(0,0,0,0.6); border-bottom: 1px solid rgba(255,255,255,0.07); overflow-x: auto; scrollbar-width: none; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(14px); }
  .admin-topnav::-webkit-scrollbar { display: none; }
}
.topnav-back { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 12px 18px; color: rgba(255,255,255,0.5); font-size: 0.72rem; font-weight: 600; text-decoration: none; transition: color 0.15s, background 0.15s; white-space: nowrap; flex-shrink: 0; }
.topnav-back:hover { color: #00ff9d; background: rgba(0,255,157,0.05); }
.topnav-divider { width: 1px; background: rgba(255,255,255,0.1); margin: 8px 0; flex-shrink: 0; }
.topnav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 12px 20px; border: none; background: transparent; color: rgba(255,255,255,0.45); font-size: 0.72rem; font-weight: 600; cursor: pointer; letter-spacing: 0.03em; transition: color 0.15s, background 0.15s; white-space: nowrap; border-bottom: 2px solid transparent; min-width: 72px; }
.topnav-item:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
.topnav-item.active { color: #00ff9d; border-bottom-color: #00ff9d; background: rgba(0,255,157,0.06); }
.topnav-icon { display: flex; align-items: center; }
.topnav-label { font-size: 0.68rem; }

/* ── Mobile top mini-bar ── */
.admin-mobile-topbar { display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(0,0,0,0.7); border-bottom: 1px solid rgba(255,255,255,0.08); position: sticky; top: 0; z-index: 100; backdrop-filter: blur(14px); }
@media (min-width: 1024px) { .admin-mobile-topbar { display: none; } }
.mob-back-link { display: flex; align-items: center; gap: 5px; color: rgba(255,255,255,0.5); font-size: 0.72rem; font-weight: 600; text-decoration: none; padding: 4px 8px; border-radius: 7px; border: 1px solid rgba(255,255,255,0.1); transition: color 0.15s; }
.mob-back-link:hover { color: #00ff9d; }
.mob-topbar-title { font-size: 0.85rem; font-weight: 800; color: #fff; letter-spacing: 0.05em; }
.mob-topbar-logo { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }

/* ── Content ── */
.admin-content { flex: 1; min-width: 0; padding-bottom: 70px; }
@media (min-width: 1024px) { .admin-content { padding-bottom: 0; } }

/* ── Overview tab ── */
.tab-page { padding: 14px 10px 16px; }
@media (min-width: 640px) { .tab-page { padding: 20px 18px; } }
@media (min-width: 1024px) { .tab-page { padding: 28px 24px; } }
.ov-header { margin-bottom: 14px; }
@media (min-width: 640px) { .ov-header { margin-bottom: 20px; } }
.ov-title { font-size: 1.2rem; font-weight: 900; color: #fff; margin-bottom: 3px; }
@media (min-width: 640px) { .ov-title { font-size: 1.5rem; } }
@media (min-width: 1024px) { .ov-title { font-size: 1.7rem; } }
.ov-sub { font-size: 0.7rem; color: rgba(255,255,255,0.4); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
@media (min-width: 640px) { .ov-sub { font-size: 0.83rem; } }

.stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; }
@media (min-width: 640px) { .stat-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px; } }
@media (min-width: 1024px) { .stat-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; margin-bottom: 28px; } }
.stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 8px; cursor: pointer; transition: border-color 0.2s, background 0.2s, transform 0.15s; display: flex; flex-direction: column; gap: 4px; }
@media (min-width: 640px) { .stat-card { border-radius: 12px; padding: 14px 12px; gap: 6px; } }
@media (min-width: 1024px) { .stat-card { border-radius: 14px; padding: 20px 16px; gap: 8px; } }
.stat-card:hover { border-color: rgba(0,255,157,0.2); background: rgba(0,255,157,0.03); transform: translateY(-2px); }
.stat-icon { display: flex; align-items: center; }
.stat-val { font-size: 1.4rem; font-weight: 900; color: #fff; line-height: 1; }
@media (min-width: 640px) { .stat-val { font-size: 1.8rem; } }
@media (min-width: 1024px) { .stat-val { font-size: 2.2rem; } }
.stat-label { font-size: 0.58rem; color: rgba(255,255,255,0.4); font-weight: 600; }
@media (min-width: 640px) { .stat-label { font-size: 0.68rem; } }
@media (min-width: 1024px) { .stat-label { font-size: 0.72rem; } }

.qa-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 14px 10px; }
@media (min-width: 640px) { .qa-section { border-radius: 14px; padding: 18px; } }
@media (min-width: 1024px) { .qa-section { border-radius: 16px; padding: 24px; } }
.qa-title { font-size: 0.85rem; font-weight: 800; color: #fff; margin-bottom: 10px; }
@media (min-width: 640px) { .qa-title { font-size: 0.95rem; margin-bottom: 14px; } }
@media (min-width: 1024px) { .qa-title { font-size: 1rem; margin-bottom: 18px; } }
.qa-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 7px; }
@media (min-width: 640px) { .qa-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
@media (min-width: 900px) { .qa-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; } }
.qa-btn { display: flex; align-items: center; gap: 8px; padding: 10px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; cursor: pointer; text-align: left; transition: background 0.2s, border-color 0.2s, transform 0.15s; }
@media (min-width: 640px) { .qa-btn { gap: 12px; padding: 14px 14px; border-radius: 11px; } }
@media (min-width: 1024px) { .qa-btn { gap: 14px; padding: 16px 18px; border-radius: 12px; } }
.qa-btn:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); transform: translateY(-1px); }
.qa-icon { flex-shrink: 0; display: flex; align-items: center; }
.qa-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.qa-name { font-size: 0.72rem; font-weight: 700; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (min-width: 640px) { .qa-name { font-size: 0.82rem; } }
@media (min-width: 1024px) { .qa-name { font-size: 0.85rem; } }
.qa-desc { font-size: 0.6rem; color: rgba(255,255,255,0.4); display: none; }
@media (min-width: 480px) { .qa-desc { display: block; } }
@media (min-width: 640px) { .qa-desc { font-size: 0.68rem; } }
@media (min-width: 1024px) { .qa-desc { font-size: 0.72rem; } }

/* ── Admin mobile bottom nav ── */
.admin-mob-nav {
  display: flex; align-items: stretch; position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
  height: 60px; background: rgba(5,10,7,0.97); backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255,255,255,0.09);
  padding-bottom: env(safe-area-inset-bottom);
}
@media (min-width: 1024px) { .admin-mob-nav { display: none; } }
.amob-item {
  flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 2px; border: none; background: transparent; color: rgba(255,255,255,0.35);
  font-size: 0; cursor: pointer; padding: 6px 2px; transition: color 0.15s; min-width: 0;
}
.amob-item:hover { color: rgba(255,255,255,0.65); }
.amob-item.active { color: #00ff9d; }
.amob-icon { display: flex; align-items: center; flex-shrink: 0; }
.amob-label { font-size: 0.48rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; color: inherit; }
</style>
