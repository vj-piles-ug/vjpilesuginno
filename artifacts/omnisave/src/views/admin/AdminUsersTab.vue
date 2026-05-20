<template>
  <div class="tab-page">
    <!-- Header -->
    <div class="tab-header">
      <h1 class="tab-title">Manage Users</h1>
      <div class="header-stats">
        <span class="hstat"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> Total Users: {{ adminStore.users.length }}</span>
        <span class="hstat green"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg> Active Users: {{ activeCount }}</span>
      </div>
    </div>

    <!-- Search -->
    <div class="search-row">
      <div class="search-wrap">
        <svg class="search-ic" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" placeholder="Search users by name or email..." class="search-input" />
      </div>
    </div>

    <!-- Users List -->
    <div class="users-list">
      <div v-for="u in filteredUsers" :key="u.id" class="user-card">
        <div class="user-top">
          <div class="user-left">
            <div class="user-avatar">{{ u.name[0].toUpperCase() }}</div>
            <div class="user-info">
              <p class="user-name">{{ u.name }}</p>
              <p class="user-email">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {{ u.email }}
              </p>
            </div>
          </div>
          <div class="user-actions">
            <span v-if="u.status === 'active'" class="badge-active">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/></svg>
              Active
            </span>
            <span v-else-if="u.status === 'blocked'" class="badge-blocked">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              Blocked
            </span>
            <span v-else class="badge-none">None</span>

            <template v-if="u.status === 'active'">
              <button class="btn-deactivate" @click="deactivate(u)">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Deactivate
              </button>
            </template>
            <template v-else-if="u.status === 'blocked'">
              <button class="btn-unblock" @click="unblock(u)">Unblock</button>
            </template>
          </div>
        </div>

        <div class="user-meta">
          <div class="meta-col">
            <span class="meta-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Created
            </span>
            <span class="meta-val">{{ u.joinedAt }}</span>
          </div>
          <div class="meta-col">
            <span class="meta-label">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Last Login
            </span>
            <span class="meta-val">{{ u.lastLogin || 'Never' }}</span>
          </div>
        </div>

        <!-- Subscription info (active users) -->
        <div v-if="u.status === 'active' && u.subscription" class="sub-box">
          <div class="sub-header-row">SUBSCRIPTION</div>
          <div class="sub-details">
            <div class="sub-col">
              <span class="sub-label">Plan</span>
              <span class="sub-val">{{ subLabel(u.subscription) }}</span>
            </div>
            <div class="sub-col">
              <span class="sub-label">Start</span>
              <span class="sub-val">{{ u.subStart || '—' }}</span>
            </div>
            <div class="sub-col">
              <span class="sub-label">Expires</span>
              <span class="sub-val">{{ u.subExpires || '—' }}</span>
            </div>
            <div class="sub-col">
              <span class="sub-label">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Remaining
              </span>
              <span class="sub-val">{{ calcRemaining(u.subExpires) }}</span>
            </div>
          </div>
        </div>

        <!-- Subscription buttons (inactive/blocked users) -->
        <div v-if="u.status !== 'active'" class="sub-btns">
          <button class="sub-btn btn-1d" @click="activate(u, '1-Day')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            1-Day
          </button>
          <button class="sub-btn btn-2d" @click="activate(u, '2-Days')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            2-Days
          </button>
          <button class="sub-btn btn-1w" @click="activate(u, '1-Week')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            1-Week
          </button>
          <button class="sub-btn btn-2w" @click="activate(u, '2-Weeks')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            2-Weeks
          </button>
          <button class="sub-btn btn-1m" @click="activate(u, '1-Month')">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            1-Month
          </button>
        </div>
      </div>

      <div v-if="filteredUsers.length === 0" class="empty">No users found.</div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminStore, type AdminUser, type SubDuration } from '../../store/admin'

const search = ref('')
const toast = ref('')

const activeCount = computed(() => adminStore.users.filter(u => u.status === 'active').length)

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return adminStore.users
  return adminStore.users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
})

function subLabel(sub: string) {
  const map: Record<string, string> = { '1-Day': '1 Day Pass', '2-Days': '2 Days Pass', '1-Week': '1 Week Pass', '2-Weeks': '2 Weeks Pass', '1-Month': '1 Month Pass' }
  return map[sub] || sub
}

function calcRemaining(expires: string | null): string {
  if (!expires) return '—'
  const diff = new Date(expires).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  return `${days}d ${hours}h`
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}

