<template>
  <div class="tab-page">
    <div class="tab-header">
      <div>
        <h1 class="tab-title">Subscription Plans</h1>
        <p class="tab-sub">Manage plans users see when subscribing. Changes apply immediately.</p>
      </div>
      <button class="add-btn" @click="openAdd">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Plan
      </button>
    </div>

    <!-- Plan cards -->
    <div v-if="dbSubPlans.length === 0 && !subPlansLoading" class="empty-notice">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
      <p>No plans configured yet. The default plans (1-Day 5,000 UGX &amp; 1-Week 25,000 UGX) will be shown to users.</p>
      <button class="add-btn" @click="openAdd">Add First Plan</button>
    </div>

    <div class="plans-grid">
      <div v-for="plan in dbSubPlans" :key="plan.key" class="plan-card" :class="{ 'plan-card--popular': plan.popular, 'plan-card--inactive': !plan.active }">
        <div class="plan-badges">
          <span v-if="plan.popular" class="badge-popular">POPULAR</span>
          <span v-if="!plan.active" class="badge-inactive">INACTIVE</span>
        </div>
        <div class="plan-name">{{ plan.name }}</div>
        <div class="plan-price">
          <span class="price-val">{{ plan.price.toLocaleString() }}</span>
          <span class="price-ugx">UGX</span>
        </div>
        <div class="plan-duration">{{ plan.duration }}</div>
        <div class="plan-days">{{ plan.days }} day{{ plan.days !== 1 ? 's' : '' }} access</div>
        <div class="plan-actions">
          <button class="btn-edit" @click="openEdit(plan)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button class="btn-toggle" @click="toggleActive(plan)">
            {{ plan.active ? 'Deactivate' : 'Activate' }}
          </button>
          <button class="btn-delete" @click="confirmDelete(plan)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Default plans notice -->
    <div v-if="dbSubPlans.length > 0" class="default-notice">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.6)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      Only <strong>active</strong> plans are shown to users. If no active plans exist, default plans are shown as fallback.
    </div>

    <!-- Add / Edit Modal -->
    <div v-if="showForm" class="form-overlay" @click.self="closeForm">
      <div class="form-box">
        <button class="form-close" @click="closeForm">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <h2 class="form-title">{{ editKey ? 'Edit Plan' : 'Add New Plan' }}</h2>

        <div class="form-field">
          <label class="form-label">Plan Name *</label>
          <input v-model="form.name" class="form-input" placeholder="e.g. 1 Week Pass" />
        </div>
        <div class="form-row">
          <div class="form-field">
            <label class="form-label">Price (UGX) *</label>
            <input v-model.number="form.price" type="number" min="0" class="form-input" placeholder="25000" />
          </div>
          <div class="form-field">
            <label class="form-label">Duration (days) *</label>
            <input v-model.number="form.days" type="number" min="1" class="form-input" placeholder="7" @input="autoDuration" />
          </div>
        </div>
        <div class="form-field">
          <label class="form-label">Duration Label</label>
          <input v-model="form.duration" class="form-input" placeholder="e.g. 1 Week" />
          <span class="form-hint">Auto-filled from days. You can customize.</span>
        </div>
        <div class="form-checks">
          <label class="check-label">
            <input type="checkbox" v-model="form.popular" class="check-box" />
            <span>Mark as Popular</span>
          </label>
          <label class="check-label">
            <input type="checkbox" v-model="form.active" class="check-box" />
            <span>Active (visible to users)</span>
          </label>
        </div>

        <p v-if="formError" class="form-err">{{ formError }}</p>

        <div class="form-btns">
          <button class="btn-cancel" @click="closeForm">Cancel</button>
          <button class="btn-save" :disabled="saving" @click="savePlan">
            {{ saving ? 'Saving…' : (editKey ? 'Save Changes' : 'Add Plan') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete confirm -->
    <div v-if="deleteTarget" class="form-overlay" @click.self="deleteTarget = null">
      <div class="form-box form-box--sm">
        <h2 class="form-title">Delete Plan?</h2>
        <p class="form-sub">Are you sure you want to delete <strong>{{ deleteTarget.name }}</strong>? This cannot be undone.</p>
        <div class="form-btns">
          <button class="btn-cancel" @click="deleteTarget = null">Cancel</button>
          <button class="btn-save btn-save--red" :disabled="saving" @click="doDelete">
            {{ saving ? 'Deleting…' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dbSubPlans, subPlansLoading, addSubPlan, updateSubPlan, removeSubPlan } from '../../store/subscriptionPlans'
import type { SubPlan } from '../../store/subscriptionPlans'

const showForm = ref(false)
const editKey = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const toast = ref('')
const deleteTarget = ref<SubPlan | null>(null)

const form = ref({
  name: '',
  price: 0,
  days: 1,
  duration: '',
  popular: false,
  active: true,
})

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3000)
}

function autoDuration() {
  const d = form.value.days
  if (!d || d < 1) return
  if (d === 1) form.value.duration = '1 Day'
  else if (d === 7) form.value.duration = '1 Week'
  else if (d === 14) form.value.duration = '2 Weeks'
  else if (d === 30) form.value.duration = '1 Month'
  else form.value.duration = `${d} Days`
}

function openAdd() {
  editKey.value = null
  form.value = { name: '', price: 0, days: 1, duration: '1 Day', popular: false, active: true }
  formError.value = ''
  showForm.value = true
}

function openEdit(plan: SubPlan) {
  editKey.value = plan.key
  form.value = {
    name: plan.name,
    price: plan.price,
    days: plan.days,
    duration: plan.duration,
    popular: plan.popular,
    active: plan.active,
  }
  formError.value = ''
  showForm.value = true
}

function closeForm() {
  showForm.value = false
  editKey.value = null
  formError.value = ''
}

async function savePlan() {
  if (!form.value.name.trim()) { formError.value = 'Plan name is required.'; return }
  if (!form.value.price || form.value.price < 0) { formError.value = 'Enter a valid price.'; return }
  if (!form.value.days || form.value.days < 1) { formError.value = 'Duration must be at least 1 day.'; return }
  if (!form.value.duration.trim()) autoDuration()

  saving.value = true
  formError.value = ''
  try {
    const data = {
      name: form.value.name.trim(),
      price: form.value.price,
      days: form.value.days,
      duration: form.value.duration.trim() || `${form.value.days} Days`,
      popular: form.value.popular,
      active: form.value.active,
      createdAt: new Date().toISOString(),
    }
    if (editKey.value) {
      await updateSubPlan(editKey.value, data)
      showToast('✓ Plan updated')
    } else {
      await addSubPlan(data)
      showToast('✓ Plan added')
    }
    closeForm()
  } catch (e: any) {
    formError.value = e?.message || 'Failed to save plan.'
  }
  saving.value = false
}

async function toggleActive(plan: SubPlan) {
  try {
    await updateSubPlan(plan.key, { active: !plan.active })
    showToast(plan.active ? 'Plan deactivated' : 'Plan activated')
  } catch (_) {
    showToast('Failed to update plan')
  }
}

function confirmDelete(plan: SubPlan) {
  deleteTarget.value = plan
}

async function doDelete() {
  if (!deleteTarget.value) return
  saving.value = true
  try {
    await removeSubPlan(deleteTarget.value.key)
    showToast('Plan deleted')
    deleteTarget.value = null
  } catch (_) {
    showToast('Failed to delete plan')
  }
  saving.value = false
}
</script>

<style scoped>
.tab-page { padding: 28px 24px; position: relative; }
@media (max-width: 640px) { .tab-page { padding: 16px 12px; } }
.tab-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
.tab-title { font-size: 1.4rem; font-weight: 900; color: #fff; margin-bottom: 4px; }
.tab-sub { font-size: 0.78rem; color: rgba(255,255,255,0.38); }

.add-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 16px; background: rgba(0,255,157,0.12); border: 1px solid rgba(0,255,157,0.3);
  color: #00ff9d; border-radius: 9px; font-size: 0.78rem; font-weight: 700; cursor: pointer;
  transition: background 0.2s, transform 0.15s; white-space: nowrap; flex-shrink: 0;
}
.add-btn:hover { background: rgba(0,255,157,0.2); transform: translateY(-1px); }

.empty-notice {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 48px 24px; text-align: center; color: rgba(255,255,255,0.35);
  border: 1px dashed rgba(255,255,255,0.1); border-radius: 14px; margin-bottom: 24px;
}
.empty-notice p { font-size: 0.82rem; max-width: 420px; line-height: 1.5; }

.plans-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; margin-bottom: 20px; }
.plan-card {
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 14px; padding: 18px 16px; position: relative;
  transition: border-color 0.2s, background 0.2s;
}
.plan-card--popular { border-color: rgba(0,255,157,0.3); background: rgba(0,255,157,0.03); }
.plan-card--inactive { opacity: 0.5; }

