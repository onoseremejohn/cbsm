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
  contact_first_name: '',
  contact_middle_name: '',
  contact_surname: '',
  business_name: '',
  phone_numbers: [''],
  email_addresses: [''],
  physical_address: '',
  state: '',
  local_government_area: '',
  city: '',
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
    customerForm.contact_first_name = customer.contact_first_name
    customerForm.contact_middle_name = customer.contact_middle_name
    customerForm.contact_surname = customer.contact_surname
    customerForm.business_name = customer.business_name
    customerForm.phone_numbers = [...customer.phone_numbers]
    customerForm.email_addresses = [...customer.email_addresses]
    customerForm.physical_address = customer.physical_address
    customerForm.state = customer.state
    customerForm.local_government_area = customer.local_government_area
    customerForm.city = customer.city
  } catch (err) {
    error.value = 'Failed to load customer data'
    console.error('Error loading customer:', err)
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (!customerForm.contact_first_name.trim()) {
    error.value = 'Contact first name is required'
    return false
  }
  if (!customerForm.contact_surname.trim()) {
    error.value = 'Contact surname is required'
    return false
  }
  if (!customerForm.business_name.trim()) {
    error.value = 'Business name is required'
    return false
  }
  if (customerForm.phone_numbers.length === 0 || !customerForm.phone_numbers[0].trim()) {
    error.value = 'At least one phone number is required'
    return false
  }
  if (customerForm.email_addresses.length === 0 || !customerForm.email_addresses[0].trim()) {
    error.value = 'At least one email address is required'
    return false
  }

  return true
}

const addPhoneNumber = () => {
  customerForm.phone_numbers.push('')
}

const removePhoneNumber = (index: number) => {
  if (customerForm.phone_numbers.length > 1) {
    customerForm.phone_numbers.splice(index, 1)
  }
}

const addEmailAddress = () => {
  customerForm.email_addresses.push('')
}

const removeEmailAddress = (index: number) => {
  if (customerForm.email_addresses.length > 1) {
    customerForm.email_addresses.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    saving.value = true
    error.value = null

    await customerApi.updateCustomer(customerId, {
      contact_first_name: customerForm.contact_first_name.trim(),
      contact_middle_name: customerForm.contact_middle_name.trim(),
      contact_surname: customerForm.contact_surname.trim(),
      business_name: customerForm.business_name.trim(),
      phone_numbers: customerForm.phone_numbers.filter((phone) => phone.trim()),
      email_addresses: customerForm.email_addresses.filter((email) => email.trim()),
      physical_address: customerForm.physical_address.trim(),
      state: customerForm.state.trim(),
      local_government_area: customerForm.local_government_area.trim(),
      city: customerForm.city.trim(),
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
  <div class="max-w-4xl mx-auto space-y-6">
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
      <!-- Contact Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label for="contact_first_name" class="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <input
              id="contact_first_name"
              v-model="customerForm.contact_first_name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label for="contact_middle_name" class="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              id="contact_middle_name"
              v-model="customerForm.contact_middle_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter middle name"
            />
          </div>

          <div>
            <label for="contact_surname" class="block text-sm font-medium text-gray-700 mb-2">
              Surname *
            </label>
            <input
              id="contact_surname"
              v-model="customerForm.contact_surname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter surname"
            />
          </div>
        </div>
      </div>

      <!-- Business Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Business Information</h3>
        <div>
          <label for="business_name" class="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            id="business_name"
            v-model="customerForm.business_name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
            placeholder="Enter business name"
          />
        </div>
      </div>

      <!-- Phone Numbers -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Phone Numbers</h3>
        <div class="space-y-4">
          <div
            v-for="(phone, index) in customerForm.phone_numbers"
            :key="`phone-${index}`"
            class="flex gap-2"
          >
            <input
              v-model="customerForm.phone_numbers[index]"
              type="tel"
              :required="index === 0"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              :placeholder="
                index === 0 ? 'Enter primary phone number *' : 'Enter additional phone number'
              "
            />
            <button
              v-if="customerForm.phone_numbers.length > 1"
              type="button"
              @click="removePhoneNumber(index)"
              class="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            @click="addPhoneNumber"
            class="text-custom-red-600 hover:text-custom-red-800 underline text-sm"
          >
            + Add another phone number
          </button>
        </div>
      </div>

      <!-- Email Addresses -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Email Addresses</h3>
        <div class="space-y-4">
          <div
            v-for="(email, index) in customerForm.email_addresses"
            :key="`email-${index}`"
            class="flex gap-2"
          >
            <input
              v-model="customerForm.email_addresses[index]"
              type="email"
              :required="index === 0"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              :placeholder="
                index === 0 ? 'Enter primary email address *' : 'Enter additional email address'
              "
            />
            <button
              v-if="customerForm.email_addresses.length > 1"
              type="button"
              @click="removeEmailAddress(index)"
              class="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
            >
              Remove
            </button>
          </div>
          <button
            type="button"
            @click="addEmailAddress"
            class="text-custom-red-600 hover:text-custom-red-800 underline text-sm"
          >
            + Add another email address
          </button>
        </div>
      </div>

      <!-- Address Information -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
        <div class="space-y-4">
          <div>
            <label for="physical_address" class="block text-sm font-medium text-gray-700 mb-2">
              Physical Address
            </label>
            <textarea
              id="physical_address"
              v-model="customerForm.physical_address"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500 resize-none"
              placeholder="Enter physical address"
            ></textarea>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                id="state"
                v-model="customerForm.state"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                placeholder="Enter state"
              />
            </div>

            <div>
              <label
                for="local_government_area"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Local Government Area
              </label>
              <input
                id="local_government_area"
                v-model="customerForm.local_government_area"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                placeholder="Enter LGA"
              />
            </div>

            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2"> City </label>
              <input
                id="city"
                v-model="customerForm.city"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                placeholder="Enter city"
              />
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
