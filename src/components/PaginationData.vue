<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  totalCount: number
  currentPage: number
  totalPages: number
  perPage: number
}

const props = defineProps<Props>()

defineEmits<{
  'page-change': [page: number]
  'per-page-change': [perPage: number]
}>()

const startItem = computed(() => (props.currentPage - 1) * props.perPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.perPage, props.totalCount))

// Generate visible page numbers with ellipsis
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5

  if (props.totalPages <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show pages around current page
    const start = Math.max(1, props.currentPage - 2)
    const end = Math.min(props.totalPages, props.currentPage + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})
</script>

<template>
  <div class="flex items-center justify-between text-sm">
    <!-- Total items display -->
    <p class="text-gray-600 font-normal">{{ startItem }}-{{ endItem }} of {{ totalCount }} items</p>

    <!-- Page navigation -->
    <div class="flex gap-1 md:gap-4 lg:gap-6 items-center">
      <button
        :disabled="currentPage === 1"
        type="button"
        aria-label="Previous Page"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:text-gray-700 rounded-md"
        @click="$emit('page-change', currentPage - 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <div class="flex gap-1 md:gap-2 items-center">
        <button
          v-for="page in visiblePages"
          :key="page"
          type="button"
          :class="[
            'px-3 py-1 text-sm font-medium rounded-md transition-colors',
            page === currentPage
              ? 'bg-custom-red-600 text-white'
              : 'text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
          ]"
          @click="page !== currentPage && $emit('page-change', page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        :disabled="currentPage === totalPages"
        type="button"
        aria-label="Next Page"
        class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:text-gray-700 rounded-md"
        @click="$emit('page-change', currentPage + 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Items per page selector -->
    <div class="text-gray-600 font-normal text-right">
      Show
      <select
        class="font-medium focus-visible ml-1 border-none bg-transparent focus:outline-none cursor-pointer"
        :value="perPage"
        @change="
          $emit('per-page-change', Number(($event.target as HTMLSelectElement)?.value || perPage))
        "
      >
        <option value="10">10 items</option>
        <option v-if="totalCount > 10" value="25">25 items</option>
        <option v-if="totalCount > 25" value="50">50 items</option>
        <option v-if="totalCount > 50" value="100">100 items</option>
      </select>
    </div>
  </div>
</template>
