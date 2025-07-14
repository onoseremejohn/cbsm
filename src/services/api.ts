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
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, State 12345',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    address: '456 Oak Ave, City, State 12345',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1234567892',
    address: '789 Pine Rd, City, State 12345',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
]

const mockServices: Service[] = [
  {
    id: 1,
    customerId: 1,
    name: 'Website Development',
    description: 'Full-stack website development with React and Node.js',
    price: 2500,
    status: 'completed',
    isPaid: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 2,
    customerId: 1,
    name: 'SEO Optimization',
    description: 'Search engine optimization for better rankings',
    price: 800,
    status: 'pending',
    isPaid: false,
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: 3,
    customerId: 2,
    name: 'Mobile App Development',
    description: 'iOS and Android app development',
    price: 5000,
    status: 'completed',
    isPaid: true,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: 4,
    customerId: 3,
    name: 'Database Design',
    description: 'Custom database design and implementation',
    price: 1200,
    status: 'pending',
    isPaid: false,
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
  async createCustomer(
    customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Customer> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const newCustomer: Customer = {
      id: Math.max(...mockCustomers.map((c) => c.id)) + 1,
      ...customerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
      updatedAt: new Date().toISOString(),
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

    const totalRevenue = mockServices
      .filter((service) => service.isPaid)
      .reduce((sum, service) => sum + service.price, 0)

    return {
      totalCustomers: mockCustomers.length,
      totalServices: mockServices.length,
      totalRevenue,
      pendingServices: mockServices.filter((s) => s.status === 'pending').length,
      completedServices: mockServices.filter((s) => s.status === 'completed').length,
      paidServices: mockServices.filter((s) => s.isPaid).length,
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

  // Mark service as paid
  async markServiceAsPaid(id: number): Promise<Service | null> {
    return this.updateService(id, { isPaid: true })
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
