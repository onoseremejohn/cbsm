<script setup lang="ts">
import { ref } from 'vue'
import SidebarComponent from './SidebarComponent.vue'
import HeaderComponent from './HeaderComponent.vue'

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
      <main class="flex-1 max-w-screen lg:max-w-[calc(100vw-260px)] overflow-auto p-4 lg:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
