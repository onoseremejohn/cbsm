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
  contactFirstName: '',
  contactMiddleName: '',
  contactSurname: '',
  businessName: '',
  phoneNumbers: [''],
  emailAddresses: [''],
  physicalAddress: '',
  addressState: '',
  addressLocalGovernment: '',
  addressCity: '',
})

const addPhoneNumber = () => {
  customerForm.phoneNumbers.push('')
}

const removePhoneNumber = (index: number) => {
  if (customerForm.phoneNumbers.length > 1) {
    customerForm.phoneNumbers.splice(index, 1)
  }
}

const addEmailAddress = () => {
  customerForm.emailAddresses.push('')
}

const removeEmailAddress = (index: number) => {
  if (customerForm.emailAddresses.length > 1) {
    customerForm.emailAddresses.splice(index, 1)
  }
}

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
    customerForm.contactFirstName = customer.contactFirstName
    customerForm.contactMiddleName = customer.contactMiddleName || ''
    customerForm.contactSurname = customer.contactSurname
    customerForm.businessName = customer.businessName
    customerForm.phoneNumbers = [...customer.phoneNumbers]
    customerForm.emailAddresses = [...customer.emailAddresses]
    customerForm.physicalAddress = customer.physicalAddress
    customerForm.addressState = customer.addressState
    customerForm.addressLocalGovernment = customer.addressLocalGovernment
    customerForm.addressCity = customer.addressCity
  } catch (err) {
    error.value = 'Failed to load customer data'
    console.error('Error loading customer:', err)
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  if (!customerForm.businessName.trim()) {
    error.value = 'Business name is required'
    return false
  }
  if (!customerForm.contactFirstName.trim()) {
    error.value = 'Contact first name is required'
    return false
  }
  if (!customerForm.contactSurname.trim()) {
    error.value = 'Contact surname is required'
    return false
  }
  if (!customerForm.emailAddresses[0]?.trim()) {
    error.value = 'At least one email address is required'
    return false
  }
  if (!customerForm.phoneNumbers[0]?.trim()) {
    error.value = 'At least one phone number is required'
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
      contactFirstName: customerForm.contactFirstName.trim(),
      contactMiddleName: customerForm.contactMiddleName.trim(),
      contactSurname: customerForm.contactSurname.trim(),
      businessName: customerForm.businessName.trim(),
      phoneNumbers: customerForm.phoneNumbers.filter((phone) => phone.trim()),
      emailAddresses: customerForm.emailAddresses.filter((email) => email.trim()),
      physicalAddress: customerForm.physicalAddress.trim(),
      addressState: customerForm.addressState.trim(),
      addressLocalGovernment: customerForm.addressLocalGovernment.trim(),
      addressCity: customerForm.addressCity.trim(),
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
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="businessName" class="block text-sm font-medium text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              id="businessName"
              v-model="customerForm.businessName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter business name"
            />
          </div>

          <div>
            <label for="contactFirstName" class="block text-sm font-medium text-gray-700 mb-2">
              Contact First Name *
            </label>
            <input
              id="contactFirstName"
              v-model="customerForm.contactFirstName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter first name"
            />
          </div>

          <div>
            <label for="contactMiddleName" class="block text-sm font-medium text-gray-700 mb-2">
              Contact Middle Name
            </label>
            <input
              id="contactMiddleName"
              v-model="customerForm.contactMiddleName"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter middle name"
            />
          </div>

          <div>
            <label for="contactSurname" class="block text-sm font-medium text-gray-700 mb-2">
              Contact Surname *
            </label>
            <input
              id="contactSurname"
              v-model="customerForm.contactSurname"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter surname"
            />
          </div>

          <div>
            <label for="physicalAddress" class="block text-sm font-medium text-gray-700 mb-2">
              Physical Address
            </label>
            <input
              id="physicalAddress"
              v-model="customerForm.physicalAddress"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter physical address"
            />
          </div>

          <div>
            <label for="addressState" class="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              id="addressState"
              v-model="customerForm.addressState"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label for="addressCity" class="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              id="addressCity"
              v-model="customerForm.addressCity"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label
              for="addressLocalGovernment"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Local Government
            </label>
            <input
              id="addressLocalGovernment"
              v-model="customerForm.addressLocalGovernment"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter local government"
            />
          </div>
        </div>

        <!-- Phone Numbers -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"> Phone Numbers * </label>
          <div class="space-y-2">
            <div
              v-for="(phone, index) in customerForm.phoneNumbers"
              :key="index"
              class="flex gap-2"
            >
              <input
                v-model="customerForm.phoneNumbers[index]"
                type="tel"
                :required="index === 0"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                placeholder="Enter phone number"
              />
              <button
                v-if="customerForm.phoneNumbers.length > 1"
                type="button"
                @click="removePhoneNumber(index)"
                class="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              @click="addPhoneNumber"
              class="text-custom-red-600 hover:text-custom-red-800 text-sm"
            >
              + Add Phone Number
            </button>
          </div>
        </div>

        <!-- Email Addresses -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2"> Email Addresses * </label>
          <div class="space-y-2">
            <div
              v-for="(email, index) in customerForm.emailAddresses"
              :key="index"
              class="flex gap-2"
            >
              <input
                v-model="customerForm.emailAddresses[index]"
                type="email"
                :required="index === 0"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                placeholder="Enter email address"
              />
              <button
                v-if="customerForm.emailAddresses.length > 1"
                type="button"
                @click="removeEmailAddress(index)"
                class="px-3 py-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              @click="addEmailAddress"
              class="text-custom-red-600 hover:text-custom-red-800 text-sm"
            >
              + Add Email Address
            </button>
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