.plan-badges { display: flex; gap: 6px; margin-bottom: 10px; min-height: 18px; }
.badge-popular { font-size: 0.58rem; font-weight: 800; letter-spacing: 0.08em; padding: 2px 8px; border-radius: 99px; background: linear-gradient(135deg, #00ff9d, #00d4ff); color: #021a10; }
.badge-inactive { font-size: 0.58rem; font-weight: 800; padding: 2px 8px; border-radius: 99px; background: rgba(248,113,113,0.15); border: 1px solid rgba(248,113,113,0.3); color: #f87171; letter-spacing: 0.06em; }

.plan-name { font-size: 1rem; font-weight: 800; color: #fff; margin-bottom: 6px; }
.plan-price { display: flex; align-items: baseline; gap: 4px; margin-bottom: 4px; }
.price-val { font-size: 1.6rem; font-weight: 900; color: #fff; line-height: 1; }
.price-ugx { font-size: 0.65rem; font-weight: 700; color: rgba(0,255,157,0.7); }
.plan-duration { font-size: 0.75rem; color: rgba(255,255,255,0.45); font-weight: 600; margin-bottom: 2px; }
.plan-days { font-size: 0.68rem; color: rgba(0,255,157,0.5); font-weight: 600; margin-bottom: 14px; }

.plan-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.btn-edit, .btn-toggle, .btn-delete {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 10px; border-radius: 7px; font-size: 0.68rem; font-weight: 700;
  cursor: pointer; border: 1px solid transparent; transition: background 0.15s, transform 0.1s;
}
.btn-edit:hover, .btn-toggle:hover, .btn-delete:hover { transform: translateY(-1px); }
.btn-edit { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.7); }
.btn-edit:hover { background: rgba(255,255,255,0.1); }
.btn-toggle { background: rgba(0,212,255,0.1); border-color: rgba(0,212,255,0.25); color: #00d4ff; }
.btn-toggle:hover { background: rgba(0,212,255,0.18); }
.btn-delete { background: rgba(248,113,113,0.1); border-color: rgba(248,113,113,0.25); color: #f87171; }
.btn-delete:hover { background: rgba(248,113,113,0.18); }

.default-notice {
  display: flex; align-items: flex-start; gap: 8px;
  padding: 12px 16px; background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.15);
  border-radius: 10px; color: rgba(255,255,255,0.5); font-size: 0.75rem; line-height: 1.5;
}
.default-notice strong { color: rgba(255,255,255,0.8); }

/* Form modal */
.form-overlay {
  position: fixed; inset: 0; z-index: 500;
  display: flex; align-items: center; justify-content: center; padding: 16px;
  background: rgba(0,0,0,0.8); backdrop-filter: blur(12px);
}
.form-box {
  position: relative; width: 100%; max-width: 420px;
  background: rgba(8,16,12,0.99); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px; padding: 24px 20px;
  box-shadow: 0 32px 64px rgba(0,0,0,0.7);
  max-height: 90vh; overflow-y: auto;
}
.form-box--sm { max-width: 340px; }
.form-close {
  position: absolute; top: 12px; right: 12px;
  width: 24px; height: 24px; border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.45); cursor: pointer;
}
.form-close:hover { background: rgba(255,255,255,0.1); color: #fff; }
.form-title { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 18px; }
.form-sub { font-size: 0.82rem; color: rgba(255,255,255,0.5); margin-bottom: 20px; line-height: 1.5; }
.form-sub strong { color: #fff; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.form-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.form-label { font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 0.04em; }
.form-input {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 9px; padding: 9px 12px; color: #fff; font-size: 0.88rem; outline: none;
  transition: border-color 0.2s;
}
.form-input:focus { border-color: rgba(0,255,157,0.4); }
.form-hint { font-size: 0.62rem; color: rgba(255,255,255,0.25); }
.form-checks { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.check-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.82rem; color: rgba(255,255,255,0.65); }
.check-box { width: 15px; height: 15px; accent-color: #00ff9d; cursor: pointer; }
.form-err { font-size: 0.72rem; color: #f87171; margin-bottom: 12px; }
.form-btns { display: flex; gap: 10px; margin-top: 4px; }
.btn-cancel {
  flex: 1; padding: 10px; background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  color: rgba(255,255,255,0.6); font-size: 0.78rem; font-weight: 700; cursor: pointer;
}
.btn-cancel:hover { background: rgba(255,255,255,0.09); }
.btn-save {
  flex: 2; padding: 10px; background: linear-gradient(135deg, #00ff9d, #00c8b8);
  border: none; border-radius: 10px; color: #021a10;
  font-size: 0.78rem; font-weight: 800; cursor: pointer; transition: filter 0.2s;
}
.btn-save:hover { filter: brightness(1.08); }
.btn-save:disabled { opacity: 0.5; cursor: default; filter: none; }
.btn-save--red { background: linear-gradient(135deg, #f87171, #ef4444); }

.toast {
  position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
  background: rgba(0,20,12,0.95); border: 1px solid rgba(0,255,157,0.3);
  color: #00ff9d; padding: 12px 24px; border-radius: 10px;
  font-size: 0.85rem; font-weight: 600; z-index: 9999;
  backdrop-filter: blur(12px); white-space: nowrap;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
</style>
