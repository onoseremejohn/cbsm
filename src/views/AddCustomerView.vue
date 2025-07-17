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

const services = ref<Partial<Service>[]>([
  {
    serviceCode: '',
    description: '',
    status: 'active' as const,
    bandwidth: '',
    serviceType: '',
    servicePlatform: '',
    billingCycle: '',
    billingCycleAmount: 0,
    cycleStartDate: '',
    cycleEndDate: '',
    billingMode: '',
    serviceAddress: '',
    addressState: '',
    addressCity: '',
    addressLocalGovernment: '',
    serialNumber: '',
    macAddress: '',
    coreDevice: '',
    coreInterface: '',
    networkPlatform: '',
    wanIpAddress: '',
    price: 0,
  },
])

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

const addService = () => {
  services.value.push({
    serviceCode: '',
    description: '',
    status: 'active' as const,
    bandwidth: '',
    serviceType: '',
    servicePlatform: '',
    billingCycle: '',
    billingCycleAmount: 0,
    cycleStartDate: '',
    cycleEndDate: '',
    billingMode: '',
    serviceAddress: '',
    addressState: '',
    addressCity: '',
    addressLocalGovernment: '',
    serialNumber: '',
    macAddress: '',
    coreDevice: '',
    coreInterface: '',
    networkPlatform: '',
    wanIpAddress: '',
    price: 0,
  })
}

const removeService = (index: number) => {
  if (services.value.length > 1) {
    services.value.splice(index, 1)
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

  for (let i = 0; i < services.value.length; i++) {
    const service = services.value[i]
    if (!service.serviceCode?.trim()) {
      error.value = `Service ${i + 1} code is required`
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

    // Create services for the customer
    const servicePromises = services.value
      .filter((service) => service.serviceCode?.trim() && service.price && service.price > 0)
      .map((service) =>
        serviceApi.createService({
          customerId: customer.id,
          serviceCode: service.serviceCode!.trim(),
          description: service.description?.trim() || '',
          status: service.status!,
          bandwidth: service.bandwidth?.trim() || '',
          serviceType: service.serviceType?.trim() || '',
          servicePlatform: service.servicePlatform?.trim() || '',
          billingCycle: service.billingCycle?.trim() || '',
          billingCycleAmount: service.billingCycleAmount!,
          cycleStartDate: service.cycleStartDate?.trim() || '',
          cycleEndDate: service.cycleEndDate?.trim() || '',
          billingMode: service.billingMode?.trim() || '',
          serviceAddress: service.serviceAddress?.trim() || '',
          addressState: service.addressState?.trim() || '',
          addressCity: service.addressCity?.trim() || '',
          addressLocalGovernment: service.addressLocalGovernment?.trim() || '',
          serialNumber: service.serialNumber?.trim() || '',
          macAddress: service.macAddress?.trim() || '',
          coreDevice: service.coreDevice?.trim() || '',
          coreInterface: service.coreInterface?.trim() || '',
          networkPlatform: service.networkPlatform?.trim() || '',
          wanIpAddress: service.wanIpAddress?.trim() || '',
          price: service.price!,
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
                  :for="`service-code-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Code *
                </label>
                <input
                  :id="`service-code-${index}`"
                  v-model="service.serviceCode"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="Enter service code"
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
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>

              <div>
                <label
                  :for="`service-bandwidth-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Bandwidth
                </label>
                <input
                  :id="`service-bandwidth-${index}`"
                  v-model="service.bandwidth"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="e.g., 100 Mbps"
                />
              </div>

              <div>
                <label
                  :for="`service-type-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Type
                </label>
                <input
                  :id="`service-type-${index}`"
                  v-model="service.serviceType"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="e.g., Internet"
                />
              </div>

              <div>
                <label
                  :for="`service-platform-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Platform
                </label>
                <input
                  :id="`service-platform-${index}`"
                  v-model="service.servicePlatform"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="e.g., Fiber Optic"
                />
              </div>

              <div>
                <label
                  :for="`service-billing-cycle-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Billing Cycle
                </label>
                <input
                  :id="`service-billing-cycle-${index}`"
                  v-model="service.billingCycle"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="e.g., Monthly"
                />
              </div>

              <div>
                <label
                  :for="`service-billing-amount-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Billing Cycle Amount
                </label>
                <input
                  :id="`service-billing-amount-${index}`"
                  v-model.number="service.billingCycleAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label
                  :for="`service-cycle-start-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Cycle Start Date
                </label>
                <input
                  :id="`service-cycle-start-${index}`"
                  v-model="service.cycleStartDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                />
              </div>

              <div>
                <label
                  :for="`service-cycle-end-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Cycle End Date
                </label>
                <input
                  :id="`service-cycle-end-${index}`"
                  v-model="service.cycleEndDate"
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                />
              </div>

              <div>
                <label
                  :for="`service-billing-mode-${index}`"
                  class="block text-sm font-medium text-gray-700 mb-2"
                >
                  Billing Mode
                </label>
                <input
                  :id="`service-billing-mode-${index}`"
                  v-model="service.billingMode"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
                  placeholder="e.g., Prepaid"
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
