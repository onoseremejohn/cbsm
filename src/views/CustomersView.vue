<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { customerApi } from '@/services/api'
import type { CustomerWithServices, CustomerStats } from '@/types/customer'
import UsersStatsIcon from '@/components/icons/UsersStatsIcon.vue'
import RevenueIcon from '@/components/icons/RevenueIcon.vue'
import GrowthIcon from '@/components/icons/GrowthIcon.vue'
import AnalyticsIcon from '@/components/icons/AnalyticsIcon.vue'
import StatsCard from '@/components/StatsCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
// import AutoResizingGrid from '@/components/AutoResizingGrid.vue'

const router = useRouter()
const customers = ref<CustomerWithServices[]>([])
const stats = ref<CustomerStats | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
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

const navigateToCustomer = (customerId: number) => {
  router.push(`/customers/${customerId}`)
}

onMounted(() => {
  loadData()
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
      <StatsCard
        title="Total Revenue"
        :value="formatCurrency(stats.totalRevenue)"
        :icon="RevenueIcon"
      />
      <StatsCard title="Pending Services" :value="stats.pendingServices" :icon="GrowthIcon" />
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
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">All Customers</h3>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Customer
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Services
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Value
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
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
              v-for="customer in customers"
              :key="customer.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="navigateToCustomer(customer.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ customer.name }}</div>
                  <div class="text-sm text-gray-500">{{ customer.address }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm text-gray-900">{{ customer.email }}</div>
                  <div class="text-sm text-gray-500">{{ customer.phone }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ customer.services.length }} services</div>
                <div class="text-sm text-gray-500">
                  {{ customer.services.filter((s) => s.status === 'completed').length }} completed
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ formatCurrency(customer.services.reduce((sum, s) => sum + s.price, 0)) }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ customer.services.filter((s) => s.isPaid).length }}/{{
                    customer.services.length
                  }}
                  paid
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col space-y-1">
                  <span
                    v-for="service in customer.services.slice(0, 2)"
                    :key="service.id"
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      getStatusColor(service.status),
                    ]"
                  >
                    {{ service.status }}
                  </span>
                  <span v-if="customer.services.length > 2" class="text-xs text-gray-500">
                    +{{ customer.services.length - 2 }} more
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-2">
                  <button
                    @click.stop="navigateToCustomer(customer.id)"
                    class="text-custom-red-600 hover:text-custom-red-900"
                  >
                    View
                  </button>
                  <button
                    @click.stop="router.push(`/customers/${customer.id}/edit`)"
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
</template>
