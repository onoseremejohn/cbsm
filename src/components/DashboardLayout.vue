<script setup lang="ts">
import { ref } from 'vue'
import HeaderComponent from './HeaderComponent.vue'
import UsersStatsIcon from './icons/UsersStatsIcon.vue'
import RevenueIcon from './icons/RevenueIcon.vue'
import GrowthIcon from './icons/GrowthIcon.vue'
import SidebarComponent from './SidebarComponent.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <SidebarComponent :is-open="isSidebarOpen" @close="closeSidebar" />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <!-- Header (mobile only) -->
      <HeaderComponent :on-toggle-sidebar="toggleSidebar" />

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto p-4 lg:p-6">
        <div class="max-w-7xl mx-auto">
          <!-- Dashboard Content -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <!-- Stats Cards -->
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-custom-red-100">
                  <UsersStatsIcon class="text-custom-red-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Total Users</p>
                  <p class="text-2xl font-semibold text-gray-900">1,234</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-custom-red-100">
                  <RevenueIcon class="text-custom-red-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Revenue</p>
                  <p class="text-2xl font-semibold text-gray-900">$45,678</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-custom-red-100">
                  <GrowthIcon class="text-custom-red-600" />
                </div>
                <div class="ml-4">
                  <p class="text-sm font-medium text-gray-600">Growth</p>
                  <p class="text-2xl font-semibold text-gray-900">+12.5%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-custom-red-500 rounded-full"></div>
                  <p class="text-sm text-gray-600">New user registration</p>
                  <span class="text-xs text-gray-400">2 minutes ago</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-custom-red-500 rounded-full"></div>
                  <p class="text-sm text-gray-600">Payment received</p>
                  <span class="text-xs text-gray-400">5 minutes ago</span>
                </div>
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-custom-red-500 rounded-full"></div>
                  <p class="text-sm text-gray-600">System update completed</p>
                  <span class="text-xs text-gray-400">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
