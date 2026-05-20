<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Manage Users</h1>
      <div class="header-stats">
        <span class="hstat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
          Total: {{ users.length }}
        </span>
        <span class="hstat green">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
          Active: {{ activeCount }}
        </span>
        <button class="refresh-btn" @click="loadUsers" :disabled="loading">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="loading ? 'animation: spin 0.8s linear infinite' : ''"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
          Refresh
        </button>
      </div>
    </div>

    <div class="search-row">
      <div class="search-wrap">
        <svg class="search-ic" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" placeholder="Search users by name or email..." class="search-input" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spin-ring"></div>
      <p class="loading-text">Loading users…</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button class="refresh-btn mt-4" @click="loadUsers">Retry</button>
    </div>

    <!-- List -->
    <div v-else class="users-list">
      <div v-for="u in filteredUsers" :key="u.id" class="user-card">
        <div class="user-top">
          <div class="user-left">
            <div class="user-avatar">{{ (u.displayName || u.email || '?')[0].toUpperCase() }}</div>
            <div class="user-info">
              <p class="user-name">{{ u.displayName || u.email?.split('@')[0] || '—' }}</p>
              <p class="user-email">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {{ u.email }}
              </p>
            </div>
          </div>
          <div class="user-actions">
            <span v-if="isSubActive(u.subscription)" class="badge-active">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              Active
            </span>
            <span v-else class="badge-none">No Sub</span>

            <button v-if="isSubActive(u.subscription)" class="btn-deactivate" :disabled="actionLoading === u.id" @click="handleDeactivate(u.id)">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Deactivate
            </button>
          </div>
        </div>

        <div class="user-meta">
          <div class="meta-col">
            <span class="meta-label">Joined</span>
            <span class="meta-val">{{ fmtDate(u.createdAt) }}</span>
          </div>
          <div class="meta-col">
            <span class="meta-label">Last Login</span>
            <span class="meta-val">{{ u.lastLogin ? fmtDate(u.lastLogin) : 'Never' }}</span>
          </div>
        </div>

        <div v-if="isSubActive(u.subscription)" class="sub-box">
          <div class="sub-header-row">SUBSCRIPTION</div>
          <div class="sub-details">
            <div class="sub-col">
              <span class="sub-label">Plan</span>
              <span class="sub-val">{{ u.subscription?.planName || u.subscription?.planId }}</span>
            </div>
            <div class="sub-col">
              <span class="sub-label">Start</span>
              <span class="sub-val">{{ fmtDate(u.subscription?.startDate) }}</span>
            </div>
            <div class="sub-col">
              <span class="sub-label">Expires</span>
              <span class="sub-val">{{ fmtDate(u.subscription?.endDate) }}</span>
            </div>
            <div class="sub-col">
              <span class="sub-label">Remaining</span>
              <span class="sub-val">{{ calcRemaining(u.subscription?.endDate || '') }}</span>
            </div>
          </div>
        </div>

        <div v-else class="sub-btns">
          <button v-for="plan in PLANS" :key="plan.id" class="sub-btn" :class="plan.cls" :disabled="!!actionLoading" @click="handleActivate(u.id, plan.id, plan.days, plan.name)">
            {{ plan.label }}
          </button>
        </div>
      </div>

      <div v-if="filteredUsers.length === 0 && !loading" class="empty">
        {{ users.length === 0 ? 'No users registered yet.' : 'No users match your search.' }}
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ref as dbRef, get, set, remove } from 'firebase/database'
import { db } from '../../lib/firebase'
import { isAdmin } from '../../store/auth'

interface Subscription {
  planId: string
  planName?: string
  startDate: string
  endDate: string
  active: boolean
}
interface UserItem {
  id: string
  email: string
  displayName?: string
  createdAt: string
  lastLogin?: string
  subscription?: Subscription
}

const users = ref<UserItem[]>([])
const loading = ref(false)
const error = ref('')
const search = ref('')
const toast = ref('')
const actionLoading = ref<string | null>(null)

