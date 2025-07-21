<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { customerApi } from '@/services/api'
import type { CustomerWithServices, CustomerStats } from '@/types/customer'
import UsersStatsIcon from '@/components/icons/UsersStatsIcon.vue'
import AnalyticsIcon from '@/components/icons/AnalyticsIcon.vue'
import StatsCard from '@/components/StatsCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ActionsDropdown from '@/components/ActionsDropdown.vue'
import PaginationData from '@/components/PaginationData.vue'
import AddCustomerModal from '@/components/AddCustomerModal.vue'

const router = useRouter()
const customers = ref<CustomerWithServices[]>([])
const stats = ref<CustomerStats | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Modal state
const showAddCustomerModal = ref(false)

// Pagination state
const currentPage = ref(1)
const perPage = ref(10)

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

const navigateToCustomer = (customerId: number) => {
  router.push(`/customers/${customerId}`)
}

const editCustomer = (customerId: number) => {
  router.push(`/customers/${customerId}/edit`)
}

// Modal handlers
const openAddCustomerModal = () => {
  showAddCustomerModal.value = true
}

const closeAddCustomerModal = () => {
  showAddCustomerModal.value = false
}

const handleCustomerCreated = () => {
  // Reload data to include the new customer
  loadData()
}

// Pagination methods
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handlePerPageChange = (newPerPage: number) => {
  perPage.value = newPerPage
  currentPage.value = 1
}

// Computed properties for pagination
const totalCount = computed(() => customers.value.length)
const totalPages = computed(() => Math.ceil(totalCount.value / perPage.value))
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return customers.value.slice(start, end)
})

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
        <p class="text-gray-600">Manage your customers and their services</p>
      </div>
      <button
        @click="openAddCustomerModal"
        class="bg-custom-red-600 text-white px-4 py-2 rounded-lg hover:bg-custom-red-700 transition-colors inline-block"
      >
        Add Customer
      </button>
    </div>

    <!-- Stats Cards -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <StatsCard title="Total Customers" :value="stats.totalCustomers" :icon="UsersStatsIcon" />
      <StatsCard title="Total Services" :value="stats.totalServices" :icon="AnalyticsIcon" />
    </div>

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
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">All Customers</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead
            class="sticky top-0 font-semibold text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-50"
          >
            <tr>
              <th class="px-6 py-3">Business Name</th>
              <th class="px-6 py-3">Contact Name</th>
              <th class="px-6 py-3">Contact Info</th>
              <th class="px-6 py-3">Location</th>
              <th class="px-6 py-3">Services</th>
              <th class="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="customer in paginatedCustomers"
              :key="customer.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="navigateToCustomer(customer.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ customer.business_name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">
                    {{ customer.contact_first_name }} {{ customer.contact_surname }}
                  </div>
                </div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">
                    {{ customer.email_addresses[0] || 'N/A' }}
                  </div>
                  <div class="text-sm text-gray-500">{{ customer.phone_numbers[0] || 'N/A' }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">{{ customer.city }}, {{ customer.state }}</div>
                  <div class="text-sm text-gray-500">{{ customer.local_government_area }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ customer.services.length }} service{{
                    customer.services.length > 1 ? 's' : ''
                  }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <ActionsDropdown
                  :actions="[
                    { label: 'View', action: () => navigateToCustomer(customer.id) },
                    { label: 'Edit', action: () => editCustomer(customer.id) },
                  ]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <PaginationData
      v-if="!loading && !error"
      :total-count="totalCount"
      :current-page="currentPage"
      :total-pages="totalPages"
      :per-page="perPage"
      @page-change="handlePageChange"
      @per-page-change="handlePerPageChange"
    />

    <!-- Add Customer Modal -->
    <AddCustomerModal
      :is-open="showAddCustomerModal"
      @close="closeAddCustomerModal"
      @customer-created="handleCustomerCreated"
    />
  </div>
</template>
