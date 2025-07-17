<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { customerApi } from '@/services/api'
import type { CustomerWithServices, CustomerStats } from '@/types/customer'
import UsersStatsIcon from '@/components/icons/UsersStatsIcon.vue'
import AnalyticsIcon from '@/components/icons/AnalyticsIcon.vue'
import StatsCard from '@/components/StatsCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
// import AutoResizingGrid from '@/components/AutoResizingGrid.vue'

const router = useRouter()
const customers = ref<CustomerWithServices[]>([])
const stats = ref<CustomerStats | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Pagination and search
const currentPage = ref(1)
const itemsPerPage = ref(10)
const searchQuery = ref('')

// Dropdown state management
const openDropdownId = ref<number | null>(null)

const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    const [customersData, statsData] = await Promise.all([
      customerApi.getCustomers(),
      customerApi.getCustomerStats(),
    ])

    customers.value = customersData
    stats.value = statsData
  } catch (err) {
    error.value = 'Failed to load customers data'
    console.error('Error loading customers:', err)
  } finally {
    loading.value = false
  }
}

// Computed properties for filtering and pagination
const filteredCustomers = computed(() => {
  if (!searchQuery.value.trim()) {
    return customers.value
  }

  const query = searchQuery.value.toLowerCase()
  return customers.value.filter(
    (customer) =>
      customer.businessName.toLowerCase().includes(query) ||
      customer.contactFirstName.toLowerCase().includes(query) ||
      customer.contactSurname.toLowerCase().includes(query) ||
      customer.emailAddresses.some((email) => email.toLowerCase().includes(query)) ||
      customer.phoneNumbers.some((phone) => phone.includes(query)) ||
      customer.addressCity.toLowerCase().includes(query) ||
      customer.addressState.toLowerCase().includes(query),
  )
})

const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredCustomers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredCustomers.value.length / itemsPerPage.value)
})

const pageNumbers = computed(() => {
  const pages = []
  const maxVisible = 5
  const start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Search methods
const handleSearch = () => {
  currentPage.value = 1 // Reset to first page when searching
}

const clearSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

const navigateToCustomer = (customerId: number) => {
  router.push(`/customers/${customerId}`)
}

// Dropdown methods
const toggleDropdown = (customerId: number, event: Event) => {
  event.stopPropagation()
  openDropdownId.value = openDropdownId.value === customerId ? null : customerId
}

const closeDropdown = () => {
  openDropdownId.value = null
}

const handleRowClick = (customerId: number) => {
  navigateToCustomer(customerId)
}

onMounted(() => {
  loadData()
  // Close dropdown when clicking outside
  document.addEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
        <p class="text-gray-600">Manage your customers and their services</p>
      </div>
      <RouterLink
        to="/customers/add"
        class="bg-custom-red-600 text-white px-4 py-2 rounded-lg hover:bg-custom-red-700 transition-colors inline-block"
      >
        Add Customer
      </RouterLink>
    </div>

    <!-- Stats Cards -->
    <!-- <AutoResizingGrid v-if="false" :min-width="280" :gap="24"> -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatsCard title="Total Customers" :value="stats.totalCustomers" :icon="UsersStatsIcon" />
      <StatsCard title="Total Services" :value="stats.totalServices" :icon="AnalyticsIcon" />
    </div>
    <!-- </AutoResizingGrid> -->

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadData" class="mt-2 text-red-600 hover:text-red-800 underline">
        Try again
      </button>
    </div>

    <!-- Customers Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <!-- Table Header with Search -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900">
            All Customers ({{ filteredCustomers.length }})
          </h3>
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                @input="handleSearch"
                type="text"
                placeholder="Search customers..."
                class="w-64 px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              />
              <svg
                class="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Business
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact Person
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact Info
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Services
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="customer in paginatedCustomers"
              :key="customer.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="handleRowClick(customer.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ customer.businessName }}</div>
                  <div class="text-sm text-gray-500">ID: {{ customer.id }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">
                    {{ customer.contactFirstName }} {{ customer.contactSurname }}
                  </div>
                  <div v-if="customer.contactMiddleName" class="text-sm text-gray-500">
                    {{ customer.contactMiddleName }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">{{ customer.emailAddresses[0] }}</div>
                  <div class="text-sm text-gray-500">{{ customer.phoneNumbers[0] }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">
                    {{ customer.addressCity }}, {{ customer.addressState }}
                  </div>
                  <div class="text-sm text-gray-500">{{ customer.addressLocalGovernment }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ customer.services.length }} services</div>
                <div class="text-sm text-gray-500">
                  {{ customer.services.filter((s) => s.status === 'active').length }} active
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="relative">
                  <button
                    @click="toggleDropdown(customer.id, $event)"
                    class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                  >
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                      />
                    </svg>
                  </button>
                  <!-- Dropdown Menu -->
                  <div
                    v-if="openDropdownId === customer.id"
                    class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                  >
                    <div class="py-1">
                      <button
                        @click="navigateToCustomer(customer.id)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        View Details
                      </button>
                      <button
                        @click="router.push(`/customers/${customer.id}/edit`)"
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Edit Customer
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredCustomers.length) }} of
            {{ filteredCustomers.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="goToPreviousPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div class="flex space-x-1">
              <button
                v-for="page in pageNumbers"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'px-3 py-1 text-sm border rounded-md',
                  page === currentPage
                    ? 'bg-custom-red-600 text-white border-custom-red-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="goToNextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
