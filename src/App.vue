<script setup>
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import SearchPalette from '@/components/search/SearchPalette.vue'
</script>

<template>
  <SiteHeader />
  <main id="main" tabindex="-1" class="focus:outline-none">
    <RouterView v-slot="{ Component, route }">
      <Transition name="route" mode="out-in">
        <component :is="Component" :key="route.path" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
  <SearchPalette />
</template>
