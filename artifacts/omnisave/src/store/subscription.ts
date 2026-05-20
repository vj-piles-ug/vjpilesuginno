import { ref, computed, watch } from 'vue'
import { ref as dbRef, onValue, set } from 'firebase/database'
import { db } from '../lib/firebase'
import { currentUser, isAdmin } from './auth'

export const userSubscription = ref<any>(null)
export const subLoading = ref(true)

export const isSubscribed = computed(() => {
  if (isAdmin.value) return true
  const sub = userSubscription.value
  if (!sub || !sub.active) return false
  return new Date(sub.endDate) > new Date()
})

export async function activateSubscription(
  userId: string,
  plan: { id: string; name: string; price: number; days: number },
  orderTrackingId: string,
  status: { paymentMethod: string; confirmationCode: string; paymentAccount: string; amount: number }
) {
  const startDate = new Date()
  const endDate = new Date()
  endDate.setDate(endDate.getDate() + plan.days)
  await set(dbRef(db, `subscriptions/${userId}`), {
    planId: plan.id,
    planName: plan.name,
    amount: status.amount || plan.price,
    days: plan.days,
    orderTrackingId,
    confirmationCode: status.confirmationCode || '',
    paymentMethod: status.paymentMethod || 'PesaPal',
    phoneNumber: status.paymentAccount || '',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    active: true,
    createdAt: new Date().toISOString(),
  })
}

let unsubFn: (() => void) | null = null

watch(
  currentUser,
  (user) => {
    if (unsubFn) { unsubFn(); unsubFn = null }
    if (!user) {
      userSubscription.value = null
      subLoading.value = false
      return
    }
    subLoading.value = true
    const r = dbRef(db, `subscriptions/${user.uid}`)
    unsubFn = onValue(r, (snap) => {
      userSubscription.value = snap.exists() ? snap.val() : null
      subLoading.value = false
    }, () => {
      userSubscription.value = null
      subLoading.value = false
    })
  },
  { immediate: true }
)
