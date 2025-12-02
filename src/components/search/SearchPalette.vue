<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { refDebounced, useEventListener } from '@vueuse/core'
import {
  Combobox, ComboboxInput, ComboboxOptions, ComboboxOption,
  Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild
} from '@headlessui/vue'
import { MagnifyingGlassIcon, ClockIcon, FilmIcon, UserIcon } from '@heroicons/vue/24/outline'
import { imageUrl } from '@/api/tmdb'
import { useTmdb } from '@/composables/useTmdb'
import { useSearchStore } from '@/stores/search'
import { usePreferencesStore } from '@/stores/preferences'

const router = useRouter()
const search = useSearchStore()
const { open, recent } = storeToRefs(search)
const { language } = storeToRefs(usePreferencesStore())

const query = ref('')
const debounced = refDebounced(query, 250)
const term = computed(() => debounced.value.trim())

const { data, loading, error } = useTmdb(
  () => (term.value.length >= 2 ? 'search/multi' : null),
  () => ({ query: term.value, language: language.value, include_adult: false })
)

const results = computed(() => {
  if (term.value.length < 2) return { movies: [], people: [] }
  const items = (data.value?.results ?? []).filter((item) => item.media_type === 'movie' || item.media_type === 'person')
  return {
    movies: items.filter((item) => item.media_type === 'movie').slice(0, 6),
    people: items.filter((item) => item.media_type === 'person').slice(0, 4)
  }
})
const hasResults = computed(() => results.value.movies.length + results.value.people.length > 0)
const pending = computed(() => query.value.trim() !== term.value || loading.value)

function routeFor(item) {
  return item.media_type === 'person' ? `/people/${item.id}` : `/movies/title/${item.id}`
}

function onSelect(item) {
  if (!item) return
  if (item.media_type) search.remember(item)
  open.value = false
  router.push(routeFor(item))
}

function close() {
  open.value = false
}

watch(open, (value) => {
  if (!value) setTimeout(() => { query.value = '' }, 200)
})

// ⌘K / Ctrl+K toggles; "/" opens unless the visitor is typing somewhere
useEventListener(window, 'keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    open.value = !open.value
  }
  else if (event.key === '/' && !open.value) {
    const target = event.target
    const typing = target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
    if (!typing) {
      event.preventDefault()
      open.value = true
    }
  }
})
</script>

<template>
  <TransitionRoot :show="open" as="template" appear>
    <Dialog class="relative z-50" @close="close">
      <TransitionChild
        as="template"
        enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-150 ease-out" leave-from="opacity-100" leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60" aria-hidden="true"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto p-3 pt-[10svh] sm:p-6 sm:pt-[14svh]">
        <TransitionChild
          as="template"
          enter="duration-200 ease-out" enter-from="opacity-0 translate-y-2" enter-to="opacity-100 translate-y-0"
          leave="duration-150 ease-out" leave-from="opacity-100" leave-to="opacity-0"
        >
          <DialogPanel class="mx-auto max-w-2xl bg-paper">
            <DialogTitle class="sr-only">Search films and people</DialogTitle>
            <Combobox :model-value="null" @update:model-value="onSelect">
              <div class="relative bg-surface">
                <MagnifyingGlassIcon class="pointer-events-none absolute left-5 top-1/2 size-6 -translate-y-1/2 text-soft" aria-hidden="true" />
                <ComboboxInput
                  class="h-16 w-full border-0 bg-transparent pl-14 pr-5 text-lead text-ink placeholder:text-soft focus:outline-none"
                  placeholder="Search films and people"
                  autocomplete="off"
                  :display-value="() => query"
                  @change="query = $event.target.value"
                />
              </div>

              <ComboboxOptions static class="max-h-[60svh] overflow-y-auto overscroll-contain py-2">
                <!-- Recent picks when the field is empty -->
                <template v-if="!query.trim()">
                  <template v-if="recent.length">
                    <li class="flex items-center justify-between px-5 pt-3 pb-2" role="presentation">
                      <span class="text-small font-semibold text-soft">Recently opened</span>
                      <button type="button" class="text-small text-soft hover:text-accent" @click="search.clearRecent()">Clear</button>
                    </li>
                    <ComboboxOption v-for="item in recent" :key="`${item.media_type}-${item.id}`" v-slot="{ active }" :value="item" as="template">
                      <li class="flex cursor-pointer items-center gap-4 px-5 py-2" :class="active && 'bg-accent text-on-accent'">
                        <ClockIcon class="size-5 shrink-0 opacity-70" aria-hidden="true" />
                        <span class="truncate font-medium">{{ item.title }}</span>
                        <span v-if="item.year" class="ml-auto text-small opacity-80 tabular">{{ item.year }}</span>
                      </li>
                    </ComboboxOption>
                  </template>
                  <li v-else class="px-5 py-8 text-soft" role="presentation">
                    Type a title or a name. Try “Spirited Away” or “Greta Gerwig”.
                  </li>
                </template>

                <template v-else>
                  <template v-for="group in [{ key: 'movies', label: 'Films', icon: FilmIcon }, { key: 'people', label: 'People', icon: UserIcon }]" :key="group.key">
                    <template v-if="results[group.key].length">
                      <li class="px-5 pt-3 pb-2 text-small font-semibold text-soft" role="presentation">{{ group.label }}</li>
                      <ComboboxOption v-for="item in results[group.key]" :key="item.id" v-slot="{ active }" :value="item" as="template">
                        <li class="flex cursor-pointer items-center gap-4 px-5 py-2" :class="active && 'bg-accent text-on-accent'">
                          <div class="grid h-15 w-10 shrink-0 place-items-center overflow-hidden bg-surface">
                            <img
                              v-if="item.poster_path || item.profile_path"
                              :src="imageUrl(item.poster_path || item.profile_path, 'w92')"
                              alt=""
                              width="40"
                              height="60"
                              class="size-full object-cover"
                            />
                            <component :is="group.icon" v-else class="size-5 text-soft" aria-hidden="true" />
                          </div>
                          <div class="min-w-0">
                            <p class="truncate font-medium">{{ item.title || item.name }}</p>
                            <p class="truncate text-small opacity-80">
                              <template v-if="item.media_type === 'movie'">{{ (item.release_date || '').slice(0, 4) || 'Release date unknown' }}</template>
                              <template v-else>{{ item.known_for_department }}<template v-if="item.known_for?.length">, {{ item.known_for.map((k) => k.title || k.name).slice(0, 2).join(', ') }}</template></template>
                            </p>
                          </div>
                        </li>
                      </ComboboxOption>
                    </template>
                  </template>

                  <li v-if="error" class="px-5 py-8 text-soft" role="presentation">Search is unavailable right now. Try again in a moment.</li>
                  <li v-else-if="pending && !hasResults" class="px-5 py-8 text-soft" role="presentation" aria-live="polite">Searching…</li>
                  <li v-else-if="!hasResults && query.trim().length >= 2" class="px-5 py-8 text-soft" role="presentation" aria-live="polite">
                    Nothing on TMDb matches “{{ query.trim() }}”.
                  </li>
                </template>
              </ComboboxOptions>
            </Combobox>

            <p class="hidden items-center gap-5 bg-surface px-5 py-3 text-small text-soft sm:flex">
              <span><kbd class="font-sans font-semibold text-ink">↑ ↓</kbd> to move</span>
              <span><kbd class="font-sans font-semibold text-ink">Enter</kbd> to open</span>
              <span><kbd class="font-sans font-semibold text-ink">Esc</kbd> to close</span>
            </p>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
