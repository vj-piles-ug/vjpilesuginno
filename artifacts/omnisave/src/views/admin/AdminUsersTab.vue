<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">User Management</h1>
        <p class="tab-sub">{{ adminStore.users.length }} users total · {{ activeCount }} active · {{ blockedCount }} blocked</p>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button v-for="f in filters" :key="f.key" @click="filter = f.key" :class="['filter-btn', { active: filter === f.key }]">
        {{ f.label }}
        <span class="filter-count">{{ f.count }}</span>
      </button>
    </div>

    <!-- Users table -->
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Email</th><th>Status</th><th>Subscription</th><th>Joined</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="u in filteredUsers" :key="u.id">
            <tr :class="{ 'row-expanded': expandedId === u.id }">
              <td class="td-id">{{ u.id }}</td>
              <td class="td-title">{{ u.name }}</td>
              <td class="td-email">{{ u.email }}</td>
              <td>
                <span class="status-badge" :class="'status-' + u.status">{{ u.status }}</span>
              </td>
              <td>
                <span v-if="u.subscription" class="plan-badge" :class="'plan-' + u.subscription.toLowerCase()">
                  {{ u.subscription }}
                </span>
                <span v-else class="no-plan">—</span>
              </td>
              <td class="td-date">{{ u.joinedAt }}</td>
              <td class="td-actions">
                <!-- Active user actions -->
                <template v-if="u.status === 'active'">
                  <button class="btn-action btn-upgrade" @click="upgrade(u)" :disabled="u.subscription === 'Premium'" title="Upgrade plan">▲ Upgrade</button>
                  <button class="btn-action btn-downgrade" @click="downgrade(u)" :disabled="u.subscription === 'Basic'" title="Downgrade plan">▼ Downgrade</button>
                  <button class="btn-action btn-deactivate" @click="deactivate(u)" title="Deactivate subscription">Deactivate</button>
                  <button class="btn-action btn-block" @click="block(u)" title="Block user">Block</button>
                </template>

                <!-- Inactive user actions -->
                <template v-else-if="u.status === 'inactive'">
                  <button class="btn-action btn-activate-toggle" @click="toggleActivate(u.id)">
                    {{ expandedId === u.id ? 'Cancel' : 'Activate Sub' }}
                  </button>
                  <button class="btn-action btn-block" @click="block(u)">Block</button>
                </template>

                <!-- Blocked user actions -->
                <template v-else-if="u.status === 'blocked'">
                  <button class="btn-action btn-unblock" @click="unblock(u)">Unblock</button>
                </template>
              </td>
            </tr>

            <!-- Inline subscription activation row -->
            <tr v-if="expandedId === u.id && u.status === 'inactive'" class="activate-row">
              <td colspan="7">
                <div class="activate-panel">
                  <p class="activate-label">Select a subscription plan for <strong>{{ u.name }}</strong>:</p>
                  <div class="plan-grid">
                    <button
                      v-for="plan in PLANS"
                      :key="plan"
                      @click="activateWithPlan(u, plan)"
                      class="plan-option"
                      :class="'plan-opt-' + plan.toLowerCase()"
                    >
                      <span class="plan-opt-name">{{ plan }}</span>
                      <span class="plan-opt-price">{{ planPrice(plan) }}</span>
                      <span class="plan-opt-cta">Activate →</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="filteredUsers.length === 0">
            <td colspan="7" class="empty-row">No users in this filter.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { adminStore, PLANS, type Plan, type AdminUser } from '../../store/admin'

const filter = ref<'all' | 'active' | 'inactive' | 'blocked'>('all')
const expandedId = ref<number | null>(null)
const toast = ref('')

const activeCount = computed(() => adminStore.users.filter(u => u.status === 'active').length)
const blockedCount = computed(() => adminStore.users.filter(u => u.status === 'blocked').length)
const inactiveCount = computed(() => adminStore.users.filter(u => u.status === 'inactive').length)

