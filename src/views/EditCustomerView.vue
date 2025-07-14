<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { customerApi } from '@/services/api'
import BackButton from '@/components/BackButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)

const customerId = Number(route.params.id)

const customerForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
})

const loadCustomer = async () => {
  try {
    loading.value = true
    error.value = null

    const customer = await customerApi.getCustomer(customerId)
    if (!customer) {
      error.value = 'Customer not found'
      return
    }

    // Populate form with customer data
    customerForm.name = customer.name
    customerForm.email = customer.email
    customerForm.phone = customer.phone
    customerForm.address = customer.address
  } catch (err) {
    error.value = 'Failed to load customer data'
    console.error('Error loading customer:', err)
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (!customerForm.name.trim()) {
    error.value = 'Customer name is required'
    return false
  }
  if (!customerForm.email.trim()) {
    error.value = 'Customer email is required'
    return false
  }
  if (!customerForm.phone.trim()) {
    error.value = 'Customer phone is required'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    saving.value = true
    error.value = null

    await customerApi.updateCustomer(customerId, {
      name: customerForm.name.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phone.trim(),
      address: customerForm.address.trim(),
    })

    // Navigate back to customer detail page
    router.push(`/customers/${customerId}`)
  } catch (err) {
    error.value = 'Failed to update customer'
    console.error('Error updating customer:', err)
  } finally {
    saving.value = false
  }
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
        <h1 class="text-2xl font-bold text-gray-900">Edit Customer</h1>
        <p class="text-gray-600">Update customer information</p>
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

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              id="name"
              v-model="customerForm.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter customer name"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              id="email"
              v-model="customerForm.email"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              id="phone"
              v-model="customerForm.phone"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              id="address"
              v-model="customerForm.address"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter address"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="router.back()"
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
