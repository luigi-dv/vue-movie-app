<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true }
})

const route = useRoute()

function to(page) {
  const query = { ...route.query }
  if (page === 1) delete query.page
  else query.page = String(page)
  return { query }
}

/** Current page with two neighbours, plus first and last, with gaps collapsed. */
const pages = computed(() => {
  const { page, totalPages } = props
  const set = new Set([1, totalPages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= totalPages))
  const sorted = [...set].sort((a, b) => a - b)
  const items = []
  sorted.forEach((p, i) => {
    if (i && p - sorted[i - 1] > 1) items.push({ gap: true, key: `gap-${p}` })
    items.push({ page: p, key: p })
  })
  return items
})
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Pagination" class="flex flex-wrap items-center justify-between gap-4">
    <RouterLink
      v-if="page > 1"
      :to="to(page - 1)"
      class="btn btn-quiet"
      rel="prev"
    >
      <ArrowLeftIcon class="size-5" aria-hidden="true" /> Previous
    </RouterLink>
    <span v-else></span>

    <ol class="hidden items-center gap-1 sm:flex tabular">
      <li v-for="item in pages" :key="item.key">
        <span v-if="item.gap" class="px-2 text-soft" aria-hidden="true">…</span>
        <RouterLink
          v-else
          :to="to(item.page)"
          :aria-current="item.page === page ? 'page' : undefined"
          class="grid min-w-12 min-h-12 place-items-center px-2 font-semibold transition-colors duration-150"
          :class="item.page === page ? 'bg-accent text-on-accent' : 'hover:bg-surface'"
        >
          <span class="sr-only">Page </span>{{ item.page }}
        </RouterLink>
      </li>
    </ol>
    <p class="text-soft sm:hidden tabular">Page {{ page }} of {{ totalPages }}</p>

    <RouterLink
      v-if="page < totalPages"
      :to="to(page + 1)"
      class="btn btn-quiet"
      rel="next"
    >
      Next <ArrowRightIcon class="size-5" aria-hidden="true" />
    </RouterLink>
    <span v-else></span>
  </nav>
</template>
