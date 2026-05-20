import { ref, computed } from 'vue'
import { ref as dbRef, onValue, push, update, remove, set } from 'firebase/database'
import { db } from '../lib/firebase'
import type { Movie, FbEpisode } from '../data/movies'

export type { FbEpisode }

export type SubDuration = '1-Day' | '2-Days' | '1-Week' | '2-Weeks' | '1-Month'

export interface AdminMovie {
  key: string
  title: string
  image: string
  streamlink: string
  category: string
  rating: number
  year: number
  isTrending: boolean
  createdAt: string
}

export interface AdminSeries {
  key: string
  title: string
  image: string
  category: string
  rating: number
  year: number
  createdAt: string
  episodes: FbEpisode[]
}

export interface AdminAnimation {
  key: string
  title: string
  image: string
  streamlink: string
  category: string
  rating: number
  year: number
  isTrending: boolean
  createdAt: string
}

export interface AdminCarousel {
  key: string
  title: string
  subtitle: string
  imageUrl: string
  linkContent: string
}

export interface AdminSubscription {
  planId: string
  planName: string
  startDate: string
  endDate: string
  active: boolean
}

export interface AdminUser {
  uid: string
  name: string
  email: string
  joinedAt: string
  lastLogin?: string
  subscription?: AdminSubscription | null
}

export interface AdminTransaction {
  key: string
  userId: string
  userName: string
  phone: string
  email: string
  plan: string
  amount: number
  method: string
  status: 'Successful' | 'Failed' | 'Pending'
  createdAt: string
}

export const dbMovies = ref<AdminMovie[]>([])
export const dbSeries = ref<AdminSeries[]>([])
export const dbAnimation = ref<AdminAnimation[]>([])
export const dbCarousel = ref<AdminCarousel[]>([])
export const dbUsers = ref<AdminUser[]>([])
export const dbTransactions = ref<AdminTransaction[]>([])
export const dbLoading = ref(true)

// Track which of the 5 content listeners have resolved (success OR error)
const firedFlags = { movies: false, series: false, animation: false, carousel: false, paymentLogs: false }
function checkLoaded(key: keyof typeof firedFlags) {
  firedFlags[key] = true
  if (Object.values(firedFlags).every(Boolean)) {
    dbLoading.value = false
  }
}
// Safety timeout: never leave the user on a loading screen
setTimeout(() => { dbLoading.value = false }, 8000)

function normalizeStatus(status: string | undefined): 'Successful' | 'Failed' | 'Pending' {
  if (!status) return 'Pending'
  const s = status.toLowerCase()
  if (s === 'completed' || s === 'successful' || s === 'success') return 'Successful'
  if (s === 'failed' || s === 'fail' || s === 'reversed') return 'Failed'
  return 'Pending'
}

// ─── Movies ────────────────────────────────────────────────────────────────
onValue(dbRef(db, 'movies'), (snap) => {
  const list: AdminMovie[] = []
  snap.forEach((child) => {
    const d = child.val()
    list.push({
      key: child.key!,
      title: d.title || '',
      image: d.image || '',
      streamlink: d.streamlink || '',
      category: d.category || '',
      rating: Number(d.rating) || 0,
      year: Number(d.year) || 0,
      isTrending: !!d.isTrending,
      createdAt: d.createdAt || '',
    })
  })
  list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  dbMovies.value = list
  checkLoaded('movies')
}, () => { checkLoaded('movies') })

// ─── Series ────────────────────────────────────────────────────────────────
onValue(dbRef(db, 'series'), (snap) => {
  const list: AdminSeries[] = []
  snap.forEach((child) => {
    const d = child.val()
    let eps: FbEpisode[] = []
    if (d.episodes) {
      const raw = d.episodes
      const arr = Array.isArray(raw) ? raw : Object.values(raw)
      eps = arr.filter(Boolean).map((e: any, i: number) => ({
        episodeNumber: Number(e.episodeNumber) || i + 1,
        title: e.title || `Episode ${i + 1}`,
        streamlink: e.streamlink || e.url || '',
      }))
    }
    list.push({
      key: child.key!,
      title: d.title || '',
      image: d.image || '',
      category: d.category || '',
      rating: Number(d.rating) || 0,
      year: Number(d.year) || 0,
      createdAt: d.createdAt || '',
      episodes: eps,
    })
  })
  list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  dbSeries.value = list
  checkLoaded('series')
}, () => { checkLoaded('series') })

