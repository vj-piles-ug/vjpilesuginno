<template>
  <div class="tab-page">
    <div class="tab-header">
      <h1 class="tab-title">Transactions</h1>
      <p class="tab-sub">All payment transactions with user details</p>
    </div>

    <!-- Summary Cards -->
    <div class="summary-grid">
      <div class="sum-card sum-success">
        <div class="sum-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="16 12 12 8 8 12"/><line x1="12" y1="16" x2="12" y2="8"/></svg>
        </div>
        <div class="sum-val">{{ successCount }}</div>
        <div class="sum-label">Successful</div>
      </div>
      <div class="sum-card sum-failed">
        <div class="sum-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <div class="sum-val">{{ failedCount }}</div>
        <div class="sum-label">Failed</div>
      </div>
      <div class="sum-card sum-pending">
        <div class="sum-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <div class="sum-val">{{ pendingCount }}</div>
        <div class="sum-label">Pending</div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <div class="search-wrap">
        <svg class="search-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" placeholder="Search by phone, email, or name..." class="search-input" />
      </div>
      <div class="filter-controls">
        <div class="select-wrap">
          <select v-model="statusFilter" class="filter-sel">
            <option value="">All Status</option>
            <option value="Successful">Successful</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
          <svg class="sel-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <button class="sort-btn" @click="sortNewest = !sortNewest">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          {{ sortNewest ? 'Newest' : 'Oldest' }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>USER</th>
            <th>CONTACT</th>
            <th>PLAN</th>
            <th>AMOUNT</th>
            <th>METHOD</th>
            <th>STATUS</th>
            <th>DATE & TIME</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filtered" :key="t.id">
            <td>
              <div class="user-cell">
                <div class="u-avatar">{{ t.userName ? t.userName[0].toUpperCase() : '?' }}</div>
                <div class="u-info">
                  <span class="u-name">{{ t.userName || '—' }}</span>
                  <span class="u-id">{{ t.userId }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="contact-cell">
                <span v-if="t.phone" class="contact-phone">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                  {{ t.phone }}
                </span>
                <span v-if="t.email" class="contact-email">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {{ t.email.length > 22 ? t.email.slice(0, 22) + '…' : t.email }}
                </span>
              </div>
            </td>
            <td>
              <div class="plan-cell">
                <span class="plan-name">{{ t.plan }}</span>
                <span class="plan-days">{{ planDays(t.plan) }}</span>
              </div>
            </td>
            <td class="amount-cell">UGX {{ t.amount.toLocaleString() }}</td>
            <td class="method-cell">{{ t.method || 'N/A' }}</td>
            <td>
              <span class="status-badge" :class="statusCls(t.status)">
                <span class="status-dot"></span>
                {{ t.status }}
              </span>
            </td>
            <td class="date-cell">{{ t.createdAt }}</td>
            <td>
              <button class="del-btn" @click="deleteTransaction(t.id)" title="Delete">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              </button>
            </td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="8" class="empty-row">No transactions found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminStore } from '../../store/admin'

const search = ref('')
const statusFilter = ref('')
const sortNewest = ref(true)

const successCount = computed(() => adminStore.transactions.filter(t => t.status === 'Successful').length)
const failedCount = computed(() => adminStore.transactions.filter(t => t.status === 'Failed').length)
const pendingCount = computed(() => adminStore.transactions.filter(t => t.status === 'Pending').length)

const filtered = computed(() => {
  let list = [...adminStore.transactions]
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(t => t.userName?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q) || t.phone?.includes(q))
  }
  if (statusFilter.value) list = list.filter(t => t.status === statusFilter.value)
  list.sort((a, b) => sortNewest.value ? b.id - a.id : a.id - b.id)
  return list
})

function statusCls(s: string) {
  if (s === 'Successful') return 'status-success'
  if (s === 'Failed') return 'status-failed'
  return 'status-pending'
}

function planDays(plan: string) {
  const m = plan.match(/(\d+)\s*(day|week|month)/i)
  if (!m) return ''
  const n = parseInt(m[1])
  const unit = m[2].toLowerCase()
  if (unit === 'day') return `${n} day${n > 1 ? 's' : ''}`
  if (unit === 'week') return `${n * 7} days`
  return `${n * 30} days`
}

