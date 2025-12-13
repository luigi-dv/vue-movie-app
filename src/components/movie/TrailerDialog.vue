<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

defineProps({
  open: { type: Boolean, default: false },
  video: { type: Object, default: null },
  title: { type: String, default: '' }
})
const emit = defineEmits(['close'])
</script>

<template>
  <TransitionRoot :show="open" as="template">
    <Dialog class="relative z-50" @close="emit('close')">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-out" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/85" aria-hidden="true"></div>
      </TransitionChild>

      <div class="fixed inset-0 grid place-items-center p-3 sm:p-8">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100"
          leave="duration-200 ease-out" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="w-full max-w-6xl">
            <div class="mb-3 flex items-center justify-between gap-4 text-white">
              <DialogTitle class="text-lead font-semibold truncate">{{ video?.name || `${title} trailer` }}</DialogTitle>
              <button type="button" class="grid size-12 shrink-0 place-items-center bg-white/10 hover:bg-white/20 transition-colors" @click="emit('close')">
                <XMarkIcon class="size-6" aria-hidden="true" />
                <span class="sr-only">Close trailer</span>
              </button>
            </div>
            <div class="aspect-video bg-black">
              <iframe
                v-if="video"
                :src="`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1`"
                :title="video.name || `${title} trailer`"
                class="size-full"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowfullscreen
              ></iframe>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
