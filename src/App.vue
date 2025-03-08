<script setup>
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import FooterBar from "@/components/navigation/FooterBar.vue";
</script>

<template>
  <div>
    <header>
      <NavigationBar />
    </header>
    <div>
      <router-view v-slot="{ Component }">
        <!-- Use any custom transition and fallback to `fade` -->
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path"></component>
        </transition>
      </router-view>
    </div>
    <footer>
      <FooterBar></FooterBar>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>