function deleteTransaction(id: number) {
  const i = adminStore.transactions.findIndex(t => t.id === id)
  if (i !== -1) adminStore.transactions.splice(i, 1)
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; }
.tab-header { margin-bottom: 22px; }
.tab-title { font-size: 1.5rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.4); }

.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
.sum-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 22px 20px; display: flex; flex-direction: column; gap: 6px; }
.sum-success { border-color: rgba(0,255,157,0.1); }
.sum-failed { border-color: rgba(248,113,113,0.1); }
.sum-pending { border-color: rgba(245,158,11,0.1); }
.sum-icon { display: flex; }
.sum-val { font-size: 2.2rem; font-weight: 900; line-height: 1; }
.sum-success .sum-val { color: #00ff9d; }
.sum-failed .sum-val { color: #f87171; }
.sum-pending .sum-val { color: #f59e0b; }
.sum-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); font-weight: 600; }

.filters-row { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; align-items: center; }
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-ic { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
.search-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 9px 14px 9px 34px; color: #fff; font-size: 0.83rem; outline: none; transition: border-color 0.2s; }
.search-input:focus { border-color: rgba(0,255,157,0.4); }
.search-input::placeholder { color: rgba(255,255,255,0.25); }
.filter-controls { display: flex; gap: 10px; align-items: center; }
.select-wrap { position: relative; }
.filter-sel { appearance: none; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 9px 36px 9px 12px; color: rgba(255,255,255,0.7); font-size: 0.8rem; outline: none; cursor: pointer; min-width: 120px; }
.filter-sel option { background: #0d1a10; }
.sel-arrow { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(255,255,255,0.4); }
.sort-btn { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.7); font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.15s; white-space: nowrap; }
.sort-btn:hover { background: rgba(255,255,255,0.08); }

.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.data-table thead th { background: rgba(255,255,255,0.04); padding: 11px 14px; text-align: left; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; white-space: nowrap; }
.data-table tbody tr { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.025); }
.data-table td { padding: 11px 14px; vertical-align: middle; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.u-avatar { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: rgba(255,255,255,0.6); flex-shrink: 0; }
.u-info { display: flex; flex-direction: column; gap: 1px; }
.u-name { font-size: 0.8rem; font-weight: 600; color: #fff; white-space: nowrap; }
.u-id { font-size: 0.65rem; color: rgba(255,255,255,0.3); font-family: monospace; white-space: nowrap; max-width: 120px; overflow: hidden; text-overflow: ellipsis; }

.contact-cell { display: flex; flex-direction: column; gap: 3px; }
.contact-phone, .contact-email { display: flex; align-items: center; gap: 5px; font-size: 0.73rem; color: rgba(255,255,255,0.6); white-space: nowrap; }

.plan-cell { display: flex; flex-direction: column; gap: 1px; }
.plan-name { font-size: 0.78rem; font-weight: 600; color: #fff; white-space: nowrap; }
.plan-days { font-size: 0.65rem; color: rgba(255,255,255,0.35); }

.amount-cell { font-weight: 700; color: rgba(255,255,255,0.85); white-space: nowrap; }
.method-cell { color: rgba(255,255,255,0.55); font-size: 0.78rem; white-space: nowrap; }
.date-cell { color: rgba(255,255,255,0.45); font-size: 0.75rem; white-space: nowrap; }

.status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 9999px; font-size: 0.7rem; font-weight: 700; white-space: nowrap; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }
.status-success { background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.25); color: #00ff9d; }
.status-success .status-dot { background: #00ff9d; }
.status-failed { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; }
.status-failed .status-dot { background: #f87171; }
.status-pending { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #f59e0b; }
.status-pending .status-dot { background: #f59e0b; }

.del-btn { padding: 6px; background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); border-radius: 7px; color: #f87171; cursor: pointer; display: flex; transition: background 0.15s; }
.del-btn:hover { background: rgba(220,38,38,0.18); }

.empty-row { text-align: center; color: rgba(255,255,255,0.25); padding: 36px; }

@media (max-width: 768px) { .tab-page { padding: 16px 12px; } .summary-grid { grid-template-columns: 1fr; } .filters-row { flex-direction: column; } .search-wrap { width: 100%; } }
</style>
