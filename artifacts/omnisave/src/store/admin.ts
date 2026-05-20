import { reactive, watch } from 'vue'

export const PLANS = ['Basic', 'Standard', 'Premium'] as const
export type Plan = typeof PLANS[number]
export type UserStatus = 'active' | 'inactive' | 'blocked'

export interface AdminMovie {
  id: number
  title: string
  type: 'MOVIES' | 'TV SERIES' | 'ANIMATION'
  url: string
  rating: number
  genres: string
  date: string
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
  url: string
  rating: number
  genres: string
  date: string
  createdAt: string
}

export interface AdminUser {
  id: number
  name: string
  email: string
  status: UserStatus
  subscription: Plan | null
  joinedAt: string
}

export interface Activity {
  id: number
  userId: number
  userName: string
  title: string
  type: string
  watchedAt: string
}

export interface HeroSlide {
  id: number
  title: string
  type: string
  bg: string
  accent: string
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
  movies: load<AdminMovie[]>('movies', [
    { id: 1, title: 'The Expendables 2', type: 'MOVIES', url: 'https://example.com/expendables2.mp4', rating: 6.6, genres: 'Action, Adventure', date: '2012-08-17', createdAt: '2024-01-10' },
    { id: 2, title: 'John Wick 4', type: 'MOVIES', url: 'https://example.com/johnwick4.mp4', rating: 7.7, genres: 'Action, Thriller', date: '2023-03-24', createdAt: '2024-01-15' },
    { id: 3, title: 'Spider-Man: Across the Spider-Verse', type: 'ANIMATION', url: 'https://example.com/spiderman.mp4', rating: 8.6, genres: 'Animation, Action', date: '2023-06-02', createdAt: '2024-02-01' },
    { id: 4, title: 'Breaking Bad', type: 'TV SERIES', url: 'https://example.com/bb.mp4', rating: 9.5, genres: 'Drama, Crime', date: '2008-01-20', createdAt: '2024-02-05' },
  ]),

  series: load<AdminSeries[]>('series', [
    { id: 1, title: 'Breaking Bad', url: 'https://example.com/bb', rating: 9.5, genres: 'Drama, Crime', date: '2008-01-20', createdAt: '2024-01-15' },
    { id: 2, title: 'Stranger Things', url: 'https://example.com/st', rating: 8.7, genres: 'Drama, Fantasy', date: '2016-07-15', createdAt: '2024-01-20' },
    { id: 3, title: 'The Last of Us', url: 'https://example.com/tlou', rating: 8.8, genres: 'Drama, Action', date: '2023-01-15', createdAt: '2024-02-10' },
  ]),

  episodes: load<Episode[]>('episodes', [
    { id: 1, seriesId: 1, title: 'Pilot', season: 1, episode: 1, url: 'https://example.com/bb-s1e1.mp4' },
    { id: 2, seriesId: 1, title: "Cat's in the Bag", season: 1, episode: 2, url: 'https://example.com/bb-s1e2.mp4' },
    { id: 3, seriesId: 1, title: '...And the Bag\'s in the River', season: 1, episode: 3, url: 'https://example.com/bb-s1e3.mp4' },
    { id: 4, seriesId: 2, title: 'The Vanishing of Will Byers', season: 1, episode: 1, url: 'https://example.com/st-s1e1.mp4' },
    { id: 5, seriesId: 2, title: 'The Weirdo on Maple Street', season: 1, episode: 2, url: 'https://example.com/st-s1e2.mp4' },
    { id: 6, seriesId: 3, title: 'When You\'re Lost in the Darkness', season: 1, episode: 1, url: 'https://example.com/tlou-s1e1.mp4' },
  ]),

