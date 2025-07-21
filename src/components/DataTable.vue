<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import SearchBar from '@/components/SearchBar.vue'
import PaginationData from '@/components/PaginationData.vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
}

interface EmptyStateAction {
  label: string
  action: () => void
}

interface Props {
  title: string
  columns: Column[]
  data: Record<string, unknown>[]
  searchPlaceholder?: string
  emptyStateMessage?: string
  emptyStateAction?: EmptyStateAction
  perPage?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search...',
  emptyStateMessage: 'No data found.',
  perPage: 10,
})

// Search state
const searchQuery = ref('')

// Pagination state
const currentPage = ref(1)
const perPage = ref(props.perPage)

// Filtered and paginated data
const filteredData = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.data
  }

  const query = searchQuery.value.toLowerCase()
  return props.data.filter((item) => {
    return Object.values(item).some((value) => {
      if (value === null || value === undefined) return false
      return String(value).toLowerCase().includes(query)
    })
  })
})

const totalCount = computed(() => filteredData.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / perPage.value))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredData.value.slice(start, end)
})

// Reset to first page when search changes
watch(searchQuery, () => {
  currentPage.value = 1
})

// Reset to first page when data changes
watch(
  () => props.data,
  () => {
    currentPage.value = 1
  },
)

// Pagination handlers
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handlePerPageChange = (newPerPage: number) => {
  perPage.value = newPerPage
  currentPage.value = 1
}

const handleSearch = (query: string) => {
  searchQuery.value = query
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Header with title and search -->
    <div class="px-6 py-4 border-b border-gray-200">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
        <div class="w-64">
          <SearchBar
            v-model="searchQuery"
            :placeholder="searchPlaceholder"
            @search="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredData.length === 0" class="p-6 text-center text-gray-500">
      <p>{{ emptyStateMessage }}</p>
      <button
        v-if="emptyStateAction"
        @click="emptyStateAction.action"
        class="mt-2 text-custom-red-600 hover:text-custom-red-800 underline"
      >
        {{ emptyStateAction.label }}
      </button>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead
          class="sticky top-0 font-semibold text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-50"
        >
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="['px-6 py-3', column.width ? column.width : '']"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(item, index) in paginatedData" :key="index" class="hover:bg-gray-50">
            <td
              v-for="column in columns"
              :key="column.key"
              :class="['px-6 py-4', column.width ? column.width : '']"
            >
              <slot :name="column.key" :item="item" :value="item[column.key]">
                <div class="text-sm text-gray-900">
                  {{ item[column.key] || 'N/A' }}
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalCount > perPage" class="px-6 py-4 border-t border-gray-200">
      <PaginationData
        :total-count="totalCount"
        :current-page="currentPage"
        :total-pages="totalPages"
        :per-page="perPage"
        @page-change="handlePageChange"
        @per-page-change="handlePerPageChange"
      />
    </div>
  </div>
</template>