// ─── Animation ─────────────────────────────────────────────────────────────
onValue(dbRef(db, 'animation'), (snap) => {
  const list: AdminAnimation[] = []
  snap.forEach((child) => {
    const d = child.val()
    list.push({
      key: child.key!,
      title: d.title || '',
      image: d.image || '',
      streamlink: d.streamlink || '',
      category: d.category || 'Animation',
      rating: Number(d.rating) || 0,
      year: Number(d.year) || 0,
      isTrending: !!d.isTrending,
      createdAt: d.createdAt || '',
    })
  })
  list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  dbAnimation.value = list
  checkLoaded('animation')
}, () => { checkLoaded('animation') })

// ─── Carousel ──────────────────────────────────────────────────────────────
onValue(dbRef(db, 'carousel'), (snap) => {
  const list: AdminCarousel[] = []
  snap.forEach((child) => {
    const d = child.val()
    list.push({
      key: child.key!,
      title: d.title || '',
      subtitle: d.subtitle || '',
      imageUrl: d.imageUrl || '',
      linkContent: d.linkContent || 'No Link',
    })
  })
  dbCarousel.value = list
  checkLoaded('carousel')
}, () => { checkLoaded('carousel') })

// ─── Transactions (paymentLogs + subscriptions merged) ─────────────────────
let logsData: Record<string, any> | null = null
let subsData: Record<string, any> | null = null
let logsReady = false
let subsReady = false

function buildTransactions() {
  if (!logsReady || !subsReady) return
  const map: Record<string, AdminTransaction> = {}

  // 1. Payment logs are primary source
  if (logsData) {
    for (const [key, v] of Object.entries(logsData)) {
      const firstName = v.firstName || v.first_name || ''
      const lastName = v.lastName || v.last_name || ''
      const fullName = v.userName || v.displayName || (firstName || lastName ? `${firstName} ${lastName}`.trim() : '')
      map[key] = {
        key,
        userId: v.userId || '',
        userName: fullName,
        phone: v.phoneNumber || v.phone_number || v.phone || v.payment_account || '',
        email: v.email || '',
        plan: v.planName || v.plan || '',
        amount: Number(v.amount) || 0,
        method: v.paymentMethod || v.payment_method || v.method || '',
        status: normalizeStatus(v.status),
        createdAt: v.createdAt || v.created_at || '',
      }
    }
  }

  // 2. Subscriptions — add entries not already in paymentLogs
  if (subsData) {
    for (const [userId, v] of Object.entries(subsData)) {
      const trackingId = v.orderTrackingId || `sub-${userId}`
      if (!map[trackingId]) {
        const firstName = v.firstName || v.displayName || ''
        const lastName = v.lastName || ''
        const fullName = v.userName || (firstName || lastName ? `${firstName} ${lastName}`.trim() : '')
        map[trackingId] = {
          key: trackingId,
          userId,
          userName: fullName,
          phone: v.paymentPhone || v.phoneNumber || v.phone || '',
          email: v.email || '',
          plan: v.planName || v.planId || '',
          amount: Number(v.amount) || 0,
          method: v.paymentMethod || v.method || 'Admin Activation',
          status: 'Successful',
          createdAt: v.createdAt || v.startDate || '',
        }
      }
    }
  }

  dbTransactions.value = Object.values(map)
  checkLoaded('paymentLogs')
}

onValue(dbRef(db, 'paymentLogs'), (snap) => {
  logsData = snap.exists() ? snap.val() : null
  logsReady = true
  buildTransactions()
}, () => { logsReady = true; buildTransactions() })

onValue(dbRef(db, 'subscriptions'), (snap) => {
  subsData = snap.exists() ? snap.val() : null
  subsReady = true
  buildTransactions()

  // Also update user subscriptions reactively
  const subs: Record<string, AdminSubscription> = {}
  if (snap.exists()) {
    snap.forEach((child) => {
      const v = child.val()
      subs[child.key!] = {
        planId: v.planId || '',
        planName: v.planName || v.planId || '',
        startDate: v.startDate || '',
        endDate: v.endDate || '',
        active: !!v.active,
      }
    })
  }
  dbUsers.value = dbUsers.value.map((u) => ({ ...u, subscription: subs[u.uid] || null }))
}, () => { subsReady = true; buildTransactions() })

