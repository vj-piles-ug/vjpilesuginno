import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Movies from './views/Movies.vue'
import Series from './views/Series.vue'
import Animation from './views/Animation.vue'
import AdminDashboard from './views/admin/AdminDashboard.vue'
import { currentUser, authLoading, isAdmin } from './store/auth'
import './index.css'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home, meta: { nav: 'HOME' } },
    { path: '/movies', component: Movies, meta: { nav: 'MOVIES' } },
    { path: '/series', component: Series, meta: { nav: 'SERIES' } },
    { path: '/animation', component: Animation, meta: { nav: 'ANIMATION' } },
    { path: '/admin', component: AdminDashboard, meta: { admin: true } },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  if (!to.meta.admin) return true
  // Wait for Firebase auth to resolve before checking admin status
  if (authLoading.value) {
    await new Promise<void>((resolve) => {
      const stop = setInterval(() => {
        if (!authLoading.value) { clearInterval(stop); resolve() }
      }, 50)
    })
  }
  if (!isAdmin.value) return { path: '/' }
  return true
})

const app = createApp(App)
app.use(router)
app.mount('#app')
