<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">User Activities</h1>
        <p class="tab-sub">{{ filtered.length }} total watch events</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="act-filters">
      <input v-model="search" placeholder="Search by user or title…" class="search-input" />
      <select v-model="typeFilter" class="type-sel">
        <option value="">All Types</option>
        <option value="MOVIES">Movies</option>
        <option value="TV SERIES">TV Series</option>
        <option value="ANIMATION">Animation</option>
      </select>
    </div>

    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Title</th>
            <th>Type</th>
            <th>Watched At</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in filtered" :key="a.id">
            <td class="td-id">{{ a.id }}</td>
            <td>
              <div class="user-cell">
                <div class="user-avatar">{{ a.userName[0] }}</div>
                <span class="user-name">{{ a.userName }}</span>
              </div>
            </td>
            <td class="td-title">{{ a.title }}</td>
            <td><span class="type-badge" :class="typeCls(a.type)">{{ typeLabel(a.type) }}</span></td>
            <td class="td-date">{{ a.watchedAt }}</td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="5" class="empty-row">No activity found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Per-user breakdown -->
    <div class="breakdown-section">
      <h2 class="breakdown-title">Per-User Breakdown</h2>
      <div class="user-cards">
        <div v-for="u in userBreakdown" :key="u.id" class="user-card">
          <div class="uc-avatar">{{ u.name[0] }}</div>
          <div class="uc-info">
            <p class="uc-name">{{ u.name }}</p>
            <p class="uc-sub">{{ u.count }} watched · {{ u.email }}</p>
          </div>
          <div class="uc-count">{{ u.count }}</div>
        </div>
        <div v-if="userBreakdown.length === 0" class="empty-row" style="text-align:center;padding:20px">No data</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminStore } from '../../store/admin'

const search = ref('')
const typeFilter = ref('')

const filtered = computed(() => {
  let list = [...adminStore.activities].sort((a, b) => b.id - a.id)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(a => a.userName.toLowerCase().includes(q) || a.title.toLowerCase().includes(q))
  }
  if (typeFilter.value) list = list.filter(a => a.type === typeFilter.value)
  return list
})

const userBreakdown = computed(() => {
  const map = new Map<number, { id: number; name: string; email: string; count: number }>()
  adminStore.activities.forEach(a => {
    const u = adminStore.users.find(u => u.id === a.userId)
    if (!u) return
    if (!map.has(u.id)) map.set(u.id, { id: u.id, name: u.name, email: u.email, count: 0 })
    map.get(u.id)!.count++
  })
  return Array.from(map.values()).sort((a, b) => b.count - a.count)
})

function typeLabel(t: string) {
  if (t === 'MOVIES') return 'Movie'
  if (t === 'TV SERIES') return 'Series'
  return 'Anime'
}
function typeCls(t: string) {
  if (t === 'MOVIES') return 'badge-movie'
  if (t === 'TV SERIES') return 'badge-series'
  return 'badge-anim'
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { margin-bottom: 20px; }
.tab-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.8rem; color: rgba(255,255,255,0.4); }

.act-filters { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
.search-input { flex: 1; min-width: 180px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 14px; color: #fff; font-size: 0.85rem; outline: none; }
.search-input:focus { border-color: rgba(0,255,157,0.4); }
.search-input::placeholder { color: rgba(255,255,255,0.25); }
.type-sel { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 14px; color: rgba(255,255,255,0.7); font-size: 0.82rem; outline: none; }
.type-sel option { background: #0d1a10; }

.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); margin-bottom: 28px; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
.data-table thead th { background: rgba(255,255,255,0.04); padding: 11px 14px; text-align: left; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
.data-table tbody tr { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.025); }
.data-table td { padding: 11px 14px; color: rgba(255,255,255,0.8); vertical-align: middle; }
.td-id { color: rgba(255,255,255,0.3); font-size: 0.75rem; }
.td-title { font-weight: 600; color: #fff; }
.td-date { color: rgba(255,255,255,0.4); font-size: 0.78rem; white-space: nowrap; }
.empty-row { text-align: center; color: rgba(255,255,255,0.25); padding: 32px; }

.user-cell { display: flex; align-items: center; gap: 9px; }
.user-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #00ff9d, #00d4ff); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #021a10; flex-shrink: 0; }
.user-name { font-weight: 600; color: #fff; }

.type-badge { font-size: 0.65rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; letter-spacing: 0.06em; }
.badge-movie { background: rgba(0,255,157,0.1); color: #00ff9d; border: 1px solid rgba(0,255,157,0.2); }
.badge-series { background: rgba(255,166,0,0.1); color: #ffa600; border: 1px solid rgba(255,166,0,0.2); }
.badge-anim { background: rgba(208,138,255,0.1); color: #d08aff; border: 1px solid rgba(208,138,255,0.2); }

.breakdown-section { margin-top: 4px; }
.breakdown-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 14px; }
.user-cards { display: flex; flex-direction: column; gap: 8px; }
.user-card { display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 12px 16px; }
.uc-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #00ff9d, #00d4ff); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 800; color: #021a10; flex-shrink: 0; }
.uc-info { flex: 1; }
.uc-name { font-weight: 700; color: #fff; font-size: 0.88rem; }
.uc-sub { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 2px; }
.uc-count { font-size: 1.4rem; font-weight: 800; color: #00ff9d; }

@media (max-width: 640px) { .tab-page { padding: 16px 12px; } }
</style>
