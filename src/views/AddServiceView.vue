<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customerApi, serviceApi } from '@/services/api'
import type { CustomerWithServices } from '@/types/customer'
import BackButton from '@/components/BackButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const customer = ref<CustomerWithServices | null>(null)

const customerId = Number(route.params.customerId)

const serviceForm = reactive({
  name: '',
  description: '',
  price: 0,
  status: 'pending' as const,
  isPaid: false,
})

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

    await serviceApi.createService({
      customerId,
      name: serviceForm.name.trim(),
      description: serviceForm.description.trim(),
      price: serviceForm.price,
      status: serviceForm.status,
      isPaid: serviceForm.isPaid,
    })

    // Navigate back to customer detail page
    router.push(`/customers/${customerId}`)
  } catch (err) {
    error.value = 'Failed to create service'
    console.error('Error creating service:', err)
  } finally {
    saving.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadCustomer()
})
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <BackButton />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add New Service</h1>
        <p class="text-gray-600">Add a new service for this customer</p>
      </div>
    </div>
    <p v-if="customer" class="font-bold text-lg text-black mt-1">
      Customer: {{ customer.name }}
    </p>
    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadCustomer" class="mt-2 text-red-600 hover:text-red-800 underline">
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
          <span v-if="saving">Creating...</span>
          <span v-else>Create Service</span>
        </button>
      </div>
    </form>
  </div>
</template>