// ─── Users (with subscriptions merged) ────────────────────────────────────
function buildUserList(snap: any) {
  const list: AdminUser[] = []
  snap.forEach((child: any) => {
    const d = child.val()
    const uid = child.key!
    const name = d.name || d.displayName || d.email?.split('@')[0] || 'Unknown'
    const sub = subsData?.[uid] ?? null
    list.push({
      uid,
      name,
      email: d.email || '',
      joinedAt: d.joinedAt || d.createdAt?.slice(0, 10) || '',
      lastLogin: d.lastLogin,
      subscription: sub ? {
        planId: sub.planId || '',
        planName: sub.planName || sub.planId || '',
        startDate: sub.startDate || '',
        endDate: sub.endDate || '',
        active: !!sub.active,
      } : null,
    })
  })
  list.sort((a, b) => {
    const aActive = a.subscription?.active && new Date(a.subscription.endDate) > new Date()
    const bActive = b.subscription?.active && new Date(b.subscription.endDate) > new Date()
    if (aActive && !bActive) return -1
    if (!aActive && bActive) return 1
    const da = new Date(a.lastLogin || a.joinedAt || 0).getTime()
    const db2 = new Date(b.lastLogin || b.joinedAt || 0).getTime()
    return db2 - da
  })
  dbUsers.value = list
}

let _usersUnsub: (() => void) | null = null
function registerUsersListener() {
  if (_usersUnsub) _usersUnsub()
  _usersUnsub = onValue(dbRef(db, 'users'), buildUserList, () => { dbUsers.value = [] })
}
registerUsersListener()

export function refreshUsersListener() { registerUsersListener() }

// ─── CRUD: Movies ───────────────────────────────────────────────────────────
export async function addMovie(data: Omit<AdminMovie, 'key'>) {
  return push(dbRef(db, 'movies'), data)
}
export async function updateMovie(key: string, data: Partial<Omit<AdminMovie, 'key'>>) {
  return update(dbRef(db, `movies/${key}`), data)
}
export async function removeMovie(key: string) {
  return remove(dbRef(db, `movies/${key}`))
}

// ─── CRUD: Series ───────────────────────────────────────────────────────────
export async function addSeries(data: Omit<AdminSeries, 'key'>) {
  return push(dbRef(db, 'series'), data)
}
export async function updateSeries(key: string, data: Partial<Omit<AdminSeries, 'key'>>) {
  return update(dbRef(db, `series/${key}`), data)
}
export async function removeSeries(key: string) {
  return remove(dbRef(db, `series/${key}`))
}

// ─── CRUD: Animation ────────────────────────────────────────────────────────
export async function addAnimation(data: Omit<AdminAnimation, 'key'>) {
  return push(dbRef(db, 'animation'), data)
}
export async function updateAnimation(key: string, data: Partial<Omit<AdminAnimation, 'key'>>) {
  return update(dbRef(db, `animation/${key}`), data)
}
export async function removeAnimation(key: string) {
  return remove(dbRef(db, `animation/${key}`))
}

// ─── CRUD: Carousel ─────────────────────────────────────────────────────────
export async function addCarousel(data: Omit<AdminCarousel, 'key'>) {
  return push(dbRef(db, 'carousel'), data)
}
export async function updateCarousel(key: string, data: Partial<Omit<AdminCarousel, 'key'>>) {
  return update(dbRef(db, `carousel/${key}`), data)
}
export async function removeCarousel(key: string) {
  return remove(dbRef(db, `carousel/${key}`))
}