const PLANS = [
  { id: 'admin-1day-pass',   days: 1,  name: '1 Day Pass',    label: '1-Day',   cls: 'btn-1d' },
  { id: 'admin-2day-pass',   days: 2,  name: '2 Days Pass',   label: '2-Days',  cls: 'btn-2d' },
  { id: 'admin-1week-pass',  days: 7,  name: '1 Week Pass',   label: '1-Week',  cls: 'btn-1w' },
  { id: 'admin-2week-pass',  days: 14, name: '2 Weeks Pass',  label: '2-Weeks', cls: 'btn-2w' },
  { id: 'admin-1month-pass', days: 30, name: '1 Month Pass',  label: '1-Month', cls: 'btn-1m' },
]

const activeCount = computed(() => users.value.filter(u => isSubActive(u.subscription)).length)

const filteredUsers = computed(() => {
  const q = search.value.toLowerCase()
  const list = q
    ? users.value.filter(u =>
        (u.displayName || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
      )
    : [...users.value]
  return list.sort((a, b) => {
    const aActive = isSubActive(a.subscription)
    const bActive = isSubActive(b.subscription)
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    return new Date(b.lastLogin || b.createdAt || 0).getTime() - new Date(a.lastLogin || a.createdAt || 0).getTime()
  })
})

function isSubActive(sub?: Subscription): boolean {
  if (!sub?.active) return false
  if (!sub.endDate) return false
  return new Date(sub.endDate) > new Date()
}

function fmtDate(d?: string): string {
  if (!d) return '—'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-UG', { year: 'numeric', month: 'short', day: 'numeric' })
}

function calcRemaining(endDate: string): string {
  if (!endDate) return '—'
  const diff = new Date(endDate).getTime() - Date.now()
  if (diff <= 0) return 'Expired'
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}

async function loadUsers() {
  if (!isAdmin.value) return
  loading.value = true
  error.value = ''
  try {
    const [usersSnap, subsSnap] = await Promise.all([
      get(dbRef(db, 'users')),
      get(dbRef(db, 'subscriptions')),
    ])

    if (!usersSnap.exists()) {
      users.value = []
      loading.value = false
      return
    }

    const usersData = usersSnap.val()
    const subsData: Record<string, Subscription> = subsSnap.exists() ? subsSnap.val() : {}

    const list: UserItem[] = Object.entries(usersData).map(([id, v]: any) => ({
      id,
      email: v.email || v.Email || '',
      displayName: v.displayName || v.name || v.email?.split('@')[0] || 'User',
      createdAt: v.createdAt || v.joinedAt || '',
      lastLogin: v.lastLogin,
      subscription: subsData[id] || undefined,
    }))

    users.value = list
  } catch (e: any) {
    error.value = e?.message || 'Failed to load users. Check Firebase rules.'
  }
  loading.value = false
}

async function handleActivate(uid: string, planId: string, days: number, planName: string) {
  actionLoading.value = uid
  try {
    const now = new Date()
    const end = new Date(now.getTime() + days * 86400000)
    const sub: Subscription = {
      planId,
      planName,
      startDate: now.toISOString(),
      endDate: end.toISOString(),
      active: true,
    }
    await set(dbRef(db, `subscriptions/${uid}`), sub)
    users.value = users.value.map(u => u.id === uid ? { ...u, subscription: sub } : u)
    showToast(`✓ Activated ${planName} for user`)
  } catch (e: any) {
    showToast(`Error: ${e?.message || 'Failed'}`)
  }
  actionLoading.value = null
}

async function handleDeactivate(uid: string) {
  actionLoading.value = uid
  try {
    await remove(dbRef(db, `subscriptions/${uid}`))
    users.value = users.value.map(u => u.id === uid ? { ...u, subscription: undefined } : u)
    showToast('Subscription deactivated')
  } catch (e: any) {
    showToast(`Error: ${e?.message || 'Failed'}`)
  }
  actionLoading.value = null
}

// Load when admin is confirmed
watch(isAdmin, (val) => { if (val) loadUsers() }, { immediate: false })
onMounted(() => { if (isAdmin.value) loadUsers() })
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }
.tab-page { padding: 28px 24px; position: relative; }
.tab-header { margin-bottom: 18px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 8px; }
.header-stats { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.hstat { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: rgba(255,255,255,0.45); font-weight: 600; }
.hstat.green { color: #00ff9d; }
.refresh-btn { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); font-size: 0.72rem; font-weight: 600; cursor: pointer; }
.refresh-btn:hover { background: rgba(255,255,255,0.09); }
.refresh-btn:disabled { opacity: 0.5; cursor: default; }
.search-row { margin-bottom: 20px; }
.search-wrap { position: relative; }
.search-ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
.search-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px 10px 36px; color: #fff; font-size: 0.85rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.search-input:focus { border-color: rgba(0,255,157,0.4); }
.search-input::placeholder { color: rgba(255,255,255,0.25); }
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 60px 16px; }
.spin-ring { width: 32px; height: 32px; border: 3px solid rgba(0,255,157,0.15); border-top-color: #00ff9d; border-radius: 50%; animation: spin 0.8s linear infinite; }
.loading-text { font-size: 0.82rem; color: rgba(255,255,255,0.35); }
.error-state { text-align: center; padding: 40px 16px; color: #f87171; font-size: 0.85rem; }
.mt-4 { margin-top: 16px; }
.users-list { display: flex; flex-direction: column; gap: 12px; }
.user-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 20px; transition: border-color 0.2s; }
.user-card:hover { border-color: rgba(255,255,255,0.13); }
.user-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px; flex-wrap: wrap; }
.user-left { display: flex; align-items: center; gap: 14px; }
.user-avatar { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, rgba(0,255,157,0.2), rgba(0,212,255,0.2)); border: 1px solid rgba(0,255,157,0.2); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: #00ff9d; }
.user-name { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
.user-email { display: flex; align-items: center; gap: 5px; font-size: 0.75rem; color: rgba(255,255,255,0.45); }
.user-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.badge-active { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.3); color: #00ff9d; font-size: 0.72rem; font-weight: 700; }
.badge-none { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 9999px; background: rgba(220,38,38,0.1); border: 1px solid rgba(220,38,38,0.25); color: #f87171; font-size: 0.72rem; font-weight: 700; }
.btn-deactivate { display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 8px; background: rgba(220,38,38,0.12); border: 1px solid rgba(220,38,38,0.3); color: #f87171; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
.btn-deactivate:hover { background: rgba(220,38,38,0.22); }
.btn-deactivate:disabled { opacity: 0.5; cursor: default; }
.user-meta { display: flex; gap: 32px; margin-bottom: 10px; flex-wrap: wrap; }
.meta-col { display: flex; flex-direction: column; gap: 2px; }
.meta-label { font-size: 0.68rem; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
.meta-val { font-size: 0.8rem; color: rgba(255,255,255,0.7); font-weight: 600; }
.sub-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 16px; margin-top: 10px; }
.sub-header-row { font-size: 0.62rem; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 0.12em; margin-bottom: 10px; }
.sub-details { display: flex; gap: 24px; flex-wrap: wrap; }
.sub-col { display: flex; flex-direction: column; gap: 2px; }
.sub-label { font-size: 0.65rem; color: rgba(255,255,255,0.35); font-weight: 600; }
.sub-val { font-size: 0.78rem; color: rgba(255,255,255,0.75); font-weight: 600; }
.sub-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.sub-btn { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer; border: 1px solid transparent; transition: filter 0.15s, transform 0.1s; }
.sub-btn:hover { filter: brightness(1.15); transform: translateY(-1px); }
.sub-btn:disabled { opacity: 0.5; cursor: default; transform: none; }
.btn-1d { background: #16a34a; border-color: #16a34a; color: #fff; }
.btn-2d { background: #2563eb; border-color: #2563eb; color: #fff; }
.btn-1w { background: #7c3aed; border-color: #7c3aed; color: #fff; }
.btn-2w { background: #0891b2; border-color: #0891b2; color: #fff; }
.btn-1m { background: #db2777; border-color: #db2777; color: #fff; }
.empty { text-align: center; color: rgba(255,255,255,0.25); padding: 40px; font-size: 0.85rem; }
.toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: rgba(0,20,12,0.95); border: 1px solid rgba(0,255,157,0.3); color: #00ff9d; padding: 12px 24px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; z-index: 9999; backdrop-filter: blur(12px); white-space: nowrap; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
@media (max-width: 640px) { .tab-page { padding: 16px 12px; } .sub-details { gap: 14px; } }
</style>
