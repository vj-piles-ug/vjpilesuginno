import { reactive, watch } from 'vue'

export const SUB_DURATIONS = ['1-Day', '2-Days', '1-Week', '2-Weeks', '1-Month'] as const
export type SubDuration = typeof SUB_DURATIONS[number]
export const PLANS = ['Basic', 'Standard', 'Premium'] as const
export type Plan = typeof PLANS[number]
export type UserStatus = 'active' | 'inactive' | 'blocked'

export interface AdminMovie {
  id: number
  title: string
  category: string
  streamUrl: string
  posterUrl: string
  rating: number
  year: number
  trending: boolean
  createdAt: string
}

export interface Episode {
  id: number
  seriesId: number
  title: string
  season: number
  episode: number
  url: string
}

export interface AdminSeries {
  id: number
  title: string
  category: string
  posterUrl: string
  rating: number
  year: number
  createdAt: string
}

export interface AdminUser {
  id: number
  name: string
  email: string
  status: UserStatus
  subscription: SubDuration | null
  subStart: string | null
  subExpires: string | null
  joinedAt: string
  lastLogin: string | null
  avatarUrl?: string
}

export interface Activity {
  id: number
  userId: number
  userName: string
  title: string
  type: string
  watchedAt: string
}

export interface CarouselItem {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  linkContent: string
}

