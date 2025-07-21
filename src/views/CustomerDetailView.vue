<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customerApi } from '@/services/api'
import type { CustomerWithServices } from '@/types/customer'
import UsersStatsIcon from '@/components/icons/UsersStatsIcon.vue'
import BackButton from '@/components/BackButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import StatsCard from '@/components/StatsCard.vue'
import ActionsDropdown from '@/components/ActionsDropdown.vue'
import PaginationData from '@/components/PaginationData.vue'

const route = useRoute()
const router = useRouter()
const customer = ref<CustomerWithServices | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Pagination state for services
const currentPage = ref(1)
const perPage = ref(10)

const customerId = Number(route.params.id)

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

const navigateToEditCustomer = () => {
  router.push(`/customers/${customerId}/edit`)
}

const navigateToAddService = () => {
  router.push(`/customers/${customerId}/services/add`)
}

const navigateToEditService = (serviceId: number) => {
  router.push(`/customers/${customerId}/services/${serviceId}/edit`)
}

// Pagination methods for services
const handlePageChange = (page: number) => {
  currentPage.value = page
}

const handlePerPageChange = (newPerPage: number) => {
  perPage.value = newPerPage
  currentPage.value = 1
}

// Computed properties for services pagination
const totalServicesCount = computed(() => customer.value?.services.length || 0)
const totalServicesPages = computed(() => Math.ceil(totalServicesCount.value / perPage.value))
const paginatedServices = computed(() => {
  if (!customer.value) return []
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return customer.value.services.slice(start, end)
})

onMounted(() => {
  loadCustomer()
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Services"
          :value="customer.services.length"
          :icon="UsersStatsIcon"
        />
      </div>

      <!-- Customer Details -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Customer Information</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
              <p class="text-gray-900 font-medium">{{ customer.business_name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
              <p class="text-gray-900">
                {{ customer.contact_first_name }} {{ customer.contact_surname }}
                <span v-if="customer.contact_middle_name" class="text-gray-500">
                  ({{ customer.contact_middle_name }})
                </span>
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Numbers</label>
              <div class="space-y-1">
                <p v-for="phone in customer.phone_numbers" :key="phone" class="text-gray-900">
                  {{ phone }}
                </p>
                <p v-if="customer.phone_numbers.length === 0" class="text-gray-500">
                  No phone numbers
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Addresses</label>
              <div class="space-y-1">
                <p v-for="email in customer.email_addresses" :key="email" class="text-gray-900">
                  {{ email }}
                </p>
                <p v-if="customer.email_addresses.length === 0" class="text-gray-500">
                  No email addresses
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Physical Address</label>
              <p class="text-gray-900">{{ customer.physical_address }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <p class="text-gray-900">
                {{ customer.city }}, {{ customer.state }}
                <br />
                <span class="text-gray-500">{{ customer.local_government_area }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Services -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Services</h3>
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

        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead
                class="sticky top-0 font-semibold text-left text-gray-500 text-xs uppercase tracking-wider bg-gray-50"
              >
                <tr>
                  <th class="px-6 py-3">Service Code</th>
                  <th class="px-6 py-3">Description</th>
                  <th class="px-6 py-3">Bandwidth</th>
                  <th class="px-6 py-3">Service Type</th>
                  <th class="px-6 py-3">Service Platform</th>
                  <th class="px-6 py-3">Billing Cycle</th>
                  <th class="px-6 py-3">Billing Amount</th>
                  <th class="px-6 py-3">Status</th>
                  <th class="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="service in paginatedServices" :key="service.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ service.serviceCode }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ service.description || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ service.bandwidth || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ service.serviceType || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ service.servicePlatform || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ service.billingCycle || 'N/A' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{
                        service.billingCycleAmount
                          ? formatCurrency(service.billingCycleAmount)
                          : 'N/A'
                      }}
                    </div>
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionsDropdown
                      :actions="[
                        { label: 'Edit', action: () => navigateToEditService(service.id) },
                      ]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Services Pagination -->
          <div class="px-6 py-4 border-t border-gray-200">
            <PaginationData
              :total-count="totalServicesCount"
              :current-page="currentPage"
              :total-pages="totalServicesPages"
              :per-page="perPage"
              @page-change="handlePageChange"
              @per-page-change="handlePerPageChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
