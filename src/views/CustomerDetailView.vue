<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customerApi, serviceApi } from '@/services/api'
import type { CustomerWithServices } from '@/types/customer'
import UsersStatsIcon from '@/components/icons/UsersStatsIcon.vue'
import RevenueIcon from '@/components/icons/RevenueIcon.vue'
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getPaymentStatusColor = (isPaid: boolean) => {
  return isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

const markServiceAsPaid = async (serviceId: number) => {
  try {
    await serviceApi.markServiceAsPaid(serviceId)
    await loadCustomer() // Reload to get updated data
  } catch (err) {
    console.error('Error marking service as paid:', err)
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
        <StatsCard
          title="Total Value"
          :value="formatCurrency(customer.services.reduce((sum, s) => sum + s.price, 0))"
          :icon="RevenueIcon"
        />
        <StatsCard
          title="Paid Services"
          :value="customer.services.filter((s) => s.isPaid).length"
          :icon="GrowthIcon"
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
              <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <p class="text-gray-900">{{ customer.name }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p class="text-gray-900">{{ customer.email }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <p class="text-gray-900">{{ customer.phone }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <p class="text-gray-900">{{ customer.address }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Created</label>
              <p class="text-gray-900">{{ formatDate(customer.createdAt) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Last Updated</label>
              <p class="text-gray-900">{{ formatDate(customer.updatedAt) }}</p>
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

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Service
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="service in customer.services" :key="service.id">
                <td class="px-6 py-4">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ service.name }}</div>
                    <div class="text-sm text-gray-500">{{ service.description }}</div>
                    <div class="text-xs text-gray-400">
                      Created: {{ formatDate(service.createdAt) }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ formatCurrency(service.price) }}
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
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      getPaymentStatusColor(service.isPaid),
                    ]"
                  >
                    {{ service.isPaid ? 'Paid' : 'Unpaid' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      v-if="!service.isPaid"
                      @click="markServiceAsPaid(service.id)"
                      class="text-green-600 hover:text-green-900"
                    >
                      Mark Paid
                    </button>
                    <button
                      @click="navigateToEditService(service.id)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
