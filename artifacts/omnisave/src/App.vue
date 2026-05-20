<template>
  <div class="min-h-screen w-full flex flex-col">
    <AppHeader v-if="!isAdmin" @open-login="loginOpen = true" @open-subscribe="subscribeOpen = true" />
    <div class="flex-1">
      <RouterView />
    </div>
    <AppFooter v-if="!isAdmin" />

    <LoginModal v-if="!isAdmin" :open="loginOpen" @close="loginOpen = false" />
    <SubscribeModal v-if="!isAdmin" :open="subscribeOpen" @close="subscribeOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LoginModal from './components/LoginModal.vue'
import SubscribeModal from './components/SubscribeModal.vue'

const loginOpen = ref(false)
const subscribeOpen = ref(false)

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>
