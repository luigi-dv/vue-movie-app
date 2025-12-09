<script setup>
import { computed } from 'vue'
import { BookmarkIcon } from '@heroicons/vue/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/vue/24/solid'
import { useWatchlistStore } from '@/stores/watchlist'

const props = defineProps({
  movie: { type: Object, required: true },
  /** "icon" sits on a poster; "full" is a labelled button */
  variant: { type: String, default: 'icon' }
})

const watchlist = useWatchlistStore()
const saved = computed(() => watchlist.has(props.movie.id))
const label = computed(() => `${saved.value ? 'Remove' : 'Add'} ${props.movie.title} ${saved.value ? 'from' : 'to'} your watchlist`)
</script>

<template>
  <button
    v-if="variant === 'icon'"
    type="button"
    :aria-pressed="saved"
    :aria-label="label"
    :title="label"
    class="grid size-11 place-items-center bg-ground/90 text-ink transition-[background-color,transform] duration-150 hover:bg-ground active:scale-90"
    :class="saved && 'bg-accent! text-on-accent'"
    @click.prevent="watchlist.toggle(movie)"
  >
    <component :is="saved ? BookmarkSolidIcon : BookmarkIcon" class="size-5" aria-hidden="true" />
  </button>
  <button
    v-else
    type="button"
    :aria-pressed="saved"
    class="btn"
    :class="saved ? 'btn-primary' : 'btn-quiet'"
    @click="watchlist.toggle(movie)"
  >
    <component :is="saved ? BookmarkSolidIcon : BookmarkIcon" class="size-5" aria-hidden="true" />
    {{ saved ? 'On your watchlist' : 'Add to watchlist' }}
  </button>
</template>
