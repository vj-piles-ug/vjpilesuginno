<template>
  <div class="admin-wrap">
    <!-- Top Nav Bar -->
    <nav class="admin-topnav">
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

    <!-- Main Content -->
    <main class="admin-content">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="tab-page">
        <div class="ov-header">
          <h1 class="ov-title">Admin Dashboard</h1>
          <p class="ov-sub">Welcome back, admin@vjpilesug.com</p>
        </div>

        <!-- Stat Cards -->
        <div class="stat-grid">
          <div class="stat-card" v-for="c in statCards" :key="c.label" @click="activeTab = c.tab">
            <div class="stat-icon" v-html="c.icon"></div>
            <div class="stat-val">{{ c.val }}</div>
            <div class="stat-label">{{ c.label }}</div>
          </div>
        </div>

        <!-- Quick Actions -->
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
      <AdminOriginalsTab v-else-if="activeTab === 'originals'" />
      <AdminAnimationTab v-else-if="activeTab === 'animation'" />
      <AdminMusicTab v-else-if="activeTab === 'music'" />
      <AdminTransactionsTab v-else-if="activeTab === 'wallet'" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminStore } from '../../store/admin'
import AdminUsersTab from './AdminUsersTab.vue'
import AdminCarouselTab from './AdminCarouselTab.vue'
import AdminMoviesTab from './AdminMoviesTab.vue'
import AdminSeriesTab from './AdminSeriesTab.vue'
import AdminOriginalsTab from './AdminOriginalsTab.vue'
import AdminAnimationTab from './AdminAnimationTab.vue'
import AdminMusicTab from './AdminMusicTab.vue'
import AdminTransactionsTab from './AdminTransactionsTab.vue'

const activeTab = ref('overview')

const navItems = [
  { id: 'overview', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>' },
  { id: 'users', label: 'Users', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
  { id: 'carousel', label: 'Carousel', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { id: 'movies', label: 'Movies', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/></svg>' },
  { id: 'series', label: 'Series', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { id: 'originals', label: 'Originals', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { id: 'animation', label: 'Animation', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M9.5 8.5L16 12l-6.5 3.5V8.5z" fill="currentColor"/></svg>' },
  { id: 'music', label: 'Music', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { id: 'wallet', label: 'Wallet', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
]

const totalUsers = computed(() => adminStore.users.length)
const activeUsers = computed(() => adminStore.users.filter(u => u.status === 'active').length)
const successfulTx = computed(() => adminStore.transactions.filter(t => t.status === 'Successful').length)

const statCards = computed(() => [
  { label: 'Total Users', val: totalUsers.value, tab: 'users', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>' },
  { label: 'Total Movies', val: adminStore.movies.length, tab: 'movies', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>' },
  { label: 'Total Series', val: adminStore.series.length, tab: 'series', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { label: 'Total Originals', val: 0, tab: 'originals', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { label: 'Music Videos', val: 0, tab: 'music', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { label: 'Carousel Items', val: adminStore.carouselItems.length, tab: 'carousel', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { label: 'Payments', val: successfulTx.value, tab: 'wallet', icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
])

const quickActions = [
  { label: 'Manage Movies', desc: 'Add, edit, or delete movies', tab: 'movies', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20"/></svg>' },
  { label: 'Manage Series', desc: 'Add series with episodes', tab: 'series', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><rect x="2" y="7" width="20" height="15" rx="2"/><path d="M16 2H8l-2 5h12z"/></svg>' },
  { label: 'Manage Originals', desc: 'Upload exclusive content', tab: 'originals', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { label: 'Manage Music', desc: 'Upload music videos', tab: 'music', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>' },
  { label: 'Manage Carousel', desc: 'Update featured banners', tab: 'carousel', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><rect x="1" y="6" width="22" height="13" rx="2"/><path d="M1 10h22"/></svg>' },
  { label: 'Manage Users', desc: 'View user activity', tab: 'users', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>' },
  { label: 'Payment Wallet', desc: 'View payment history', tab: 'wallet', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' },
]
</script>

<style scoped>
.admin-wrap {
  min-height: 100vh;
  background: #050c08;
  display: flex;
  flex-direction: column;
}

/* TOP NAV */
.admin-topnav {
  display: flex;
  align-items: stretch;
  background: rgba(0,0,0,0.6);
  border-bottom: 1px solid rgba(255,255,255,0.07);
  overflow-x: auto;
  scrollbar-width: none;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(14px);
}
.admin-topnav::-webkit-scrollbar { display: none; }

.topnav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.45);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.03em;
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  min-width: 72px;
}
.topnav-item:hover {
  color: rgba(255,255,255,0.8);
  background: rgba(255,255,255,0.04);
}
.topnav-item.active {
  color: #00ff9d;
  border-bottom-color: #00ff9d;
  background: rgba(0,255,157,0.06);
}
.topnav-icon { display: flex; align-items: center; }
.topnav-label { font-size: 0.68rem; }

/* CONTENT */
.admin-content { flex: 1; min-width: 0; }
.tab-page { padding: 28px 24px; }

/* OVERVIEW */
.ov-header { margin-bottom: 24px; }
.ov-title { font-size: 1.7rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.ov-sub { font-size: 0.83rem; color: rgba(255,255,255,0.4); }

/* STAT GRID */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}
.stat-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 20px 16px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stat-card:hover {
  border-color: rgba(0,255,157,0.2);
  background: rgba(0,255,157,0.03);
  transform: translateY(-2px);
}
.stat-icon { display: flex; align-items: center; }
.stat-val { font-size: 2.2rem; font-weight: 900; color: #fff; line-height: 1; }
.stat-label { font-size: 0.72rem; color: rgba(255,255,255,0.4); font-weight: 600; }

/* QUICK ACTIONS */
.qa-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 24px;
}
.qa-title { font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 18px; }
.qa-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.qa-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}
.qa-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.14);
  transform: translateY(-1px);
}
.qa-icon { flex-shrink: 0; display: flex; align-items: center; }
.qa-text { display: flex; flex-direction: column; gap: 2px; }
.qa-name { font-size: 0.85rem; font-weight: 700; color: #fff; }
.qa-desc { font-size: 0.72rem; color: rgba(255,255,255,0.4); }

@media (max-width: 900px) {
  .qa-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .tab-page { padding: 16px 12px; }
  .qa-grid { grid-template-columns: 1fr; }
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
  .topnav-item { padding: 10px 12px; min-width: 60px; }
}
</style>