  users: load<AdminUser[]>('users', [
    { id: 1, name: 'John Mukasa', email: 'john.mukasa@gmail.com', status: 'active', subscription: 'Premium', joinedAt: '2024-01-05' },
    { id: 2, name: 'Sarah Nakato', email: 'sarah.n@gmail.com', status: 'active', subscription: 'Standard', joinedAt: '2024-02-12' },
    { id: 3, name: 'Grace Apio', email: 'grace.apio@gmail.com', status: 'active', subscription: 'Basic', joinedAt: '2024-03-20' },
    { id: 4, name: 'David Otieno', email: 'david.o@yahoo.com', status: 'inactive', subscription: null, joinedAt: '2024-03-08' },
    { id: 5, name: 'Michael Bwire', email: 'michael.b@gmail.com', status: 'inactive', subscription: null, joinedAt: '2024-04-01' },
    { id: 6, name: 'Peter Ssemakula', email: 'peter.s@gmail.com', status: 'blocked', subscription: null, joinedAt: '2024-01-30' },
    { id: 7, name: 'Amina Namutebi', email: 'amina.n@gmail.com', status: 'inactive', subscription: null, joinedAt: '2024-04-15' },
  ]),

  activities: load<Activity[]>('activities', [
    { id: 1, userId: 1, userName: 'John Mukasa', title: 'The Expendables 2', type: 'MOVIES', watchedAt: '2024-05-10 14:30' },
    { id: 2, userId: 1, userName: 'John Mukasa', title: 'Breaking Bad', type: 'TV SERIES', watchedAt: '2024-05-11 20:15' },
    { id: 3, userId: 2, userName: 'Sarah Nakato', title: 'Spider-Man: Across the Spider-Verse', type: 'ANIMATION', watchedAt: '2024-05-12 19:00' },
    { id: 4, userId: 2, userName: 'Sarah Nakato', title: 'Stranger Things', type: 'TV SERIES', watchedAt: '2024-05-13 21:30' },
    { id: 5, userId: 3, userName: 'Grace Apio', title: 'John Wick 4', type: 'MOVIES', watchedAt: '2024-05-14 18:45' },
    { id: 6, userId: 3, userName: 'Grace Apio', title: 'The Last of Us', type: 'TV SERIES', watchedAt: '2024-05-15 20:00' },
    { id: 7, userId: 6, userName: 'Peter Ssemakula', title: 'The Expendables 2', type: 'MOVIES', watchedAt: '2024-04-01 10:00' },
  ]),

  heroSlides: load<HeroSlide[]>('heroSlides', [
    { id: 1, title: 'The Expendables 2', type: 'ACTION  •  ADVENTURE', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0d2a4a 0%, #071220 60%, #050c08 100%)', accent: '#4db8ff' },
    { id: 2, title: 'Breaking Bad', type: 'TV SERIES  •  DRAMA', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a1a08 0%, #100f06 60%, #050c08 100%)', accent: '#ffd700' },
    { id: 3, title: 'Spider-Man: Across the Spider-Verse', type: 'ANIMATION  •  ACTION', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #1a0a3a 0%, #0f0620 60%, #050c08 100%)', accent: '#ff6bde' },
    { id: 4, title: 'The Last of Us', type: 'TV SERIES  •  DRAMA', bg: 'radial-gradient(ellipse 120% 100% at 80% 20%, #0a1f0a 0%, #071207 60%, #050c08 100%)', accent: '#7aff5c' },
  ]),

  nextMovieId: load<number>('nextMovieId', 5),
  nextSeriesId: load<number>('nextSeriesId', 4),
  nextEpisodeId: load<number>('nextEpisodeId', 7),
  nextUserId: load<number>('nextUserId', 8),
  nextActivityId: load<number>('nextActivityId', 8),
  nextSlideId: load<number>('nextSlideId', 5),
})

watch(() => adminStore.movies, v => save('movies', v), { deep: true })
watch(() => adminStore.series, v => save('series', v), { deep: true })
watch(() => adminStore.episodes, v => save('episodes', v), { deep: true })
watch(() => adminStore.users, v => save('users', v), { deep: true })
watch(() => adminStore.activities, v => save('activities', v), { deep: true })
watch(() => adminStore.heroSlides, v => save('heroSlides', v), { deep: true })
watch(() => adminStore.nextMovieId, v => save('nextMovieId', v))
watch(() => adminStore.nextSeriesId, v => save('nextSeriesId', v))
watch(() => adminStore.nextEpisodeId, v => save('nextEpisodeId', v))
watch(() => adminStore.nextUserId, v => save('nextUserId', v))
watch(() => adminStore.nextActivityId, v => save('nextActivityId', v))
watch(() => adminStore.nextSlideId, v => save('nextSlideId', v))
