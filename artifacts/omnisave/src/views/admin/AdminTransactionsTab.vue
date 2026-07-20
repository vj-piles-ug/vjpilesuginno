<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">Transactions</h1>
        <p class="tab-sub">All payment transactions with real-time updates</p>
      </div>
      <button class="clear-all-btn" @click="confirmClear = true" v-if="payments.length > 0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        Clear All
      </button>
    </div>

    <!-- Confirm clear all modal -->
    <div v-if="confirmClear" class="overlay-confirm" @click.self="confirmClear = false">
      <div class="confirm-box">
        <h3 class="confirm-title">Clear All Transactions?</h3>
        <p class="confirm-sub">This will permanently delete all {{ payments.length }} transaction records from payment logs. This cannot be undone.</p>
        <div class="confirm-btns">
          <button class="btn-cancel" @click="confirmClear = false">Cancel</button>
          <button class="btn-confirm-del" @click="clearAllTransactions">Delete All</button>
        </div>
      </div>
    </div>

    <div class="summary-grid">
      <div class="sum-card sum-success">
        <div class="sum-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00ff9d" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/></svg></div>
        <div class="sum-val">{{ successCount }}</div>
        <div class="sum-label">Successful</div>
      </div>
      <div class="sum-card sum-failed">
        <div class="sum-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
        <div class="sum-val">{{ failedCount }}</div>
        <div class="sum-label">Failed</div>
      </div>
      <div class="sum-card sum-pending">
        <div class="sum-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <div class="sum-val">{{ pendingCount }}</div>
        <div class="sum-label">Pending</div>
      </div>
    </div>

    <div class="filters-row">
      <div class="search-wrap">
        <svg class="search-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input v-model="search" placeholder="Search by phone, email, or name…" class="search-input" />
      </div>
      <div class="filter-controls">
        <div class="select-wrap">
          <select v-model="statusFilter" class="filter-sel">
            <option value="">All Status</option>
            <option value="successful">Successful</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <svg class="sel-arrow" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <button class="sort-btn" @click="sortNewest = !sortNewest">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
          {{ sortNewest ? 'Newest' : 'Oldest' }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <div class="spin-ring"></div>
      <p class="loading-text">Loading transactions…</p>
    </div>

    <!-- Desktop table -->
    <div v-else class="table-wrap desktop-table">
      <table class="data-table">
        <thead>
          <tr>
            <th>USER</th>
            <th>CONTACT</th>
            <th>PLAN</th>
            <th>AMOUNT</th>
            <th>METHOD</th>
            <th>STATUS</th>
            <th>DATE</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in filteredPayments" :key="t.id">
            <td>
              <div class="user-cell">
                <div class="u-avatar">{{ (t.firstName || t.email || '?')[0].toUpperCase() }}</div>
                <div class="u-info">
                  <span class="u-name">{{ fullName(t) || '—' }}</span>
                  <span class="u-id">{{ t.userId }}</span>
                </div>
              </div>
            </td>
            <td>
              <div class="contact-cell">
                <span v-if="t.phoneNumber" class="contact-phone">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.007 1.16A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.36 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
                  {{ t.phoneNumber }}
                </span>
                <span v-if="t.email" class="contact-email">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {{ t.email.length > 22 ? t.email.slice(0, 22) + '…' : t.email }}
                </span>
              </div>
            </td>
            <td class="plan-cell">{{ t.planName || t.planId || '—' }}</td>
            <td class="amount-cell">{{ t.amount > 0 ? 'UGX ' + Number(t.amount).toLocaleString() : '—' }}</td>
            <td class="method-cell">{{ t.paymentMethod || 'N/A' }}</td>
            <td>
              <span class="status-badge" :class="statusCls(t.status)">
                <span class="status-dot"></span>
                {{ capitalize(t.status) }}
              </span>
            </td>
            <td class="date-cell">{{ fmtDate(t.createdAt) }}</td>
            <td>
              <button class="del-btn" @click="deletePayment(t.id)" title="Delete">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
              </button>
            </td>
          </tr>
          <tr v-if="filteredPayments.length === 0 && !loading">
            <td colspan="8" class="empty-row">No transactions found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile cards -->
    <div v-if="!loading" class="mobile-cards">
      <div v-if="filteredPayments.length === 0" class="empty-row">No transactions found.</div>
      <div v-for="t in filteredPayments" :key="t.id" class="txn-card">
        <div class="txn-card-top">
          <div class="txn-user">
            <div class="u-avatar">{{ (t.firstName || t.email || '?')[0].toUpperCase() }}</div>
            <div class="txn-user-info">
              <span class="u-name">{{ fullName(t) || t.email?.split('@')[0] || '—' }}</span>
              <span class="txn-contact">{{ t.phoneNumber || t.email || '—' }}</span>
            </div>
          </div>
          <span class="status-badge" :class="statusCls(t.status)">
            <span class="status-dot"></span>{{ capitalize(t.status) }}
          </span>
        </div>
        <div class="txn-card-mid">
          <div class="txn-detail">
            <span class="txn-detail-label">Plan</span>
            <span class="txn-detail-val">{{ t.planName || t.planId || '—' }}</span>
          </div>
          <div class="txn-detail">
            <span class="txn-detail-label">Amount</span>
            <span class="txn-detail-val txn-amount">{{ t.amount > 0 ? 'UGX ' + Number(t.amount).toLocaleString() : '—' }}</span>
          </div>
          <div class="txn-detail">
            <span class="txn-detail-label">Method</span>
            <span class="txn-detail-val">{{ t.paymentMethod || 'N/A' }}</span>
          </div>
          <div class="txn-detail">
            <span class="txn-detail-label">Date</span>
            <span class="txn-detail-val">{{ fmtDate(t.createdAt) }}</span>
          </div>
        </div>
        <div class="txn-card-bot">
          <button class="del-btn" @click="deletePayment(t.id)">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { ref as fbRef, onValue, remove } from 'firebase/database'
import { db } from '../../lib/firebase'
import { isAdmin } from '../../store/auth'

interface Payment {
  id: string
  userId: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  amount: number
  planId: string
  planName: string
  orderTrackingId: string
  status: string
  paymentMethod: string
  createdAt: string
}

const payments = ref<Payment[]>([])
const loading = ref(true)
const search = ref('')
const statusFilter = ref('')
const sortNewest = ref(true)
const confirmClear = ref(false)

let unsubLogs: (() => void) | null = null
let unsubSubs: (() => void) | null = null
let logsData: any = null
let subsData: any = null
let gotLogs = false
let gotSubs = false

function normalizeStatus(s?: string): string {
  if (!s) return 'pending'
  const l = s.toLowerCase()
  if (l === 'completed' || l === 'successful' || l === 'success') return 'successful'
  if (l === 'failed' || l === 'fail' || l === 'reversed') return 'failed'
  return 'pending'
}

function buildPayments() {
  if (!gotLogs || !gotSubs) return
  const map: Record<string, Payment> = {}

  if (logsData && typeof logsData === 'object') {
    for (const [key, v] of Object.entries(logsData as Record<string, any>)) {
      map[key] = {
        id: key,
        userId: v.userId || '',
        email: v.email || '',
        phoneNumber: v.phoneNumber || v.phone_number || v.phone || v.payment_account || '',
        firstName: v.firstName || v.first_name || v.userName || v.displayName || '',
        lastName: v.lastName || v.last_name || '',
        amount: Number(v.amount) || 0,
        planId: v.planId || '',
        planName: v.planName || v.plan || '',
        orderTrackingId: v.orderTrackingId || key,
        status: normalizeStatus(v.status),
        paymentMethod: v.paymentMethod || v.payment_method || v.method || '',
        createdAt: v.createdAt || v.created_at || '',
      }
    }
  }

  if (subsData && typeof subsData === 'object') {
    for (const [userId, v] of Object.entries(subsData as Record<string, any>)) {
      const trackingId = v.orderTrackingId || `sub-${userId}`
      if (!map[trackingId]) {
        map[trackingId] = {
          id: trackingId,
          userId,
          email: v.email || '',
          phoneNumber: v.paymentPhone || v.phoneNumber || v.phone || '',
          firstName: v.firstName || v.displayName || v.planName || '',
          lastName: v.lastName || '',
          amount: Number(v.amount) || 0,
          planId: v.planId || '',
          planName: v.planName || v.planId || '',
          orderTrackingId: trackingId,
          status: 'successful',
          paymentMethod: v.paymentMethod || 'Admin Activation',
          createdAt: v.createdAt || v.startDate || '',
        }
      }
    }
  }

  payments.value = Object.values(map)
  loading.value = false
}

function startListeners() {
  if (unsubLogs) unsubLogs()
  if (unsubSubs) unsubSubs()
  loading.value = true
  gotLogs = false
  gotSubs = false
  logsData = null
  subsData = null

  unsubLogs = onValue(fbRef(db, 'paymentLogs'), (snap) => {
    logsData = snap.exists() ? snap.val() : null
    gotLogs = true
    buildPayments()
  }, () => { gotLogs = true; buildPayments() })

  unsubSubs = onValue(fbRef(db, 'subscriptions'), (snap) => {
    subsData = snap.exists() ? snap.val() : null
    gotSubs = true
    buildPayments()
  }, () => { gotSubs = true; buildPayments() })
}

function stopListeners() {
  if (unsubLogs) { unsubLogs(); unsubLogs = null }
  if (unsubSubs) { unsubSubs(); unsubSubs = null }
}

const successCount = computed(() => payments.value.filter(p => p.status === 'successful').length)
const failedCount = computed(() => payments.value.filter(p => p.status === 'failed').length)
const pendingCount = computed(() => payments.value.filter(p => p.status === 'pending').length)

const filteredPayments = computed(() => {
  let list = [...payments.value]
  if (statusFilter.value) list = list.filter(p => p.status === statusFilter.value)
  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(p =>
      p.phoneNumber?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.firstName?.toLowerCase().includes(q) ||
      p.lastName?.toLowerCase().includes(q) ||
      p.orderTrackingId?.toLowerCase().includes(q)
    )
  }
  list.sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const db2 = b.createdAt ? new Date(b.createdAt).getTime() : 0
    if (da === 0 && db2 === 0) return 0
    if (da === 0) return 1
    if (db2 === 0) return -1
    return sortNewest.value ? db2 - da : da - db2
  })
  return list
})