export interface Transaction {
  id: number
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

function load<T>(key: string, def: T): T {
  try {
    const s = localStorage.getItem('admin_' + key)
    return s ? JSON.parse(s) : def
  } catch { return def }
}

function save(key: string, val: unknown) {
  localStorage.setItem('admin_' + key, JSON.stringify(val))
}

export const adminStore = reactive({
  movies: load<AdminMovie[]>('movies2', [
    { id: 1, title: 'The Expendables 2', category: 'Action', streamUrl: 'https://example.com/expendables2.mp4', posterUrl: '', rating: 6.6, year: 2012, trending: false, createdAt: '2024-01-10' },
    { id: 2, title: 'John Wick 4', category: 'Action', streamUrl: 'https://example.com/johnwick4.mp4', posterUrl: '', rating: 7.7, year: 2023, trending: true, createdAt: '2024-01-15' },
    { id: 3, title: 'Spider-Man: Across the Spider-Verse', category: 'Animation', streamUrl: 'https://example.com/spiderman.mp4', posterUrl: '', rating: 8.6, year: 2023, trending: true, createdAt: '2024-02-01' },
  ]),

  series: load<AdminSeries[]>('series2', [
    { id: 1, title: 'Breaking Bad', category: 'Drama', posterUrl: '', rating: 9.5, year: 2008, createdAt: '2024-01-15' },
    { id: 2, title: 'Stranger Things', category: 'Drama', posterUrl: '', rating: 8.7, year: 2016, createdAt: '2024-01-20' },
    { id: 3, title: 'The Last of Us', category: 'Action', posterUrl: '', rating: 8.8, year: 2023, createdAt: '2024-02-10' },
  ]),

  episodes: load<Episode[]>('episodes', [
    { id: 1, seriesId: 1, title: 'Pilot', season: 1, episode: 1, url: 'https://example.com/bb-s1e1.mp4' },
    { id: 2, seriesId: 1, title: "Cat's in the Bag", season: 1, episode: 2, url: 'https://example.com/bb-s1e2.mp4' },
    { id: 3, seriesId: 2, title: 'The Vanishing of Will Byers', season: 1, episode: 1, url: 'https://example.com/st-s1e1.mp4' },
  ]),

  users: load<AdminUser[]>('users2', [
    { id: 1, name: 'Raza Pro', email: 'djraza256@gmail.com', status: 'active', subscription: '2-Days', subStart: '2026-05-19', subExpires: '2026-05-21', joinedAt: '2025-11-17', lastLogin: '2025-11-26', avatarUrl: '' },
    { id: 2, name: 'John Mukasa', email: 'john.mukasa@gmail.com', status: 'inactive', subscription: null, subStart: null, subExpires: null, joinedAt: '2024-01-05', lastLogin: '2024-04-12', avatarUrl: '' },
    { id: 3, name: 'Sarah Nakato', email: 'sarah.n@gmail.com', status: 'inactive', subscription: null, subStart: null, subExpires: null, joinedAt: '2024-02-12', lastLogin: '2024-05-01', avatarUrl: '' },
    { id: 4, name: 'Grace Apio', email: 'grace.apio@gmail.com', status: 'inactive', subscription: null, subStart: null, subExpires: null, joinedAt: '2024-03-20', lastLogin: null, avatarUrl: '' },
  ]),

  activities: load<Activity[]>('activities', [
    { id: 1, userId: 1, userName: 'Raza Pro', title: 'The Expendables 2', type: 'MOVIES', watchedAt: '2024-05-10 14:30' },
    { id: 2, userId: 1, userName: 'Raza Pro', title: 'Breaking Bad', type: 'TV SERIES', watchedAt: '2024-05-11 20:15' },
    { id: 3, userId: 2, userName: 'John Mukasa', title: 'Spider-Man: Across the Spider-Verse', type: 'ANIMATION', watchedAt: '2024-05-12 19:00' },
  ]),

  carouselItems: load<CarouselItem[]>('carouselItems', [
    { id: 1, title: '0774356888', subtitle: '', imageUrl: '', linkContent: 'No Link' },
    { id: 2, title: 'Login or call 0774356888', subtitle: '', imageUrl: '', linkContent: 'No Link' },
    { id: 3, title: 'For more info call..0774356888', subtitle: '', imageUrl: '', linkContent: 'No Link' },
  ]),

  transactions: load<Transaction[]>('transactions', [
    { id: 1, userId: 'ba095346-9681-4290', userName: 'Odong Gilbert', phone: '0762797766', email: 'dgjiritan256@gmail.com', plan: '2 Days Pass', amount: 5000, method: 'MTNUG', status: 'Successful', createdAt: '2026-05-20 12:07' },
    { id: 2, userId: 'aca33717-ab9a-4b3f-96', userName: 'Oluba Danish', phone: '0786550273', email: 'denisholubaD@gmail.com', plan: '2 Days Pass', amount: 5000, method: 'MTNUG', status: 'Successful', createdAt: '2026-05-20 11:37' },
    { id: 3, userId: 'a9aa3297-7b1-4999-9', userName: 'Opio Hassan okello', phone: '0783175267', email: 'opiohassanokello05@gmail.com', plan: '2 Days Pass', amount: 5000, method: 'N/A', status: 'Pending', createdAt: '2026-05-20 10:42' },
    { id: 4, userId: 'admin-17792862023', userName: '', phone: '', email: '', plan: '2 Days Pass', amount: 0, method: 'Admin Activation', status: 'Successful', createdAt: '2026-05-20 10:41' },
    { id: 5, userId: '0cee2c9b-2b3-491-8', userName: 'Opio Hassan okello', phone: '2567xxx66060', email: 'opiohassanokello05@gmail.com', plan: '2 Days Pass', amount: 5000, method: 'MTNUG', status: 'Failed', createdAt: '2026-05-20 10:30' },
  ]),

  nextMovieId: load<number>('nextMovieId2', 4),
  nextSeriesId: load<number>('nextSeriesId2', 4),
  nextEpisodeId: load<number>('nextEpisodeId', 4),
  nextUserId: load<number>('nextUserId', 5),
  nextActivityId: load<number>('nextActivityId', 4),
  nextCarouselId: load<number>('nextCarouselId', 4),
  nextTransactionId: load<number>('nextTransactionId', 6),
})

watch(() => adminStore.movies, v => save('movies2', v), { deep: true })
watch(() => adminStore.series, v => save('series2', v), { deep: true })
watch(() => adminStore.episodes, v => save('episodes', v), { deep: true })
watch(() => adminStore.users, v => save('users2', v), { deep: true })
watch(() => adminStore.activities, v => save('activities', v), { deep: true })
watch(() => adminStore.carouselItems, v => save('carouselItems', v), { deep: true })
watch(() => adminStore.transactions, v => save('transactions', v), { deep: true })
watch(() => adminStore.nextMovieId, v => save('nextMovieId2', v))
watch(() => adminStore.nextSeriesId, v => save('nextSeriesId2', v))
watch(() => adminStore.nextEpisodeId, v => save('nextEpisodeId', v))
watch(() => adminStore.nextUserId, v => save('nextUserId', v))
watch(() => adminStore.nextActivityId, v => save('nextActivityId', v))
watch(() => adminStore.nextCarouselId, v => save('nextCarouselId', v))
watch(() => adminStore.nextTransactionId, v => save('nextTransactionId', v))
