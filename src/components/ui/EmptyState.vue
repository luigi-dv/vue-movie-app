<script setup>
defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' }
})
</script>

<template>
  <div class="bg-field text-on-field px-6 py-14 sm:px-12 sm:py-20">
    <p class="text-title font-semibold max-w-[18ch]">{{ title }}</p>
    <p v-if="text" class="mt-4 max-w-[48ch] text-field-soft">{{ text }}</p>
    <div v-if="$slots.default" class="mt-8 flex flex-wrap gap-3">
      <slot></slot>
    </div>
  </div>
</template>
