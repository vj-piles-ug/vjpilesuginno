<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">User Activities</h1>
        <p class="tab-sub">{{ filtered.length }} total events recorded across all pages</p>
      </div>
      <div class="header-actions">
        <button class="clear-btn" @click="confirmClear = true" v-if="dbActivities.length > 0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/></svg>
          Clear All
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="act-filters">
      <div class="search-wrap">
        <svg class="search-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" placeholder="Search by user, action, or details…" class="search-input" />
      </div>
      <select v-model="actionFilter" class="filter-sel">
        <option value="">All Actions</option>
        <option v-for="a in actionTypes" :key="a" :value="a">{{ a }}</option>
      </select>
      <select v-model="deviceFilter" class="filter-sel">
        <option value="">All Devices</option>
        <option value="Mobile">Mobile</option>
        <option value="Desktop">Desktop</option>
      </select>
    </div>

    <!-- Stats row -->
    <div class="stats-row">
      <div class="stat-pill">
        <span class="sp-val">{{ dbActivities.length }}</span>
        <span class="sp-lbl">Total Events</span>
      </div>
      <div class="stat-pill">
        <span class="sp-val">{{ uniqueUsers }}</span>
        <span class="sp-lbl">Unique Users</span>
      </div>
      <div class="stat-pill">
        <span class="sp-val">{{ mobileCount }}</span>
        <span class="sp-lbl">Mobile</span>
      </div>
      <div class="stat-pill">
        <span class="sp-val">{{ desktopCount }}</span>
        <span class="sp-lbl">Desktop</span>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
            <th>Page</th>
            <th>Device</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(a, idx) in paginated" :key="a.key">
            <td class="td-idx">{{ offset + idx + 1 }}</td>
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ (a.userName || '?')[0].toUpperCase() }}</div>
                <div class="user-info">
                  <span class="user-name">{{ a.userName }}</span>
                  <span class="user-email">{{ a.userEmail }}</span>
                </div>
              </div>
            </td>
            <td><span class="action-badge" :class="actionCls(a.action)">{{ a.action }}</span></td>
            <td class="td-details">{{ a.details || '—' }}</td>
            <td class="td-page">{{ a.page || '—' }}</td>
            <td>
              <span class="device-badge" :class="a.device === 'Mobile' ? 'dev-mobile' : 'dev-desktop'">
                {{ a.device || '—' }}
              </span>
            </td>
            <td class="td-date">{{ fmtTime(a.timestamp) }}</td>
            <td class="td-del">
              <button class="del-row-btn" @click="deleteOne(a.key)" :disabled="deleting === a.key" title="Delete">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="8" class="empty-row">
              {{ dbActivities.length === 0 ? 'No activity recorded yet. Activities are logged as users interact with the site.' : 'No events match your filters.' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button class="page-btn" :disabled="page === 0" @click="page--">‹ Prev</button>
      <span class="page-info">{{ page + 1 }} / {{ totalPages }}</span>
      <button class="page-btn" :disabled="page >= totalPages - 1" @click="page++">Next ›</button>
    </div>

    <!-- Per-user breakdown -->
    <div class="breakdown-section">
      <h2 class="breakdown-title">Top Users by Activity</h2>
      <div class="user-cards">
        <div v-for="u in userBreakdown" :key="u.uid" class="user-card">
          <div class="uc-avatar">{{ (u.name || '?')[0].toUpperCase() }}</div>
          <div class="uc-info">
            <p class="uc-name">{{ u.name }}</p>
            <p class="uc-sub">{{ u.email }} · {{ u.device }}</p>
          </div>
          <div class="uc-count">{{ u.count }}</div>
        </div>
        <div v-if="userBreakdown.length === 0" class="empty-row" style="text-align:center;padding:20px;color:rgba(255,255,255,0.25);font-size:0.82rem;">No data yet</div>
      </div>
    </div>

    <!-- Clear confirm -->
    <div v-if="confirmClear" class="overlay-confirm" @click.self="confirmClear = false">
      <div class="confirm-box">
        <h3 class="confirm-title">Clear All Activities?</h3>
        <p class="confirm-sub">This will permanently delete all {{ dbActivities.length }} activity records.</p>
        <div class="confirm-btns">
          <button class="btn-cancel" @click="confirmClear = false">Cancel</button>
          <button class="btn-confirm-del" @click="clearAll">Delete All</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ref as dbRef, remove } from 'firebase/database'
import { db } from '../../lib/firebase'
import { dbActivities } from '../../store/activity'

const search = ref('')
const actionFilter = ref('')
const deviceFilter = ref('')
const page = ref(0)
const PAGE_SIZE = 50
const confirmClear = ref(false)
const deleting = ref<string | null>(null)

const actionTypes = computed(() => {
  const set = new Set(dbActivities.value.map(a => a.action).filter(Boolean))
  return Array.from(set).sort()
})

const filtered = computed(() => {
  let list = [...dbActivities.value]
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(a =>
      a.userName.toLowerCase().includes(q) ||
      a.userEmail.toLowerCase().includes(q) ||
      a.action.toLowerCase().includes(q) ||
      a.details.toLowerCase().includes(q) ||
      a.page.toLowerCase().includes(q)
    )
  }
  if (actionFilter.value) list = list.filter(a => a.action === actionFilter.value)
  if (deviceFilter.value) list = list.filter(a => a.device === deviceFilter.value)
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const offset = computed(() => page.value * PAGE_SIZE)
const paginated = computed(() => filtered.value.slice(offset.value, offset.value + PAGE_SIZE))

const uniqueUsers = computed(() => new Set(dbActivities.value.map(a => a.uid)).size)
const mobileCount = computed(() => dbActivities.value.filter(a => a.device === 'Mobile').length)
const desktopCount = computed(() => dbActivities.value.filter(a => a.device === 'Desktop').length)

const userBreakdown = computed(() => {
  const map = new Map<string, { uid: string; name: string; email: string; count: number; device: string }>()
  dbActivities.value.forEach(a => {
    if (!map.has(a.uid)) {
      map.set(a.uid, { uid: a.uid, name: a.userName, email: a.userEmail, count: 0, device: a.device })
    }
    map.get(a.uid)!.count++
  })
  return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 20)
})

function fmtTime(ts: string): string {
  if (!ts) return '—'
  const d = new Date(ts)
  if (isNaN(d.getTime())) return ts
  return d.toLocaleString('en-UG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function actionCls(action: string): string {
  const a = action.toLowerCase()
  if (a.includes('download')) return 'act-download'
  if (a.includes('subscri') || a.includes('payment') || a.includes('plan')) return 'act-sub'
  if (a.includes('sign in') || a.includes('sign up') || a.includes('login') || a.includes('register')) return 'act-auth'
  if (a.includes('open') || a.includes('click') || a.includes('view') || a.includes('modal')) return 'act-view'
  if (a.includes('search')) return 'act-search'
  return 'act-default'
}

async function deleteOne(key: string) {
  if (!key) return
  deleting.value = key
  try {
    await remove(dbRef(db, `activities/${key}`))
  } catch (_) {}
  deleting.value = null
}

async function clearAll() {
  try {
    await remove(dbRef(db, 'activities'))
    confirmClear.value = false
  } catch (_) {}
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; position: relative; }
@media (max-width: 640px) { .tab-page { padding: 14px 10px; } }

.tab-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
.tab-title { font-size: 1.4rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.38); }
.header-actions { display: flex; gap: 8px; flex-shrink: 0; }
.clear-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 14px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25);
  color: #f87171; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;
  transition: background 0.15s;
}
.clear-btn:hover { background: rgba(248,113,113,0.2); }

