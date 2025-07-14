<script setup lang="ts">
import MenuIcon from './icons/MenuIcon.vue'
import BellIcon from './icons/BellIcon.vue'
import QuestionIcon from './icons/QuestionIcon.vue'

interface Props {
  onToggleSidebar: () => void
}

defineProps<Props>()
</script>

<template>
  <header class="bg-white shadow-sm border-b border-gray-200 lg:hidden">
    <div class="flex items-center justify-between px-4 py-3">
      <button
        @click="onToggleSidebar"
        class="p-2 text-gray-600 hover:text-custom-red-600 hover:bg-gray-100 rounded-md transition-colors"
        aria-label="Toggle sidebar"
      >
        <MenuIcon />
      </button>

      <div class="flex items-center space-x-4">
        <h1 class="text-lg font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div class="flex items-center space-x-3">
        <button
          class="p-2 text-gray-600 hover:text-custom-red-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <BellIcon />
        </button>

        <button
          class="p-2 text-gray-600 hover:text-custom-red-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <QuestionIcon />
        </button>
      </div>
    </div>
  </header>
</template>
