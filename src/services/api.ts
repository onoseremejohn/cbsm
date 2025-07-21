import axios from 'axios'
import type { Customer, Service, CustomerWithServices, CustomerStats } from '@/types/customer'

// Using JSONPlaceholder for demo data
const API_BASE_URL = 'https://jsonplaceholder.typicode.com'

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Mock data for customers and services (since JSONPlaceholder doesn't have our exact structure)
const mockCustomers: Customer[] = [
  {
    id: 1,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 2,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 3,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 4,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 5,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 6,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 7,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 8,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 9,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 10,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 11,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 12,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 13,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 14,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 15,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 16,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 17,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 18,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 19,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 20,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 21,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 22,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 23,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 24,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 25,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 26,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 27,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
  {
    id: 28,
    contact_first_name: 'John',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'John Doe Inc',
    phone_numbers: ['+1234567890', '+1234567891'],
    email_addresses: ['john.doe@example.com', 'john.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Lagos',
    local_government_area: 'Ikeja',
    city: 'Lagos',
  },
  {
    id: 29,
    contact_first_name: 'Jane',
    contact_middle_name: 'Doe',
    contact_surname: 'Smith',
    business_name: 'Jane Doe Inc',
    phone_numbers: ['+1234567892', '+1234567893'],
    email_addresses: ['jane.doe@example.com', 'jane.doe@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Edo',
    local_government_area: 'Benin',
    city: 'Benin',
  },
  {
    id: 30,
    contact_first_name: 'Bob',
    contact_middle_name: 'Doe',
    contact_surname: 'Johnson',
    business_name: 'Bob Johnson Inc',
    phone_numbers: ['+1234567894', '+1234567895'],
    email_addresses: ['bob.johnson@example.com', 'bob.johnson@gmail.com'],
    physical_address: '123 Main St, City, State 12345',
    state: 'Rivers',
    local_government_area: 'Port Harcourt',
    city: 'Port Harcourt',
  },
]

const mockServices: Service[] = [
  {
    id: 1,
    customerId: 1,
    serviceCode: 'SRV-001',
    description: 'High-speed internet connection',
    bandwidth: '100 Mbps',
    serviceType: 'Internet',
    servicePlatform: 'Fiber',
    billingCycle: 'Monthly',
    billingCycleAmount: 2500,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '123 Main St, Lagos',
    addressState: 'Lagos',
    addressCity: 'Lagos',
    addressLocalGovernment: 'Ikeja',
    serialNumber: 'SN-2024-001',
    macAddress: '00:1B:44:11:3A:B7',
    coreDevice: 'Router-01',
    coreInterface: 'GigabitEthernet0/1',
    networkPlatform: 'Cisco',
    wanIpAddress: '192.168.1.100',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 2,
    customerId: 1,
    serviceCode: 'SRV-002',
    description: 'VPN service for remote access',
    bandwidth: '50 Mbps',
    serviceType: 'VPN',
    servicePlatform: 'Cloud',
    billingCycle: 'Monthly',
    billingCycleAmount: 800,
    cycleStartDate: '2024-01-18',
    cycleEndDate: '2024-02-17',
    billingMode: 'Postpaid',
    serviceAddress: '123 Main St, Lagos',
    addressState: 'Lagos',
    addressCity: 'Lagos',
    addressLocalGovernment: 'Ikeja',
    serialNumber: 'SN-2024-002',
    macAddress: '00:1B:44:11:3A:B8',
    coreDevice: 'Switch-01',
    coreInterface: 'FastEthernet0/1',
    networkPlatform: 'Juniper',
    wanIpAddress: '192.168.1.101',
    status: 'suspended',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: 3,
    customerId: 2,
    serviceCode: 'SRV-003',
    description: 'Dedicated server hosting',
    bandwidth: '1 Gbps',
    serviceType: 'Hosting',
    servicePlatform: 'Dedicated',
    billingCycle: 'Quarterly',
    billingCycleAmount: 5000,
    cycleStartDate: '2024-01-16',
    cycleEndDate: '2024-04-15',
    billingMode: 'Prepaid',
    serviceAddress: '456 Business Ave, Benin',
    addressState: 'Edo',
    addressCity: 'Benin',
    addressLocalGovernment: 'Benin',
    serialNumber: 'SN-2024-003',
    macAddress: '00:1B:44:11:3A:B9',
    coreDevice: 'Server-01',
    coreInterface: 'Ethernet0/1',
    networkPlatform: 'HP',
    wanIpAddress: '192.168.1.102',
    status: 'active',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: 4,
    customerId: 3,
    serviceCode: 'SRV-004',
    description: 'Cloud storage solution',
    bandwidth: '200 Mbps',
    serviceType: 'Storage',
    servicePlatform: 'Cloud',
    billingCycle: 'Monthly',
    billingCycleAmount: 1200,
    cycleStartDate: '2024-01-17',
    cycleEndDate: '2024-02-16',
    billingMode: 'Postpaid',
    serviceAddress: '789 Tech St, Port Harcourt',
    addressState: 'Rivers',
    addressCity: 'Port Harcourt',
    addressLocalGovernment: 'Port Harcourt',
    serialNumber: 'SN-2024-004',
    macAddress: '00:1B:44:11:3A:BA',
    coreDevice: 'Storage-01',
    coreInterface: 'GigabitEthernet0/2',
    networkPlatform: 'Dell',
    wanIpAddress: '192.168.1.103',
    status: 'cancelled',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
]

export const customerApi = {
  // Get all customers with their services
  async getCustomers(): Promise<CustomerWithServices[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return mockCustomers.map((customer) => ({
      ...customer,
      services: mockServices.filter((service) => service.customerId === customer.id),
    }))
  },

  // Get customer by ID
  async getCustomer(id: number): Promise<CustomerWithServices | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const customer = mockCustomers.find((c) => c.id === id)
    if (!customer) return null

    return {
      ...customer,
      services: mockServices.filter((service) => service.customerId === customer.id),
    }
  },

  // Create new customer
  async createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const newCustomer: Customer = {
      id: Math.max(...mockCustomers.map((c) => c.id)) + 1,
      contact_first_name: customerData.contact_first_name,
      contact_middle_name: customerData.contact_middle_name,
      contact_surname: customerData.contact_surname,
      business_name: customerData.business_name,
      phone_numbers: customerData.phone_numbers,
      email_addresses: customerData.email_addresses,
      physical_address: customerData.physical_address,
      state: customerData.state,
      local_government_area: customerData.local_government_area,
      city: customerData.city,
    }

    mockCustomers.push(newCustomer)
    return newCustomer
  },

  // Update customer
  async updateCustomer(id: number, customerData: Partial<Customer>): Promise<Customer | null> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const customerIndex = mockCustomers.findIndex((c) => c.id === id)
    if (customerIndex === -1) return null

    mockCustomers[customerIndex] = {
      ...mockCustomers[customerIndex],
      ...customerData,
    }

    return mockCustomers[customerIndex]
  },

  // Delete customer
  async deleteCustomer(id: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const customerIndex = mockCustomers.findIndex((c) => c.id === id)
    if (customerIndex === -1) return false

    mockCustomers.splice(customerIndex, 1)
    // Also remove related services
    const serviceIndices = mockServices
      .map((service, index) => (service.customerId === id ? index : -1))
      .filter((index) => index !== -1)
      .reverse()

    serviceIndices.forEach((index) => mockServices.splice(index, 1))

    return true
  },

  // Get customer statistics
  async getCustomerStats(): Promise<CustomerStats> {
    await new Promise((resolve) => setTimeout(resolve, 200))

    const totalRevenue = mockServices.reduce(
      (sum, service) => sum + (service.billingCycleAmount || 0),
      0,
    )

    return {
      totalCustomers: mockCustomers.length,
      totalServices: mockServices.length,
      totalRevenue,
      pendingServices: mockServices.filter((s) => s.status === 'suspended').length,
      completedServices: mockServices.filter((s) => s.status === 'active').length,
    }
  },
}

export const serviceApi = {
  // Get all services
  async getServices(): Promise<Service[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return mockServices
  },

  // Get service by ID
  async getService(id: number): Promise<Service | null> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return mockServices.find((s) => s.id === id) || null
  },

  // Create new service
  async createService(
    serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Service> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const newService: Service = {
      id: Math.max(...mockServices.map((s) => s.id)) + 1,
      ...serviceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    mockServices.push(newService)
    return newService
  },

  // Update service
  async updateService(id: number, serviceData: Partial<Service>): Promise<Service | null> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const serviceIndex = mockServices.findIndex((s) => s.id === id)
    if (serviceIndex === -1) return null

    mockServices[serviceIndex] = {
      ...mockServices[serviceIndex],
      ...serviceData,
      updatedAt: new Date().toISOString(),
    }

    return mockServices[serviceIndex]
  },

  // Delete service
  async deleteService(id: number): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const serviceIndex = mockServices.findIndex((s) => s.id === id)
    if (serviceIndex === -1) return false

    mockServices.splice(serviceIndex, 1)
    return true
  },
}
