<script setup lang="ts">
import { useRouter } from 'vue-router'
import UsersStatsIcon from '@/components/icons/UsersStatsIcon.vue'
import RevenueIcon from '@/components/icons/RevenueIcon.vue'
import GrowthIcon from '@/components/icons/GrowthIcon.vue'
import AnalyticsIcon from '@/components/icons/AnalyticsIcon.vue'
import StatsCard from '@/components/StatsCard.vue'
import AutoResizingGrid from '@/components/AutoResizingGrid.vue'

const router = useRouter()

const navigateToCustomers = () => {
  router.push('/customers')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">Welcome to Your Dashboard</h1>
      <p class="text-gray-600">Manage your customers and services efficiently</p>
    </div>

    <!-- Quick Actions -->
    <AutoResizingGrid :min-width="280" :gap="24">
      <div
        class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateToCustomers"
      >
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-custom-red-100">
            <UsersStatsIcon class="text-custom-red-600" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Manage Customers</p>
            <p class="text-lg font-semibold text-gray-900">View All</p>
          </div>
        </div>
      </div>

      <StatsCard title="Total Revenue" value="$9,500" :icon="RevenueIcon" />

      <StatsCard title="Active Services" value="12" :icon="AnalyticsIcon" />

      <StatsCard title="Growth" value="+15%" :icon="GrowthIcon" />
    </AutoResizingGrid>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Quick Actions</h3>
      </div>
      <div class="p-6">
        <AutoResizingGrid :min-width="300" :gap="16">
          <button
            @click="navigateToCustomers"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UsersStatsIcon class="w-6 h-6 text-custom-red-600 mr-3" />
            <div class="text-left">
              <p class="font-medium text-gray-900">View Customers</p>
              <p class="text-sm text-gray-600">Manage all your customers and their services</p>
            </div>
          </button>

          <button
            @click="router.push('/customers/add')"
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RevenueIcon class="w-6 h-6 text-custom-red-600 mr-3" />
            <div class="text-left">
              <p class="font-medium text-gray-900">Add Customer</p>
              <p class="text-sm text-gray-600">Create a new customer with services</p>
            </div>
          </button>
        </AutoResizingGrid>
      </div>
    </div>
  </div>
</template>
