<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Action {
  label: string
  action: () => void
}

defineProps<{
  actions: Action[]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

const toggleDropdown = (event: Event) => {
  event.stopPropagation() // Prevent event from bubbling up to document listener
  isOpen.value = !isOpen.value
}

const handleAction = (action: Action) => {
  action.action()
  isOpen.value = false
}

const closeDropdown = (event: Event) => {
  const target = event.target as Element

  // Check if the click is outside the dropdown container
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-fit mx-auto">
    <button
      @click="toggleDropdown"
      class="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
      aria-label="Actions"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
    >
      <div class="py-1">
        <button
          v-for="action in actions"
          :key="action.label"
          @click="handleAction(action)"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/10 z-9 cursor-default"
      @click.stop="isOpen = false"
    ></div>
  </div>
</template>
