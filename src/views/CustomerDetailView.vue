<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customerApi } from '@/services/api'
import type { CustomerWithServices } from '@/types/customer'
import UsersStatsIcon from '@/components/icons/UsersStatsIcon.vue'
import GrowthIcon from '@/components/icons/GrowthIcon.vue'
import BackButton from '@/components/BackButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import StatsCard from '@/components/StatsCard.vue'

const route = useRoute()
const router = useRouter()
const customer = ref<CustomerWithServices | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const customerId = Number(route.params.id)

// Pagination and search for services
const currentPage = ref(1)
const itemsPerPage = ref(5)
const searchQuery = ref('')

// Dropdown state management
const openDropdownId = ref<number | null>(null)

const loadCustomer = async () => {
  try {
    loading.value = true
    error.value = null

    const customerData = await customerApi.getCustomer(customerId)
    if (!customerData) {
      error.value = 'Customer not found'
      return
    }

    customer.value = customerData
  } catch (err) {
    error.value = 'Failed to load customer data'
    console.error('Error loading customer:', err)
  } finally {
    loading.value = false
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    case 'terminated':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Computed properties for filtering and pagination
const filteredServices = computed(() => {
  if (!customer.value) return []
  if (!searchQuery.value.trim()) {
    return customer.value.services
  }

  const query = searchQuery.value.toLowerCase()
  return customer.value.services.filter(
    (service) =>
      service.serviceCode.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query) ||
      service.status.toLowerCase().includes(query) ||
      service.bandwidth.toLowerCase().includes(query) ||
      service.serviceType.toLowerCase().includes(query) ||
      service.servicePlatform.toLowerCase().includes(query) ||
      service.billingCycle.toLowerCase().includes(query) ||
      service.billingMode.toLowerCase().includes(query),
  )
})

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredServices.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredServices.value.length / itemsPerPage.value)
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

const navigateToEditCustomer = () => {
  router.push(`/customers/${customerId}/edit`)
}

const navigateToAddService = () => {
  router.push(`/customers/${customerId}/services/add`)
}

const navigateToEditService = (serviceId: number) => {
  router.push(`/customers/${customerId}/services/${serviceId}/edit`)
}

// Dropdown methods
const toggleDropdown = (serviceId: number, event: Event) => {
  event.stopPropagation()
  openDropdownId.value = openDropdownId.value === serviceId ? null : serviceId
}

const closeDropdown = () => {
  openDropdownId.value = null
}

onMounted(() => {
  loadCustomer()
  // Close dropdown when clicking outside
  document.addEventListener('click', closeDropdown)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <BackButton />
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Customer Details</h1>
          <p class="text-gray-600">View and manage customer information</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button
          @click="navigateToAddService"
          class="bg-custom-red-600 text-white px-4 py-2 rounded-lg hover:bg-custom-red-700 transition-colors"
        >
          Add Service
        </button>
        <button
          @click="navigateToEditCustomer"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Edit Customer
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadCustomer" class="mt-2 text-red-600 hover:text-red-800 underline">
        Try again
      </button>
    </div>

    <!-- Customer Information -->
    <div v-else-if="customer" class="space-y-6">
      <!-- Customer Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Total Services"
          :value="customer.services.length"
          :icon="UsersStatsIcon"
        />
        <StatsCard
          title="Active Services"
          :value="customer.services.filter((s) => s.status === 'active').length"
          :icon="GrowthIcon"
        />
      </div>

      <!-- Customer Details -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Customer Information</h3>
        </div>
        <div class="p-6">
          <!-- Business Name prominently displayed -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
            <p class="text-2xl font-bold text-gray-900">{{ customer.businessName }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
              <p class="text-gray-900">
                {{ customer.contactFirstName }} {{ customer.contactMiddleName || '' }}
                {{ customer.contactSurname }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
              <p class="text-gray-900">{{ customer.id }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
              <div class="space-y-1">
                <p v-for="email in customer.emailAddresses" :key="email" class="text-gray-900">
                  {{ email }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
              <div class="space-y-1">
                <p v-for="phone in customer.phoneNumbers" :key="phone" class="text-gray-900">
                  {{ phone }}
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
              <p class="text-gray-900">{{ customer.physicalAddress }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <p class="text-gray-900">{{ customer.addressCity }}, {{ customer.addressState }}</p>
              <p class="text-gray-500">{{ customer.addressLocalGovernment }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">
              Services ({{ filteredServices.length }})
            </h3>
            <div class="flex items-center space-x-2">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  @input="handleSearch"
                  type="text"
                  placeholder="Search services..."
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

        <div v-if="customer.services.length === 0" class="p-6 text-center text-gray-500">
          <p>No services found for this customer.</p>
          <button
            @click="navigateToAddService"
            class="mt-2 text-custom-red-600 hover:text-custom-red-800 underline"
          >
            Add first service
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service Code
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Bandwidth
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service Type
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service Platform
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Billing Cycle
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Billing Cycle Amount
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cycle Start Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cycle End Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Billing Mode
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="service in paginatedServices" :key="service.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ service.serviceCode }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ service.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      getStatusColor(service.status),
                    ]"
                  >
                    {{ service.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.bandwidth }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.serviceType }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.servicePlatform }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.billingCycle }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(service.billingCycleAmount) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.cycleStartDate }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.cycleEndDate }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ service.billingMode }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="relative">
                    <button
                      @click="toggleDropdown(service.id, $event)"
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
                      v-if="openDropdownId === service.id"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                    >
                      <div class="py-1">
                        <button
                          @click="navigateToEditService(service.id)"
                          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit Service
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
              {{ Math.min(currentPage * itemsPerPage, filteredServices.length) }} of
              {{ filteredServices.length }} results
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
  </div>
</template>
