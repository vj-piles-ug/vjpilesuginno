import { ref } from 'vue'
import { ref as dbRef, onValue, push, update, remove, set } from 'firebase/database'
import { db } from '../lib/firebase'

export interface SubPlan {
  key: string
  name: string
  price: number
  days: number
  duration: string
  popular: boolean
  active: boolean
  createdAt: string
}

export const dbSubPlans = ref<SubPlan[]>([])
export const subPlansLoading = ref(true)

// Default fallback plans if none configured in Firebase
export const DEFAULT_PLANS: SubPlan[] = [
  { key: 'default-1day',  name: '1 Day Pass',  price: 5000,  days: 1,  duration: '1 Day',  popular: false, active: true, createdAt: '' },
  { key: 'default-1week', name: '1 Week Pass', price: 25000, days: 7,  duration: '1 Week', popular: true,  active: true, createdAt: '' },
]

onValue(dbRef(db, 'subscriptionPlans'), (snap) => {
  if (!snap.exists()) {
    dbSubPlans.value = []
    subPlansLoading.value = false
    return
  }
  const list: SubPlan[] = []
  snap.forEach((child) => {
    const d = child.val()
    list.push({
      key: child.key!,
      name: d.name || '',
      price: Number(d.price) || 0,
      days: Number(d.days) || 1,
      duration: d.duration || `${d.days} Day(s)`,
      popular: !!d.popular,
      active: d.active !== false,
      createdAt: d.createdAt || '',
    })
  })
  list.sort((a, b) => a.days - b.days)
  dbSubPlans.value = list
  subPlansLoading.value = false
}, () => { subPlansLoading.value = false })

// Active plans for display in subscribe modal
export function getActivePlans(): SubPlan[] {
  const active = dbSubPlans.value.filter(p => p.active)
  return active.length > 0 ? active : DEFAULT_PLANS
}

// CRUD
export async function addSubPlan(data: Omit<SubPlan, 'key'>) {
  return push(dbRef(db, 'subscriptionPlans'), { ...data, createdAt: new Date().toISOString() })
}

export async function updateSubPlan(key: string, data: Partial<Omit<SubPlan, 'key'>>) {
  return update(dbRef(db, `subscriptionPlans/${key}`), data)
}

export async function removeSubPlan(key: string) {
  return remove(dbRef(db, `subscriptionPlans/${key}`))
}