function fullName(t: Payment): string {
  const fn = t.firstName || ''
  const ln = t.lastName || ''
  return fn || ln ? `${fn} ${ln}`.trim() : ''
}

function fmtDate(d?: string): string {
  if (!d) return 'N/A'
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-UG', { year: 'numeric', month: 'short', day: 'numeric' }) + ' ' +
    dt.toLocaleTimeString('en-UG', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function statusCls(s: string) {
  if (s === 'successful') return 'status-success'
  if (s === 'failed') return 'status-failed'
  return 'status-pending'
}

async function deletePayment(id: string) {
  if (!confirm('Delete this transaction?')) return
  try {
    const safeKey = id.replace(/[.#$[\]/]/g, '_')
    await remove(fbRef(db, `paymentLogs/${safeKey}`))
  } catch {
    alert('Failed to delete transaction')
  }
}

async function clearAllTransactions() {
  try {
    await remove(fbRef(db, 'paymentLogs'))
    confirmClear.value = false
  } catch {
    alert('Failed to clear transactions')
  }
}

watch(isAdmin, (val) => { if (val) startListeners() }, { immediate: false })
onMounted(() => { if (isAdmin.value) startListeners() })
onUnmounted(() => stopListeners())
</script>

<style scoped>
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Page ── */
.tab-page { padding: 12px 10px 16px; width: 100%; box-sizing: border-box; overflow-x: hidden; }
@media (min-width: 640px) { .tab-page { padding: 20px 18px; } }
@media (min-width: 1024px) { .tab-page { padding: 28px 24px; } }

.tab-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.tab-title { font-size: 1.1rem; font-weight: 900; color: #fff; margin-bottom: 2px; }
@media (min-width: 640px) { .tab-title { font-size: 1.4rem; } }
@media (min-width: 1024px) { .tab-title { font-size: 1.5rem; } }
.tab-sub { font-size: 0.7rem; color: rgba(255,255,255,0.4); }

/* ── Summary cards ── */
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 14px; }
@media (min-width: 640px) { .summary-grid { gap: 14px; margin-bottom: 20px; } }
.sum-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 10px 8px; display: flex; flex-direction: column; gap: 4px; }
@media (min-width: 640px) { .sum-card { border-radius: 14px; padding: 18px 16px; gap: 6px; } }
.sum-success { border-color: rgba(0,255,157,0.1); }
.sum-failed { border-color: rgba(248,113,113,0.1); }
.sum-pending { border-color: rgba(245,158,11,0.1); }
.sum-icon { display: flex; }
.sum-val { font-size: 1.4rem; font-weight: 900; line-height: 1; }
@media (min-width: 640px) { .sum-val { font-size: 2rem; } }
.sum-success .sum-val { color: #00ff9d; }
.sum-failed .sum-val { color: #f87171; }
.sum-pending .sum-val { color: #f59e0b; }
.sum-label { font-size: 0.6rem; color: rgba(255,255,255,0.4); font-weight: 600; }
@media (min-width: 640px) { .sum-label { font-size: 0.72rem; } }

/* ── Filters ── */
.filters-row { display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap; align-items: center; }
.search-wrap { position: relative; flex: 1; min-width: 0; width: 100%; }
.search-ic { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.3); pointer-events: none; }
.search-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 9px; padding: 8px 12px 8px 30px; color: #fff; font-size: 0.78rem; outline: none; box-sizing: border-box; }
.search-input::placeholder { color: rgba(255,255,255,0.25); }
.filter-controls { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }
.select-wrap { position: relative; }
.filter-sel { appearance: none; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 7px 30px 7px 10px; color: rgba(255,255,255,0.7); font-size: 0.75rem; outline: none; cursor: pointer; min-width: 100px; }
.filter-sel option { background: #0d1a10; }
.sel-arrow { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; color: rgba(255,255,255,0.4); }
.sort-btn { display: flex; align-items: center; gap: 5px; padding: 7px 11px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.7); font-size: 0.75rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
.sort-btn:hover { background: rgba(255,255,255,0.08); }

/* ── Loading ── */
.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 48px 16px; }
.spin-ring { width: 32px; height: 32px; border: 3px solid rgba(0,255,157,0.15); border-top-color: #00ff9d; border-radius: 50%; animation: spin 0.8s linear infinite; }
.loading-text { font-size: 0.82rem; color: rgba(255,255,255,0.35); }

/* ── Desktop table (hidden on mobile) ── */
.desktop-table { display: none; }
@media (min-width: 768px) { .desktop-table { display: block; overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); } }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
.data-table thead th { background: rgba(255,255,255,0.04); padding: 11px 14px; text-align: left; font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.35); letter-spacing: 0.1em; white-space: nowrap; }
.data-table tbody tr { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.025); }
.data-table td { padding: 11px 14px; vertical-align: middle; }
.user-cell { display: flex; align-items: center; gap: 10px; }
.u-avatar { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: rgba(255,255,255,0.6); flex-shrink: 0; }
.u-info { display: flex; flex-direction: column; gap: 1px; }
.u-name { font-size: 0.8rem; font-weight: 600; color: #fff; white-space: nowrap; }
.u-id { font-size: 0.65rem; color: rgba(255,255,255,0.3); font-family: monospace; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.contact-cell { display: flex; flex-direction: column; gap: 3px; }
.contact-phone, .contact-email { display: flex; align-items: center; gap: 5px; font-size: 0.73rem; color: rgba(255,255,255,0.6); white-space: nowrap; }
.plan-cell { font-size: 0.78rem; font-weight: 600; color: #fff; white-space: nowrap; }
.amount-cell { font-weight: 700; color: rgba(255,255,255,0.85); white-space: nowrap; }
.method-cell { color: rgba(255,255,255,0.55); font-size: 0.78rem; white-space: nowrap; }
.date-cell { color: rgba(255,255,255,0.45); font-size: 0.75rem; white-space: nowrap; }
.empty-row { text-align: center; color: rgba(255,255,255,0.25); padding: 36px 16px; }

/* ── Mobile cards (shown on mobile, hidden on desktop) ── */
.mobile-cards { display: flex; flex-direction: column; gap: 8px; }
@media (min-width: 768px) { .mobile-cards { display: none; } }
.txn-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 11px 12px; display: flex; flex-direction: column; gap: 9px; }
.txn-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.txn-user { display: flex; align-items: center; gap: 9px; min-width: 0; }
.txn-user-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.txn-contact { font-size: 0.65rem; color: rgba(255,255,255,0.4); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.txn-card-mid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 10px; }
.txn-detail { display: flex; flex-direction: column; gap: 1px; }
.txn-detail-label { font-size: 0.56rem; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 0.08em; text-transform: uppercase; }
.txn-detail-val { font-size: 0.72rem; color: rgba(255,255,255,0.75); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.txn-amount { color: #fff; font-weight: 800; }
.txn-card-bot { display: flex; justify-content: flex-end; }

/* ── Shared status + delete ── */
.status-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 9999px; font-size: 0.65rem; font-weight: 700; white-space: nowrap; flex-shrink: 0; }
.status-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.status-success { background: rgba(0,255,157,0.1); border: 1px solid rgba(0,255,157,0.25); color: #00ff9d; }
.status-success .status-dot { background: #00ff9d; }
.status-failed { background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25); color: #f87171; }
.status-failed .status-dot { background: #f87171; }
.status-pending { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.25); color: #f59e0b; }
.status-pending .status-dot { background: #f59e0b; }
.del-btn { display: flex; align-items: center; gap: 5px; padding: 5px 10px; background: rgba(220,38,38,0.08); border: 1px solid rgba(220,38,38,0.2); border-radius: 7px; color: #f87171; font-size: 0.68rem; font-weight: 600; cursor: pointer; }
.del-btn:hover { background: rgba(220,38,38,0.18); }

.clear-all-btn {
  display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
  padding: 7px 14px; background: rgba(248,113,113,0.1); border: 1px solid rgba(248,113,113,0.25);
  color: #f87171; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer;
  transition: background 0.15s;
}
.clear-all-btn:hover { background: rgba(248,113,113,0.2); }

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
.btn-confirm-del:hover { background: rgba(239,68,68,1); }
</style>
