<template>
  <div class="min-h-screen w-full flex flex-col">
    <AppHeader v-if="!isAdminRoute" />
    <div class="flex-1">
      <RouterView />
    </div>
    <AppFooter v-if="!isAdminRoute" />

    <LoginModal v-if="!isAdminRoute" :open="loginOpen" @close="loginOpen = false" @logged-in="loginOpen = false" />
    <SubscribeModal v-if="!isAdminRoute" :open="subscribeOpen" @close="subscribeOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LoginModal from './components/LoginModal.vue'
import SubscribeModal from './components/SubscribeModal.vue'
import { loginOpen, subscribeOpen } from './store/ui'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))
</script>