const filters = computed(() => [
  { key: 'all', label: 'All', count: adminStore.users.length },
  { key: 'active', label: 'Active', count: activeCount.value },
  { key: 'inactive', label: 'Inactive', count: inactiveCount.value },
  { key: 'blocked', label: 'Blocked', count: blockedCount.value },
] as const)

const filteredUsers = computed(() => filter.value === 'all' ? adminStore.users : adminStore.users.filter(u => u.status === filter.value))

function planPrice(plan: Plan) {
  if (plan === 'Basic') return 'UGX 5,000/mo'
  if (plan === 'Standard') return 'UGX 15,000/mo'
  return 'UGX 30,000/mo'
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2500)
}

function toggleActivate(id: number) {
  expandedId.value = expandedId.value === id ? null : id
}

function activateWithPlan(u: AdminUser, plan: Plan) {
  u.status = 'active'
  u.subscription = plan
  expandedId.value = null
  showToast(`✓ ${u.name} activated with ${plan} plan`)
}

function deactivate(u: AdminUser) {
  if (!confirm(`Deactivate ${u.name}'s subscription?`)) return
  u.status = 'inactive'
  u.subscription = null
  showToast(`${u.name}'s subscription deactivated`)
}

function upgrade(u: AdminUser) {
  const idx = PLANS.indexOf(u.subscription as Plan)
  if (idx < PLANS.length - 1) {
    u.subscription = PLANS[idx + 1]
    showToast(`✓ ${u.name} upgraded to ${u.subscription}`)
  }
}

function downgrade(u: AdminUser) {
  const idx = PLANS.indexOf(u.subscription as Plan)
  if (idx > 0) {
    u.subscription = PLANS[idx - 1]
    showToast(`${u.name} downgraded to ${u.subscription}`)
  }
}

function block(u: AdminUser) {
  if (!confirm(`Block ${u.name}?`)) return
  u.status = 'blocked'
  u.subscription = null
  showToast(`${u.name} has been blocked`)
}

function unblock(u: AdminUser) {
  u.status = 'inactive'
  showToast(`✓ ${u.name} unblocked`)
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; position: relative; }
.tab-header { margin-bottom: 20px; }
.tab-title { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.8rem; color: rgba(255,255,255,0.4); }

.filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.filter-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 7px 16px; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.5);
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em; cursor: pointer; transition: all 0.15s;
}
.filter-btn:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.85); }
.filter-btn.active { background: rgba(0,255,157,0.12); border-color: rgba(0,255,157,0.4); color: #00ff9d; }
.filter-count { background: rgba(255,255,255,0.1); border-radius: 9999px; padding: 1px 7px; font-size: 0.68rem; }
.filter-btn.active .filter-count { background: rgba(0,255,157,0.2); }

.table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid rgba(255,255,255,0.07); }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; }
.data-table thead th { background: rgba(255,255,255,0.04); padding: 11px 14px; text-align: left; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; }
.data-table tbody tr { border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
.data-table tbody tr:hover { background: rgba(255,255,255,0.025); }
.data-table tbody tr.row-expanded { background: rgba(0,255,157,0.03); }
.data-table td { padding: 11px 14px; color: rgba(255,255,255,0.8); vertical-align: middle; }
.td-id { color: rgba(255,255,255,0.3); font-size: 0.75rem; }
.td-title { font-weight: 600; color: #fff; white-space: nowrap; }
.td-email { color: rgba(255,255,255,0.55); font-size: 0.8rem; }
.td-date { color: rgba(255,255,255,0.4); font-size: 0.78rem; white-space: nowrap; }
.td-actions { white-space: nowrap; display: flex; gap: 6px; flex-wrap: wrap; align-items: center; padding: 8px 14px; }
.empty-row { text-align: center; color: rgba(255,255,255,0.25); padding: 32px; }

.status-badge { font-size: 0.65rem; font-weight: 800; padding: 3px 9px; border-radius: 9999px; letter-spacing: 0.06em; text-transform: uppercase; }
.status-active { background: rgba(0,255,157,0.12); color: #00ff9d; border: 1px solid rgba(0,255,157,0.25); }
.status-inactive { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.45); border: 1px solid rgba(255,255,255,0.1); }
.status-blocked { background: rgba(220,38,38,0.12); color: #f87171; border: 1px solid rgba(220,38,38,0.25); }

.plan-badge { font-size: 0.65rem; font-weight: 800; padding: 3px 9px; border-radius: 6px; letter-spacing: 0.05em; }
.plan-basic { background: rgba(100,200,255,0.1); color: #64c8ff; border: 1px solid rgba(100,200,255,0.2); }
.plan-standard { background: rgba(255,200,0,0.1); color: #ffc800; border: 1px solid rgba(255,200,0,0.2); }
.plan-premium { background: rgba(208,138,255,0.12); color: #d08aff; border: 1px solid rgba(208,138,255,0.25); }
.no-plan { color: rgba(255,255,255,0.2); font-size: 0.8rem; }

.btn-action { border-radius: 6px; padding: 5px 10px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.04em; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; white-space: nowrap; }
.btn-action:disabled { opacity: 0.3; cursor: not-allowed; }
.btn-upgrade { background: rgba(0,255,157,0.1); border-color: rgba(0,255,157,0.25); color: #00ff9d; }
.btn-upgrade:hover:not(:disabled) { background: rgba(0,255,157,0.18); }
.btn-downgrade { background: rgba(255,200,0,0.1); border-color: rgba(255,200,0,0.25); color: #ffc800; }
.btn-downgrade:hover:not(:disabled) { background: rgba(255,200,0,0.18); }
.btn-deactivate { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.6); }
.btn-deactivate:hover { background: rgba(255,255,255,0.1); }
.btn-block { background: rgba(220,38,38,0.1); border-color: rgba(220,38,38,0.25); color: #f87171; }
.btn-block:hover { background: rgba(220,38,38,0.18); }
.btn-activate-toggle { background: rgba(0,255,157,0.12); border-color: rgba(0,255,157,0.35); color: #00ff9d; }
.btn-activate-toggle:hover { background: rgba(0,255,157,0.2); }
.btn-unblock { background: rgba(0,255,157,0.1); border-color: rgba(0,255,157,0.25); color: #00ff9d; }
.btn-unblock:hover { background: rgba(0,255,157,0.18); }

.activate-row td { padding: 0 !important; border-top: none !important; background: rgba(0,255,157,0.03) !important; }
.activate-panel { padding: 16px 20px; }
.activate-label { font-size: 0.82rem; color: rgba(255,255,255,0.6); margin-bottom: 12px; }
.activate-label strong { color: #fff; }
.plan-grid { display: flex; gap: 10px; flex-wrap: wrap; }
.plan-option { display: flex; flex-direction: column; gap: 2px; padding: 12px 20px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.04); cursor: pointer; transition: all 0.15s; text-align: left; min-width: 130px; }
.plan-option:hover { transform: translateY(-1px); }
.plan-opt-basic:hover { border-color: rgba(100,200,255,0.4); background: rgba(100,200,255,0.08); }
.plan-opt-standard:hover { border-color: rgba(255,200,0,0.4); background: rgba(255,200,0,0.08); }
.plan-opt-premium:hover { border-color: rgba(208,138,255,0.4); background: rgba(208,138,255,0.08); }
.plan-opt-name { font-size: 0.85rem; font-weight: 800; color: #fff; }
.plan-opt-price { font-size: 0.72rem; color: rgba(255,255,255,0.45); }
.plan-opt-cta { font-size: 0.7rem; font-weight: 700; color: #00ff9d; margin-top: 4px; }

.toast { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: rgba(0,20,12,0.95); border: 1px solid rgba(0,255,157,0.3); color: #00ff9d; padding: 12px 24px; border-radius: 10px; font-size: 0.85rem; font-weight: 600; z-index: 9999; backdrop-filter: blur(12px); white-space: nowrap; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }

@media (max-width: 640px) {
  .tab-page { padding: 16px 12px; }
  .td-actions { padding: 8px; }
}
</style>
