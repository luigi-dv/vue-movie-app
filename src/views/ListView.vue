<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTmdb } from '@/composables/useTmdb'
import { useRouteQuery } from '@/composables/useRouteQuery'
import { usePageTitle } from '@/composables/usePageTitle'
import { usePreferencesStore } from '@/stores/preferences'
import { findList, movieLists, MAX_PAGES } from '@/lib/lists'
import PosterGrid from '@/components/movie/PosterGrid.vue'
import PaginationBar from '@/components/ui/PaginationBar.vue'

const props = defineProps({
  list: { type: String, required: true }
})

const current = computed(() => findList(props.list))
const page = useRouteQuery('page', 1, { transform: (value) => Math.min(Math.max(Number.parseInt(value, 10) || 1, 1), MAX_PAGES) })
const { language } = storeToRefs(usePreferencesStore())

const { data, loading, error, refresh } = useTmdb(
  () => current.value?.path,
  () => ({ ...current.value?.params, language: language.value, page: page.value })
)
const movies = computed(() => data.value?.results ?? [])
const totalPages = computed(() => Math.min(data.value?.total_pages ?? 1, MAX_PAGES))

usePageTitle(() => current.value?.title)
</script>

<template>
  <div class="page-x pt-10 pb-28 lg:pt-16">
    <nav aria-label="Lists" class="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul class="flex w-max gap-6 text-lead font-semibold">
        <li v-for="item in movieLists" :key="item.slug">
          <RouterLink
            :to="`/movies/${item.slug}`"
            class="block py-2 transition-colors duration-150"
            :class="item.slug === list ? 'text-ink' : 'text-soft hover:text-ink'"
            :aria-current="item.slug === list ? 'page' : undefined"
          >
            {{ item.title }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <h1 class="mt-10 text-title font-bold">{{ current.title }}</h1>
    <p class="mt-3 max-w-[60ch] text-lead text-soft">{{ current.description }}</p>

    <PosterGrid class="mt-12" :movies="movies" :loading="loading" :error="error" @retry="refresh" />
    <PaginationBar class="mt-16" :page="page" :total-pages="totalPages" />
  </div>
</template>
