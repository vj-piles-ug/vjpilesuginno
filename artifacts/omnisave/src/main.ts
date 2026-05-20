import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Movies from './views/Movies.vue'
import Series from './views/Series.vue'
import Animation from './views/Animation.vue'
import AdminDashboard from './views/admin/AdminDashboard.vue'
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

const app = createApp(App)
app.use(router)
app.mount('#app')
