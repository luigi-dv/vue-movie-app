<script setup>
import HomeHero from '@/components/home/HomeHero.vue'
import HomeShowcase from '@/components/home/HomeShowcase.vue'
import HomeProgramme from '@/components/home/HomeProgramme.vue'
import HomeFeatures from '@/components/home/HomeFeatures.vue'
import HomeNumbers from '@/components/home/HomeNumbers.vue'
import HomeLetter from '@/components/home/HomeLetter.vue'
import { usePageTitle } from '@/composables/usePageTitle'

usePageTitle(null)
</script>

<template>
  <div>
    <HomeHero />
    <HomeShowcase />
    <HomeProgramme />
    <HomeFeatures />
    <HomeNumbers />
    <HomeLetter />
  </div>
</template>
