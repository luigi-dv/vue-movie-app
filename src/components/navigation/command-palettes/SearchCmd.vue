<template>
    <Dialog :open="open" as="div" class="fixed inset-0 z-50 overflow-y-auto p-4 m-[32vh]" @close="open = false">
      <DialogOverlay class="fixed inset-0 bg-gray-500/75 bg-opacity-25 transition-opacity" />
        <Combobox as="div" class="mx-auto bg-white max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
                  @update:modelValue="onSelect">
          <div class="relative">
            <SearchIcon class="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" aria-hidden="true" />
            <ComboboxInput class="h-12 w-full border-0 bg-transparent rounded-md pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0" placeholder="Search..." @change="query = $event.target.value" />
          </div>
          <ComboboxOptions v-if="filteredPeople.length > 0" static class="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800">
            <ComboboxOption v-for="person in filteredPeople" :key="person.id" :value="person" as="template" v-slot="{ active }">
              <li :class="['cursor-default select-none px-4 py-2', active && 'bg-indigo-600 text-white']">
                {{ person.name }}
              </li>
            </ComboboxOption>
          </ComboboxOptions>
          <p v-if="query !== '' && filteredPeople.length === 0" class="p-4 text-sm text-gray-500">No people found.</p>
        </Combobox>
    </Dialog>
</template>

<script>
import { computed, ref } from 'vue'
import { SearchIcon } from '@heroicons/vue/solid'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Dialog,
  DialogOverlay,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'

const people = [
  { id: 1, name: 'Leslie Alexander', url: '#' },
  // More people...
]

export default {
  components: {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    Dialog,
    DialogOverlay,
    SearchIcon,
    TransitionChild,
    TransitionRoot,
  },
  mounted() {
    let keysPressed = {};
    window.addEventListener('keydown', (e) => {
      keysPressed[e.key] = true;
      if (keysPressed['Meta'] && e.key === 'k' ) {
        this.open = !this.open
      }
    });
    document.addEventListener('keyup', (e) => {
      delete keysPressed[e.key];
    });
  },
  setup() {
    const open = ref(false)
    const query = ref('')
    const filteredPeople = computed(() =>
        query.value === ''
            ? []
            : people.filter((person) => {
              return person.name.toLowerCase().includes(query.value.toLowerCase())
            })
    )

    return {
      open,
      query,
      filteredPeople,
      onSelect(person) {
        window.location = person.url
      },
    }
  },
}
</script>