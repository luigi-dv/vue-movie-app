<script setup>
defineProps({
  error: { type: [Error, Object], default: null },
  title: { type: String, default: 'This part of the catalogue did not load' }
})
defineEmits(['retry'])
</script>

<template>
  <div role="alert" class="bg-surface px-6 py-10 sm:px-10">
    <p class="text-lead font-semibold">{{ title }}</p>
    <p class="mt-2 max-w-[60ch] text-soft">
      {{ error?.status === 404 ? 'TMDb has no record for this one.' : 'TMDb did not answer in time, or the connection dropped.' }}
      <span v-if="error?.message" class="block mt-1 text-small">{{ error.message }}</span>
    </p>
    <button type="button" class="btn btn-primary mt-6" @click="$emit('retry')">Try again</button>
  </div>
</template>
