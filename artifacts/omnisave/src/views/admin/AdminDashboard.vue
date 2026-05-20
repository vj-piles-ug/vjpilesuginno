<template>
  <div class="admin-wrap">
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
    </main>
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
  { id: 'overview',   label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>' },
  { id: 'users',      label: 'Users',     icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
  { id: 'carousel',   label: 'Carousel',  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { id: 'movies',     label: 'Movies',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/></svg>' },
  { id: 'series',     label: 'Series',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { id: 'animation',  label: 'Animation', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M9.5 8.5L16 12l-6.5 3.5V8.5z" fill="currentColor"/></svg>' },
  { id: 'wallet',     label: 'Wallet',    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
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
  { label: 'Manage Movies',   desc: 'Add, edit, or delete movies',     tab: 'movies',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>' },
  { label: 'Manage Series',   desc: 'Add series with episodes',         tab: 'series',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { label: 'Animation',       desc: 'Upload animated content',          tab: 'animation', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="rgba(167,139,250,0.3)"/></svg>' },
  { label: 'Manage Carousel', desc: 'Update featured banners',          tab: 'carousel',  icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { label: 'Manage Users',    desc: 'View & activate subscriptions',    tab: 'users',     icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { label: 'Payment Wallet',  desc: 'View payment history',             tab: 'wallet',    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
]
</script>

<style scoped>
.admin-wrap { min-height: 100vh; background: #050c08; display: flex; flex-direction: column; }
.admin-topnav { display: flex; align-items: stretch; background: rgba(0,0,0,0.6); border-bottom: 1px solid rgba(255,255,255,0.07); overflow-x: auto; scrollbar-width: none; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(14px); }
.admin-topnav::-webkit-scrollbar { display: none; }
.topnav-back { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 12px 18px; color: rgba(255,255,255,0.5); font-size: 0.72rem; font-weight: 600; text-decoration: none; transition: color 0.15s, background 0.15s; white-space: nowrap; flex-shrink: 0; }
.topnav-back:hover { color: #00ff9d; background: rgba(0,255,157,0.05); }
.topnav-divider { width: 1px; background: rgba(255,255,255,0.1); margin: 8px 0; flex-shrink: 0; }
.topnav-item { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; padding: 12px 20px; border: none; background: transparent; color: rgba(255,255,255,0.45); font-size: 0.72rem; font-weight: 600; cursor: pointer; letter-spacing: 0.03em; transition: color 0.15s, background 0.15s; white-space: nowrap; border-bottom: 2px solid transparent; min-width: 72px; }
.topnav-item:hover { color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.04); }
.topnav-item.active { color: #00ff9d; border-bottom-color: #00ff9d; background: rgba(0,255,157,0.06); }
.topnav-icon { display: flex; align-items: center; }
.topnav-label { font-size: 0.68rem; }
.admin-content { flex: 1; min-width: 0; }
.tab-page { padding: 28px 24px; }
.ov-header { margin-bottom: 24px; }
.ov-title { font-size: 1.7rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.ov-sub { font-size: 0.83rem; color: rgba(255,255,255,0.4); }
.stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; margin-bottom: 28px; }
.stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px 16px; cursor: pointer; transition: border-color 0.2s, background 0.2s, transform 0.15s; display: flex; flex-direction: column; gap: 8px; }
.stat-card:hover { border-color: rgba(0,255,157,0.2); background: rgba(0,255,157,0.03); transform: translateY(-2px); }
.stat-icon { display: flex; align-items: center; }
.stat-val { font-size: 2.2rem; font-weight: 900; color: #fff; line-height: 1; }
.stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); font-weight: 600; }
.qa-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 24px; }
.qa-title { font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 18px; }
.qa-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.qa-btn { display: flex; align-items: center; gap: 14px; padding: 16px 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; cursor: pointer; text-align: left; transition: background 0.2s, border-color 0.2s, transform 0.15s; }
.qa-btn:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.14); transform: translateY(-1px); }
.qa-icon { flex-shrink: 0; display: flex; align-items: center; }
.qa-text { display: flex; flex-direction: column; gap: 2px; }
.qa-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
.qa-desc { font-size: 0.72rem; color: rgba(255,255,255,0.4); }
@media (max-width: 900px) { .qa-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .tab-page { padding: 16px 12px; } .qa-grid { grid-template-columns: 1fr; } .stat-grid { grid-template-columns: repeat(2, 1fr); } .topnav-item { padding: 10px 12px; min-width: 60px; } }
</style>