.act-filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.search-wrap { flex: 1; min-width: 200px; position: relative; }
.search-ic { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
.search-input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px 9px 32px; color: #fff; font-size: 0.83rem; outline: none; box-sizing: border-box; }
.search-input:focus { border-color: rgba(0,255,157,0.4); }
.search-input::placeholder { color: rgba(255,255,255,0.25); }
.filter-sel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 12px; color: rgba(255,255,255,0.7); font-size: 0.8rem; outline: none; }
.filter-sel option { background: #0d1a10; }

.stats-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.stat-pill { display: flex; flex-direction: column; align-items: center; padding: 10px 18px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; min-width: 80px; }
.sp-val { font-size: 1.2rem; font-weight: 900; color: #fff; line-height: 1.1; }
.sp-lbl { font-size: 0.6rem; color: rgba(255,255,255,0.35); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }

.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); margin-bottom: 20px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
.data-table thead th { background: rgba(255,255,255,0.04); padding: 10px 12px; text-align: left; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
.data-table tbody tr { border-top: 1px solid rgba(255,255,255,0.04); transition: background 0.12s; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.025); }
.data-table td { padding: 10px 12px; color: rgba(255,255,255,0.75); vertical-align: middle; }
.td-idx { color: rgba(255,255,255,0.25); font-size: 0.72rem; width: 40px; }
.td-details { max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: rgba(255,255,255,0.55); font-size: 0.75rem; }
.td-page { color: rgba(255,255,255,0.35); font-size: 0.7rem; }
.td-date { color: rgba(255,255,255,0.35); font-size: 0.72rem; white-space: nowrap; }
.td-del { width: 36px; text-align: center; }
.del-row-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 6px; border: 1px solid rgba(248,113,113,0.2);
  background: rgba(248,113,113,0.07); color: rgba(248,113,113,0.6);
  cursor: pointer; transition: all 0.15s; flex-shrink: 0;
}
.del-row-btn:hover { background: rgba(248,113,113,0.18); color: #f87171; border-color: rgba(248,113,113,0.4); }
.del-row-btn:disabled { opacity: 0.3; cursor: default; }
.empty-row { text-align: center; color: rgba(255,255,255,0.2); padding: 32px; font-size: 0.82rem; }

.user-cell { display: flex; align-items: center; gap: 8px; min-width: 140px; }
.user-avatar { width: 26px; height: 26px; border-radius: 50%; background: linear-gradient(135deg, #00ff9d, #00d4ff); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 800; color: #021a10; flex-shrink: 0; }
.user-info { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-weight: 600; color: #fff; font-size: 0.78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-email { font-size: 0.65rem; color: rgba(255,255,255,0.35); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.action-badge { font-size: 0.62rem; font-weight: 800; padding: 3px 8px; border-radius: 5px; letter-spacing: 0.04em; white-space: nowrap; }
.act-download { background: rgba(0,255,157,0.1); color: #00ff9d; border: 1px solid rgba(0,255,157,0.2); }
.act-sub { background: rgba(255,166,0,0.1); color: #ffa600; border: 1px solid rgba(255,166,0,0.2); }
.act-auth { background: rgba(0,212,255,0.1); color: #00d4ff; border: 1px solid rgba(0,212,255,0.2); }
.act-view { background: rgba(168,85,247,0.1); color: #a855f7; border: 1px solid rgba(168,85,247,0.2); }
.act-search { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
.act-default { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.1); }

.device-badge { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; }
.dev-mobile { background: rgba(168,85,247,0.1); color: #a855f7; border: 1px solid rgba(168,85,247,0.2); }
.dev-desktop { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }

.pagination { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 28px; }
.page-btn { padding: 7px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.6); font-size: 0.78rem; font-weight: 700; cursor: pointer; }
.page-btn:disabled { opacity: 0.3; cursor: default; }
.page-btn:not(:disabled):hover { background: rgba(255,255,255,0.09); }
.page-info { font-size: 0.78rem; color: rgba(255,255,255,0.4); }

.breakdown-section { margin-top: 8px; }
.breakdown-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 12px; }
.user-cards { display: flex; flex-direction: column; gap: 8px; }
.user-card { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 11px; padding: 10px 14px; }
.uc-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, #00ff9d, #00d4ff); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 800; color: #021a10; flex-shrink: 0; }
.uc-info { flex: 1; min-width: 0; }
.uc-name { font-weight: 700; color: #fff; font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.uc-sub { font-size: 0.7rem; color: rgba(255,255,255,0.38); margin-top: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.uc-count { font-size: 1.3rem; font-weight: 800; color: #00ff9d; flex-shrink: 0; }

.overlay-confirm {
  position: fixed; inset: 0; z-index: 600;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(12px);
}
.confirm-box {
  background: rgba(8,16,12,0.99); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px; padding: 24px 20px; max-width: 340px; width: 100%;
}
.confirm-title { font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 8px; }
.confirm-sub { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 20px; line-height: 1.5; }
.confirm-btns { display: flex; gap: 10px; }
.btn-cancel { flex: 1; padding: 9px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; color: rgba(255,255,255,0.6); font-size: 0.78rem; font-weight: 700; cursor: pointer; }
.btn-confirm-del { flex: 1; padding: 9px; background: rgba(239,68,68,0.9); border: none; border-radius: 9px; color: #fff; font-size: 0.78rem; font-weight: 800; cursor: pointer; }
</style>
