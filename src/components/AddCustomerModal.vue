<script setup lang="ts">
import { ref, reactive } from 'vue'
import { customerApi } from '@/services/api'
import type { Customer } from '@/types/customer'
import ModalPreset from '@/components/ModalPreset.vue'

interface Props {
  isOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  close: []
  'customer-created': [customer: Customer]
}>()

const loading = ref(false)
const error = ref<string | null>(null)

// Form data
const form = reactive({
  contact_first_name: '',
  contact_middle_name: '',
  contact_surname: '',
  business_name: '',
  phone_numbers: [] as string[],
  email_addresses: [] as string[],
  physical_address: '',
  state: '',
  local_government_area: '',
  city: '',
})

// Individual input fields for phone and email
const phoneNumber = ref('')
const emailAddress = ref('')

// Computed properties to sync with arrays
const updateArrays = () => {
  if (phoneNumber.value.trim()) {
    form.phone_numbers = [phoneNumber.value.trim()]
  }
  if (emailAddress.value.trim()) {
    form.email_addresses = [emailAddress.value.trim()]
  }
}

const validateForm = () => {
  if (!form.contact_first_name.trim()) {
    error.value = 'First name is required'
    return false
  }
  if (!form.contact_surname.trim()) {
    error.value = 'Surname is required'
    return false
  }
  if (!form.business_name.trim()) {
    error.value = 'Business name is required'
    return false
  }
  if (!phoneNumber.value.trim()) {
    error.value = 'Phone number is required'
    return false
  }
  if (!emailAddress.value.trim()) {
    error.value = 'Email address is required'
    return false
  }
  if (!form.physical_address.trim()) {
    error.value = 'Physical address is required'
    return false
  }
  if (!form.state.trim()) {
    error.value = 'State is required'
    return false
  }
  if (!form.local_government_area.trim()) {
    error.value = 'Local government area is required'
    return false
  }
  if (!form.city.trim()) {
    error.value = 'City is required'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    loading.value = true
    error.value = null

    // Update arrays with current values
    updateArrays()

    // Create customer
    const customer = await customerApi.createCustomer({
      contact_first_name: form.contact_first_name.trim(),
      contact_middle_name: form.contact_middle_name.trim(),
      contact_surname: form.contact_surname.trim(),
      business_name: form.business_name.trim(),
      phone_numbers: form.phone_numbers,
      email_addresses: form.email_addresses,
      physical_address: form.physical_address.trim(),
      state: form.state.trim(),
      local_government_area: form.local_government_area.trim(),
      city: form.city.trim(),
    })

    // Reset form
    resetForm()

    // Emit events
    emit('customer-created', customer)
    emit('close')
  } catch (err) {
    error.value = 'Failed to create customer'
    console.error('Error creating customer:', err)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.contact_first_name = ''
  form.contact_middle_name = ''
  form.contact_surname = ''
  form.business_name = ''
  form.phone_numbers = []
  form.email_addresses = []
  form.physical_address = ''
  form.state = ''
  form.local_government_area = ''
  form.city = ''
  phoneNumber.value = ''
  emailAddress.value = ''
  error.value = null
}

const closeModal = () => {
  resetForm()
  emit('close')
}
</script>

<template>
  <ModalPreset :isOpen="isOpen" title="Add New Customer" @close="closeModal" >
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Error Message -->
      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>

      <!-- Customer Information -->
      <div class="space-y-4">
        <h3 class="text-lg font-medium text-gray-900">Customer Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="first-name" class="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              id="first-name"
              v-model="form.contact_first_name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label for="middle-name" class="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              id="middle-name"
              v-model="form.contact_middle_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter middle name"
            />
          </div>

          <div>
            <label for="surname" class="block text-sm font-medium text-gray-700 mb-2">
              Surname *
            </label>
            <input
              id="surname"
              v-model="form.contact_surname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter surname"
            />
          </div>
        </div>

        <div>
          <label for="business-name" class="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            id="business-name"
            v-model="form.business_name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
            placeholder="Enter business name"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <input
              id="phone"
              v-model="phoneNumber"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              id="email"
              v-model="emailAddress"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div>
          <label for="physical-address" class="block text-sm font-medium text-gray-700 mb-2">
            Physical Address *
          </label>
          <input
            id="physical-address"
            v-model="form.physical_address"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
            placeholder="Enter physical address"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              id="state"
              v-model="form.state"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label for="local-government" class="block text-sm font-medium text-gray-700 mb-2">
              Local Government Area *
            </label>
            <input
              id="local-government"
              v-model="form.local_government_area"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter LGA"
            />
          </div>

          <div>
            <label for="city" class="block text-sm font-medium text-gray-700 mb-2"> City * </label>
            <input
              id="city"
              v-model="form.city"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter city"
            />
          </div>
        </div>
      </div>

      <!-- Submit Buttons -->
      <div class="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="closeModal"
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
  </ModalPreset>
</template>
