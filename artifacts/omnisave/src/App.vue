<template>
  <div class="min-h-screen w-full flex flex-col">
    <AppHeader @open-login="loginOpen = true" @open-subscribe="subscribeOpen = true" />
    <div class="flex-1">
      <RouterView />
    </div>
    <AppFooter />

    <LoginModal :open="loginOpen" @close="loginOpen = false" />
    <SubscribeModal :open="subscribeOpen" @close="subscribeOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import LoginModal from './components/LoginModal.vue'
import SubscribeModal from './components/SubscribeModal.vue'

const loginOpen = ref(false)
const subscribeOpen = ref(false)
</script>
