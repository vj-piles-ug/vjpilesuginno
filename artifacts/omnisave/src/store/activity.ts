import { ref } from 'vue'
import { ref as dbRef, push, onValue, query, limitToLast, orderByKey } from 'firebase/database'
import { db } from '../lib/firebase'
import { currentUser } from './auth'

export interface ActivityEvent {
  key: string
  uid: string
  userEmail: string
  userName: string
  action: string
  page: string
  details: string
  timestamp: string
  device: string
}

export const dbActivities = ref<ActivityEvent[]>([])

// Listen to last 1000 activities for admin panel
onValue(
  query(dbRef(db, 'activities'), orderByKey(), limitToLast(1000)),
  (snap) => {
    const list: ActivityEvent[] = []
    snap.forEach((child) => {
      const d = child.val()
      list.push({
        key: child.key!,
        uid: d.uid || '',
        userEmail: d.userEmail || 'guest',
        userName: d.userName || d.userEmail?.split('@')[0] || 'Guest',
        action: d.action || '',
        page: d.page || '',
        details: d.details || '',
        timestamp: d.timestamp || '',
        device: d.device || '',
      })
    })
    // Most recent first
    dbActivities.value = list.reverse()
  },
  () => { dbActivities.value = [] }
)

export async function trackActivity(action: string, details = '', page = '') {
  try {
    const user = currentUser.value
    // Only write if authenticated (guest tracking requires open Firebase rules)
    if (!user) return
    const ua = navigator.userAgent
    const device = /Mobi|Android|iPhone|iPad|iPod/i.test(ua) ? 'Mobile' : 'Desktop'
    await push(dbRef(db, 'activities'), {
      uid: user.uid,
      userEmail: user.email || '',
      userName: user.displayName || user.email?.split('@')[0] || 'User',
      action,
      page: page || window.location.pathname,
      details,
      timestamp: new Date().toISOString(),
      device,
    })
  } catch (_) {
    // Never let tracking errors break the UI
  }
}
