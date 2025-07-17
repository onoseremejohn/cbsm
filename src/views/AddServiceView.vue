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
  if (!serviceForm.serviceCode.trim()) {
    error.value = 'Service code is required'
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
      serviceCode: serviceForm.serviceCode.trim(),
      description: serviceForm.description.trim(),
      status: serviceForm.status,
      bandwidth: serviceForm.bandwidth.trim(),
      serviceType: serviceForm.serviceType.trim(),
      servicePlatform: serviceForm.servicePlatform.trim(),
      billingCycle: serviceForm.billingCycle.trim(),
      billingCycleAmount: serviceForm.billingCycleAmount,
      cycleStartDate: serviceForm.cycleStartDate.trim(),
      cycleEndDate: serviceForm.cycleEndDate.trim(),
      billingMode: serviceForm.billingMode.trim(),
      serviceAddress: serviceForm.serviceAddress.trim(),
      addressState: serviceForm.addressState.trim(),
      addressCity: serviceForm.addressCity.trim(),
      addressLocalGovernment: serviceForm.addressLocalGovernment.trim(),
      serialNumber: serviceForm.serialNumber.trim(),
      macAddress: serviceForm.macAddress.trim(),
      coreDevice: serviceForm.coreDevice.trim(),
      coreInterface: serviceForm.coreInterface.trim(),
      networkPlatform: serviceForm.networkPlatform.trim(),
      wanIpAddress: serviceForm.wanIpAddress.trim(),
      price: serviceForm.price,
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
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <BackButton />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Add New Service</h1>
        <p class="text-gray-600">Add a new service for this customer</p>
      </div>
    </div>
    <p v-if="customer" class="font-bold text-lg text-black mt-1">
      Customer: {{ customer.businessName }}
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
        <h3 class="text-lg font-medium text-gray-900 mb-4">Service Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="serviceCode" class="block text-sm font-medium text-gray-700 mb-2">
              Service Code *
            </label>
            <input
              id="serviceCode"
              v-model="serviceForm.serviceCode"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter service code"
            />
          </div>

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
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div>
            <label for="bandwidth" class="block text-sm font-medium text-gray-700 mb-2">
              Bandwidth
            </label>
            <input
              id="bandwidth"
              v-model="serviceForm.bandwidth"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., 100 Mbps"
            />
          </div>

          <div>
            <label for="serviceType" class="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <input
              id="serviceType"
              v-model="serviceForm.serviceType"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., Internet"
            />
          </div>

          <div>
            <label for="servicePlatform" class="block text-sm font-medium text-gray-700 mb-2">
              Service Platform
            </label>
            <input
              id="servicePlatform"
              v-model="serviceForm.servicePlatform"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., Fiber Optic"
            />
          </div>

          <div>
            <label for="billingCycle" class="block text-sm font-medium text-gray-700 mb-2">
              Billing Cycle
            </label>
            <input
              id="billingCycle"
              v-model="serviceForm.billingCycle"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., Monthly"
            />
          </div>

          <div>
            <label for="billingCycleAmount" class="block text-sm font-medium text-gray-700 mb-2">
              Billing Cycle Amount
            </label>
            <input
              id="billingCycleAmount"
              v-model.number="serviceForm.billingCycleAmount"
              type="number"
              min="0"
              step="0.01"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label for="cycleStartDate" class="block text-sm font-medium text-gray-700 mb-2">
              Cycle Start Date
            </label>
            <input
              id="cycleStartDate"
              v-model="serviceForm.cycleStartDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
            />
          </div>

          <div>
            <label for="cycleEndDate" class="block text-sm font-medium text-gray-700 mb-2">
              Cycle End Date
            </label>
            <input
              id="cycleEndDate"
              v-model="serviceForm.cycleEndDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
            />
          </div>

          <div>
            <label for="billingMode" class="block text-sm font-medium text-gray-700 mb-2">
              Billing Mode
            </label>
            <input
              id="billingMode"
              v-model="serviceForm.billingMode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., Prepaid"
            />
          </div>

          <div>
            <label for="serviceAddress" class="block text-sm font-medium text-gray-700 mb-2">
              Service Address
            </label>
            <input
              id="serviceAddress"
              v-model="serviceForm.serviceAddress"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter service address"
            />
          </div>

          <div>
            <label for="addressState" class="block text-sm font-medium text-gray-700 mb-2">
              Address State
            </label>
            <input
              id="addressState"
              v-model="serviceForm.addressState"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label for="addressCity" class="block text-sm font-medium text-gray-700 mb-2">
              Address City
            </label>
            <input
              id="addressCity"
              v-model="serviceForm.addressCity"
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
              Address Local Government
            </label>
            <input
              id="addressLocalGovernment"
              v-model="serviceForm.addressLocalGovernment"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter local government"
            />
          </div>

          <div>
            <label for="serialNumber" class="block text-sm font-medium text-gray-700 mb-2">
              Serial Number
            </label>
            <input
              id="serialNumber"
              v-model="serviceForm.serialNumber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="Enter serial number"
            />
          </div>

          <div>
            <label for="macAddress" class="block text-sm font-medium text-gray-700 mb-2">
              MAC Address
            </label>
            <input
              id="macAddress"
              v-model="serviceForm.macAddress"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., 00:1B:44:11:3A:B7"
            />
          </div>

          <div>
            <label for="coreDevice" class="block text-sm font-medium text-gray-700 mb-2">
              Core Device
            </label>
            <input
              id="coreDevice"
              v-model="serviceForm.coreDevice"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., Cisco Router"
            />
          </div>

          <div>
            <label for="coreInterface" class="block text-sm font-medium text-gray-700 mb-2">
              Core Interface
            </label>
            <input
              id="coreInterface"
              v-model="serviceForm.coreInterface"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., GigabitEthernet0/1"
            />
          </div>

          <div>
            <label for="networkPlatform" class="block text-sm font-medium text-gray-700 mb-2">
              Network Platform
            </label>
            <input
              id="networkPlatform"
              v-model="serviceForm.networkPlatform"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., Cisco IOS"
            />
          </div>

          <div>
            <label for="wanIpAddress" class="block text-sm font-medium text-gray-700 mb-2">
              WAN IP Address
            </label>
            <input
              id="wanIpAddress"
              v-model="serviceForm.wanIpAddress"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-red-500 focus:border-custom-red-500"
              placeholder="e.g., 192.168.1.100"
            />
          </div>
        </div>

        <div class="mt-6">
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
