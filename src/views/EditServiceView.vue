<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { serviceApi } from '@/services/api'
import BackButton from '@/components/BackButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const customerId = Number(route.params.customerId)
const serviceId = Number(route.params.serviceId)

const serviceForm = reactive({
  name: '',
  description: '',
  price: 0,
  status: 'pending',
  isPaid: false,
})

const loadService = async () => {
  try {
    loading.value = true
    error.value = null

    const service = await serviceApi.getService(serviceId)
    if (!service) {
      error.value = 'Service not found'
      return
    }

    // Populate form with service data
    serviceForm.name = service.name
    serviceForm.description = service.description
    serviceForm.price = service.price
    serviceForm.status = service.status as 'pending' | 'completed' | 'cancelled'
    serviceForm.isPaid = service.isPaid
  } catch (err) {
    error.value = 'Failed to load service data'
    console.error('Error loading service:', err)
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (!serviceForm.name.trim()) {
    error.value = 'Service name is required'
    return false
  }
  if (serviceForm.price <= 0) {
    error.value = 'Service price must be greater than 0'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    saving.value = true
    error.value = null

    await serviceApi.updateService(serviceId, {
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      price: serviceForm.price,
      status: serviceForm.status as 'pending' | 'completed' | 'cancelled',
      isPaid: serviceForm.isPaid,
    })

    // Navigate back to customer detail page
    router.push(`/customers/${customerId}`)
  } catch (err) {
    error.value = 'Failed to update service'
    console.error('Error updating service:', err)
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadService()
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <BackButton />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Edit Service</h1>
        <p class="text-gray-600">Update service information</p>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadService" class="mt-2 text-red-600 hover:text-red-800 underline">
        Try again
      </button>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Service Name *
            </label>
            <input
              id="name"
              v-model="serviceForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter service name"
            />
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              v-model="serviceForm.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500 resize-none"
              placeholder="Enter service description"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                id="price"
                v-model.number="serviceForm.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                v-model="serviceForm.status"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="isPaid"
              v-model="serviceForm.isPaid"
              type="checkbox"
              class="h-4 w-4 text-custom-red-600 focus:ring-custom-red-500 border-gray-300 rounded"
            />
            <label for="isPaid" class="ml-2 block text-sm text-gray-900"> Payment Received </label>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="goBack"
          class="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="saving"
          class="px-6 py-2 bg-custom-red-600 text-white rounded-md hover:bg-custom-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="saving">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </form>
  </div>
</template>