// ─── CRUD: Transactions ──────────────────────────────────────────────────────
export async function removeTransaction(key: string) {
  const safeKey = key.replace(/[.#$[\]]/g, '_')
  return remove(dbRef(db, `paymentLogs/${safeKey}`))
}

// ─── User Subscription Management ────────────────────────────────────────────
const PLAN_DURATIONS: Record<SubDuration, number> = {
  '1-Day': 1, '2-Days': 2, '1-Week': 7, '2-Weeks': 14, '1-Month': 30,
}
const PLAN_NAMES: Record<SubDuration, string> = {
  '1-Day': '1 Day Pass', '2-Days': '2 Days Pass', '1-Week': '1 Week Pass',
  '2-Weeks': '2 Weeks Pass', '1-Month': '1 Month Pass',
}

export async function activateUser(uid: string, plan: SubDuration) {
  const now = new Date()
  const exp = new Date(now.getTime() + PLAN_DURATIONS[plan] * 86400000)
  const sub: AdminSubscription = {
    planId: plan,
    planName: PLAN_NAMES[plan],
    startDate: now.toISOString().slice(0, 10),
    endDate: exp.toISOString().slice(0, 10),
    active: true,
  }
  await set(dbRef(db, `subscriptions/${uid}`), sub)
  await push(dbRef(db, 'paymentLogs'), {
    userId: uid,
    userName: dbUsers.value.find(u => u.uid === uid)?.name || '',
    email: dbUsers.value.find(u => u.uid === uid)?.email || '',
    phone: '',
    plan: PLAN_NAMES[plan],
    planName: PLAN_NAMES[plan],
    amount: 0,
    method: 'Admin Activation',
    paymentMethod: 'Admin Activation',
    status: 'Successful',
    createdAt: now.toISOString().slice(0, 16).replace('T', ' '),
  })
}

export async function deactivateUser(uid: string) {
  return remove(dbRef(db, `subscriptions/${uid}`))
}

// ─── Public reactive content (for frontend views) ────────────────────────────
const BG_COLORS = [
  '#0d2035', '#1a0d2e', '#2a0d0d', '#0d1535', '#1a150d',
  '#0d0d20', '#200d0d', '#100d1a', '#0d1f15', '#200a0a',
  '#0a1f0a', '#1f0a1f', '#0a0a1f', '#1f1a0a',
]

function keyHash(key: string): number {
  return key.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
}

function toPublicMovie(m: AdminMovie, idx: number): Movie {
  const h = keyHash(m.key)
  return {
    id: idx,
    title: m.title,
    type: 'MOVIES',
    rating: m.rating,
    genres: m.category ? [m.category] : ['Action'],
    date: String(m.year || ''),
    color: BG_COLORS[h % BG_COLORS.length],
    image: m.image,
    streamlink: m.streamlink,
    isTrending: m.isTrending,
    category: m.category,
    year: m.year,
    createdAt: m.createdAt,
  }
}

function toPublicSeries(s: AdminSeries, idx: number): Movie {
  const h = keyHash(s.key)
  return {
    id: idx + 10000,
    title: s.title,
    type: 'TV SERIES',
    rating: s.rating,
    genres: s.category ? [s.category] : ['Drama'],
    date: String(s.year || ''),
    color: BG_COLORS[h % BG_COLORS.length],
    image: s.image,
    episodes: s.episodes,
    isTrending: false,
    category: s.category,
    year: s.year,
    createdAt: s.createdAt,
  }
}

function toPublicAnimation(a: AdminAnimation, idx: number): Movie {
  const h = keyHash(a.key)
  return {
    id: idx + 20000,
    title: a.title,
    type: 'ANIMATION',
    rating: a.rating,
    genres: a.category ? [a.category] : ['Animation'],
    date: String(a.year || ''),
    color: BG_COLORS[h % BG_COLORS.length],
    image: a.image,
    streamlink: a.streamlink,
    isTrending: a.isTrending,
    category: a.category,
    year: a.year,
    createdAt: a.createdAt,
  }
}

export const publicMovies = computed<Movie[]>(() => dbMovies.value.map(toPublicMovie))
export const publicSeries = computed<Movie[]>(() => dbSeries.value.map(toPublicSeries))
export const publicAnimation = computed<Movie[]>(() => dbAnimation.value.map(toPublicAnimation))
export const publicAll = computed<Movie[]>(() => {
  const all = [
    ...publicMovies.value,
    ...publicSeries.value,
    ...publicAnimation.value,
  ]
  return all.sort((a, b) =>
    new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  )
})
export const publicTrending = computed<Movie[]>(() =>
  publicAll.value.filter((m) => m.isTrending).slice(0, 24)
)
