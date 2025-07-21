<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import DashboardIcon from './icons/DashboardIcon.vue'
import UsersIcon from './icons/UsersIcon.vue'
import AnalyticsIcon from './icons/AnalyticsIcon.vue'
import SettingsIcon from './icons/SettingsIcon.vue'
import CloseIcon from './icons/CloseIcon.vue'
import logo from '../assets/ipNX_Logo.png'

interface Props {
  isOpen?: boolean
}

interface Emits {
  (e: 'close'): void
}

interface NavLink {
  path: string
  name: string
  icon: typeof DashboardIcon
  activePatterns?: string[]
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
})

const emit = defineEmits<Emits>()
const route = useRoute()

const isLargeScreen = ref(false)

const navLinks: NavLink[] = [
  {
    path: '/',
    name: 'Dashboard',
    icon: DashboardIcon,
  },
  {
    path: '/customers',
    name: 'Customers',
    icon: UsersIcon,
    activePatterns: ['/customers'],
  },
  {
    path: '/user-roles',
    name: 'User Roles',
    icon: UsersIcon,
  },
  {
    path: '/analytics',
    name: 'Analytics',
    icon: AnalyticsIcon,
  },
  {
    path: '/settings',
    name: 'Settings',
    icon: SettingsIcon,
  },
]

const isLinkActive = (link: NavLink) => {
  if (link.activePatterns) {
    return link.activePatterns.some((pattern) => route.path.startsWith(pattern))
  }
  return route.path === link.path
}

const checkScreenSize = () => {
  isLargeScreen.value = window.innerWidth >= 1024 // lg breakpoint
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && !isLargeScreen.value) {
    emit('close')
  }
}

const handleLinkClick = () => {
  if (!isLargeScreen.value) {
    emit('close')
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <!-- Mobile/Tablet Overlay -->
  <div
    v-if="!isLargeScreen && isOpen"
    class="fixed inset-0 bg-black/20 z-50 lg:hidden"
    @click="emit('close')"
  ></div>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-screen w-sidebar bg-custom-red-600 text-white z-51 transition-transform duration-300 ease-in-out',
      'lg:translate-x-0 lg:relative',
      isLargeScreen ? 'translate-x-0' : isOpen ? 'translate-x-0' : '-translate-x-full',
    ]"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between p-6 border-b border-white bg-gray-800">
      <img :src="logo" alt="ipNX Logo" />
      <button
        v-if="!isLargeScreen"
        @click="emit('close')"
        type="button"
        class="lg:hidden p-2 hover:bg-custom-red-500 rounded-md transition-colors"
      >
        <CloseIcon />
      </button>
    </div>

    <!-- Sidebar Navigation -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li v-for="link in navLinks" :key="link.path">
          <RouterLink
            :to="link.path"
            @click="handleLinkClick"
            :class="[
              'w-full flex items-center px-4 py-3 rounded-lg text-white transition-colors',
              isLinkActive(link) ? 'bg-custom-red-500' : 'hover:bg-custom-red-500',
            ]"
          >
            <component :is="link.icon" class="mr-3" />
            {{ link.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-custom-red-500">
      <div class="flex items-center px-4 py-3">
        <div class="w-8 h-8 bg-custom-red-400 rounded-full flex items-center justify-center">
          <span class="text-sm font-semibold text-white">U</span>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-white">User Name</p>
          <p class="text-xs text-custom-red-200">user@example.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>
