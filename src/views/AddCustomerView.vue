<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { customerApi, serviceApi } from '@/services/api'
import type { Service } from '@/types/customer'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const loading = ref(false)
const error = ref<string | null>(null)

const customerForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
})

const services = ref<Partial<Service>[]>([
  {
    name: '',
    description: '',
    price: 0,
    status: 'pending' as const,
    isPaid: false,
  },
])

const addService = () => {
  services.value.push({
    name: '',
    description: '',
    price: 0,
    status: 'pending' as const,
    isPaid: false,
  })
}

const removeService = (index: number) => {
  if (services.value.length > 1) {
    services.value.splice(index, 1)
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

  for (let i = 0; i < services.value.length; i++) {
    const service = services.value[i]
    if (!service.name?.trim()) {
      error.value = `Service ${i + 1} name is required`
      return false
    }
    if (service.price && service.price <= 0) {
      error.value = `Service ${i + 1} price must be greater than 0`
      return false
    }
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    error.value = null

    // Create customer first
    const customer = await customerApi.createCustomer({
      name: customerForm.name.trim(),
      email: customerForm.email.trim(),
      phone: customerForm.phone.trim(),
      address: customerForm.address.trim(),
    })

    // Create services for the customer
    const servicePromises = services.value
      .filter((service) => service.name?.trim() && service.price && service.price > 0)
      .map((service) =>
        serviceApi.createService({
          customerId: customer.id,
          name: service.name!.trim(),
          description: service.description?.trim() || '',
          price: service.price!,
          status: service.status!,
          isPaid: service.isPaid!,
        }),
      )

    await Promise.all(servicePromises)

    // Navigate to customer detail page
    router.push(`/customers/${customer.id}`)
  } catch (err) {
    error.value = 'Failed to create customer'
    console.error('Error creating customer:', err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <BackButton />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add New Customer</h1>
        <p class="text-gray-600">Create a new customer and their services</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
    </div>

    <!-- Form -->
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <!-- Customer Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>

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

      <!-- Services -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Services</h3>
          <button
            type="button"
            @click="addService"
            class="bg-custom-red-600 text-white px-3 py-1 rounded-md hover:bg-custom-red-700 transition-colors text-sm"
          >
            Add Service
          </button>
        </div>

        <div class="space-y-6">
          <div
            v-for="(service, index) in services"
            :key="index"
            class="border border-gray-200 rounded-lg p-4"
          >
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-medium text-gray-900">Service {{ index + 1 }}</h4>
              <button
                v-if="services.length > 1"
                type="button"
                @click="removeService(index)"
                class="text-red-600 hover:text-red-800 text-sm"
              >
                Remove
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  :for="`service-name-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Name *
                </label>
                <input
                  :id="`service-name-${index}`"
                  v-model="service.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="Enter service name"
                />
              </div>

              <div>
                <label
                  :for="`service-price-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price *
                </label>
                <input
                  :id="`service-price-${index}`"
                  v-model.number="service.price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="0.00"
                />
              </div>

              <div class="md:col-span-2">
                <label
                  :for="`service-description-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  :id="`service-description-${index}`"
                  v-model="service.description"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500 resize-none"
                  placeholder="Enter service description"
                ></textarea>
              </div>

              <div>
                <label
                  :for="`service-status-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  :id="`service-status-${index}`"
                  v-model="service.status"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div class="flex items-center self-end">
                <input
                  :id="`service-paid-${index}`"
                  v-model="service.isPaid"
                  type="checkbox"
                  class="h-4 w-4 text-custom-red-600 focus:ring-custom-red-500 border-gray-300 rounded"
                />
                <label :for="`service-paid-${index}`" class="ml-2 block text-sm text-gray-900">
                  Payment Received
                </label>
              </div>
            </div>
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
          :disabled="loading"
          class="px-6 py-2 bg-custom-red-600 text-white rounded-md hover:bg-custom-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">Creating...</span>
          <span v-else>Create Customer</span>
        </button>
      </div>
    </form>
  </div>
</template>