function activate(u: AdminUser, plan: SubDuration) {
  const now = new Date()
  const durations: Record<SubDuration, number> = { '1-Day': 1, '2-Days': 2, '1-Week': 7, '2-Weeks': 14, '1-Month': 30 }
  const exp = new Date(now.getTime() + durations[plan] * 86400000)
  u.status = 'active'
  u.subscription = plan
  u.subStart = now.toISOString().slice(0, 10)
  u.subExpires = exp.toISOString().slice(0, 10)
  showToast(`✓ ${u.name} activated with ${plan}`)
}

function deactivate(u: AdminUser) {
  u.status = 'inactive'
  u.subscription = null
  u.subStart = null
  u.subExpires = null
  showToast(`${u.name} subscription deactivated`)
}

function unblock(u: AdminUser) {
  u.status = 'inactive'
  showToast(`✓ ${u.name} unblocked`)
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; position: relative; }

.tab-header { margin-bottom: 18px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 8px; }
.header-stats { display: flex; gap: 20px; flex-wrap: wrap; }
.hstat { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.45); font-weight: 600; }
.hstat.green { color: #00ff9d; }

.search-row { margin-bottom: 20px; }
.search-wrap { position: relative; }
.search-ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
.search-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px 10px 36px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: rgba(0,255,157,0.4); }
.search-input::placeholder { color: rgba(255,255,255,0.25); }

.users-list { display: flex; flex-direction: column; gap: 12px; }

.user-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 16px 20px;
  transition: border-color 0.2s;
}
.user-card:hover { border-color: rgba(255,255,255,0.13); }

.user-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.user-left { display: flex; align-items: center; gap: 14px; }
.user-avatar {
  width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(0,255,157,0.2), rgba(0,212,255,0.2));
  border: 1px solid rgba(0,255,157,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; font-weight: 800; color: #00ff9d;
}
.user-name { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
.user-email { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: rgba(255,255,255,0.45); }

.user-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.badge-active { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.3); color: #00ff9d; font-size: 0.72rem; font-weight: 700; }
.badge-none { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; font-size: 0.72rem; font-weight: 700; }
.badge-blocked { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; background: rgba(100,100,100,0.15); border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); font-size: 0.72rem; font-weight: 700; }
.btn-deactivate { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 8px; background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.btn-deactivate:hover { background: rgba(220,38,38,0.22); }
.btn-unblock { padding: 5px 12px; border-radius: 8px; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.25); color: #00ff9d; font-size: 0.72rem; font-weight: 700; cursor: pointer; }

.user-meta { display: flex; gap: 32px; margin-bottom: 10px; flex-wrap: wrap; }
.meta-col { display: flex; flex-direction: column; gap: 2px; }
.meta-label { display: flex; align-items: center; gap: 5px; font-size: 0.68rem; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.meta-val { font-size: 0.8rem; color: rgba(255,255,255,0.7); font-weight: 600; }

.sub-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 12px 16px;
  margin-top: 10px;
}
.sub-header-row { font-size: 0.62rem; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 0.12em; margin-bottom: 10px; }
.sub-details { display: flex; gap: 24px; flex-wrap: wrap; }
.sub-col { display: flex; flex-direction: column; gap: 2px; }
.sub-label { display: flex; align-items: center; gap: 4px; font-size: 0.65rem; color: rgba(255,255,255,0.35); font-weight: 600; }
.sub-val { font-size: 0.78rem; color: rgba(255,255,255,0.75); font-weight: 600; }

.sub-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.sub-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: filter 0.15s, transform 0.1s; }
.sub-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
.btn-1d { background: #16a34a; border-color: #16a34a; color: #fff; }
.btn-2d { background: #2563eb; border-color: #2563eb; color: #fff; }
.btn-1w { background: #7c3aed; border-color: #7c3aed; color: #fff; }
.btn-2w { background: #0891b2; border-color: #0891b2; color: #fff; }
.btn-1m { background: #db2777; border-color: #db2777; color: #fff; }

.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px; font-size: 0.85rem; }

.toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: rgba(0,20,12,0.95); border: 1px solid rgba(0,255,157,0.3); color: #00ff9d; padding: 12px 24px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; z-index: 9999; backdrop-filter: blur(12px); white-space: nowrap; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }

@media (max-width: 640px) { .tab-page { padding: 16px 12px; } .sub-details { gap: 14px; } }
</style>
