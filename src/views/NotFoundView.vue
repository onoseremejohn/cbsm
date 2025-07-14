<script setup lang="ts">
import { useRouter } from 'vue-router'
import ChevronLeftIcon from '@/components/icons/ChevronLeftIcon.vue'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full text-center">
      <!-- 404 Icon -->
      <div class="mb-8">
        <div
          class="mx-auto w-24 h-24 bg-custom-red-100 rounded-full flex items-center justify-center"
        >
          <span class="text-4xl font-bold text-custom-red-600">404</span>
        </div>
      </div>

      <!-- Error Message -->
      <h1 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
      <p class="text-gray-600 mb-8">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          @click="goBack"
          class="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ChevronLeftIcon class="w-5 h-5" />
          Go Back
        </button>
        <RouterLink
          to="/"
          class="px-6 py-3 bg-custom-red-600 text-white rounded-lg hover:bg-custom-red-700 transition-colors inline-block"
        >
          Go Home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
