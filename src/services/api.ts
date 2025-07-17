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
    contactFirstName: 'John',
    contactMiddleName: 'Michael',
    contactSurname: 'Doe',
    businessName: 'Tech Solutions Ltd',
    phoneNumbers: ['+1234567890', '+1234567891'],
    emailAddresses: ['john.doe@techsolutions.com', 'contact@techsolutions.com'],
    physicalAddress: '123 Main Street',
    addressState: 'Lagos',
    addressLocalGovernment: 'Victoria Island',
    addressCity: 'Lagos',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    contactFirstName: 'Jane',
    contactSurname: 'Smith',
    businessName: 'Digital Innovations Corp',
    phoneNumbers: ['+1234567892'],
    emailAddresses: ['jane.smith@digitalinnovations.com'],
    physicalAddress: '456 Oak Avenue',
    addressState: 'Abuja',
    addressLocalGovernment: 'Central Business District',
    addressCity: 'Abuja',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 3,
    contactFirstName: 'Bob',
    contactSurname: 'Johnson',
    businessName: 'Network Solutions',
    phoneNumbers: ['+1234567893', '+1234567894'],
    emailAddresses: ['bob.johnson@networksolutions.com'],
    physicalAddress: '789 Pine Road',
    addressState: 'Port Harcourt',
    addressLocalGovernment: 'Port Harcourt City',
    addressCity: 'Port Harcourt',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
  {
    id: 4,
    contactFirstName: 'Sarah',
    contactSurname: 'Williams',
    businessName: 'Cloud Computing Services',
    phoneNumbers: ['+1234567895', '+1234567896'],
    emailAddresses: ['sarah.williams@cloudcomputing.com', 'support@cloudcomputing.com'],
    physicalAddress: '321 Tech Boulevard',
    addressState: 'Kano',
    addressLocalGovernment: 'Municipal',
    addressCity: 'Kano',
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-18T13:00:00Z',
  },
  {
    id: 5,
    contactFirstName: 'Michael',
    contactSurname: 'Brown',
    businessName: 'Data Analytics Pro',
    phoneNumbers: ['+1234567897'],
    emailAddresses: ['michael.brown@dataanalytics.com'],
    physicalAddress: '654 Innovation Drive',
    addressState: 'Kaduna',
    addressLocalGovernment: 'Kaduna North',
    addressCity: 'Kaduna',
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T14:00:00Z',
  },
  {
    id: 6,
    contactFirstName: 'Emily',
    contactSurname: 'Davis',
    businessName: 'Web Development Studio',
    phoneNumbers: ['+1234567898', '+1234567899'],
    emailAddresses: ['emily.davis@webdevstudio.com', 'hello@webdevstudio.com'],
    physicalAddress: '987 Creative Lane',
    addressState: 'Enugu',
    addressLocalGovernment: 'Enugu North',
    addressCity: 'Enugu',
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 7,
    contactFirstName: 'David',
    contactSurname: 'Wilson',
    businessName: 'Mobile App Solutions',
    phoneNumbers: ['+1234567900'],
    emailAddresses: ['david.wilson@mobileapps.com'],
    physicalAddress: '147 App Street',
    addressState: 'Ibadan',
    addressLocalGovernment: 'Ibadan North',
    addressCity: 'Ibadan',
    createdAt: '2024-01-21T16:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
  },
  {
    id: 8,
    contactFirstName: 'Lisa',
    contactSurname: 'Anderson',
    businessName: 'Cybersecurity Experts',
    phoneNumbers: ['+1234567901', '+1234567902'],
    emailAddresses: ['lisa.anderson@cybersecurity.com', 'security@cybersecurity.com'],
    physicalAddress: '258 Security Road',
    addressState: 'Calabar',
    addressLocalGovernment: 'Calabar Municipal',
    addressCity: 'Calabar',
    createdAt: '2024-01-22T17:00:00Z',
    updatedAt: '2024-01-22T17:00:00Z',
  },
  {
    id: 9,
    contactFirstName: 'James',
    contactSurname: 'Taylor',
    businessName: 'AI Research Lab',
    phoneNumbers: ['+1234567903'],
    emailAddresses: ['james.taylor@airesearch.com'],
    physicalAddress: '369 AI Avenue',
    addressState: 'Jos',
    addressLocalGovernment: 'Jos North',
    addressCity: 'Jos',
    createdAt: '2024-01-23T18:00:00Z',
    updatedAt: '2024-01-23T18:00:00Z',
  },
  {
    id: 10,
    contactFirstName: 'Maria',
    contactSurname: 'Garcia',
    businessName: 'Blockchain Technologies',
    phoneNumbers: ['+1234567904', '+1234567905'],
    emailAddresses: ['maria.garcia@blockchain.com', 'info@blockchain.com'],
    physicalAddress: '741 Blockchain Way',
    addressState: 'Benin City',
    addressLocalGovernment: 'Oredo',
    addressCity: 'Benin City',
    createdAt: '2024-01-24T19:00:00Z',
    updatedAt: '2024-01-24T19:00:00Z',
  },
  {
    id: 11,
    contactFirstName: 'Robert',
    contactSurname: 'Martinez',
    businessName: 'IoT Solutions',
    phoneNumbers: ['+1234567906'],
    emailAddresses: ['robert.martinez@iotsolutions.com'],
    physicalAddress: '852 IoT Street',
    addressState: 'Abeokuta',
    addressLocalGovernment: 'Abeokuta North',
    addressCity: 'Abeokuta',
    createdAt: '2024-01-25T20:00:00Z',
    updatedAt: '2024-01-25T20:00:00Z',
  },
  {
    id: 12,
    contactFirstName: 'Jennifer',
    contactSurname: 'Lee',
    businessName: 'Virtual Reality Studio',
    phoneNumbers: ['+1234567907', '+1234567908'],
    emailAddresses: ['jennifer.lee@vrstudio.com', 'contact@vrstudio.com'],
    physicalAddress: '963 VR Boulevard',
    addressState: 'Sokoto',
    addressLocalGovernment: 'Sokoto North',
    addressCity: 'Sokoto',
    createdAt: '2024-01-26T21:00:00Z',
    updatedAt: '2024-01-26T21:00:00Z',
  },
]

const mockServices: Service[] = [
  {
    id: 1,
    customerId: 1,
    serviceCode: 'INT-001',
    description: 'High-speed internet connection for business',
    status: 'active',
    bandwidth: '100 Mbps',
    serviceType: 'Internet',
    servicePlatform: 'Fiber Optic',
    billingCycle: 'Monthly',
    billingCycleAmount: 50000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '123 Main Street',
    addressState: 'Lagos',
    addressCity: 'Lagos',
    addressLocalGovernment: 'Victoria Island',
    serialNumber: 'SN123456789',
    macAddress: '00:1B:44:11:3A:B7',
    coreDevice: 'Cisco Router',
    coreInterface: 'GigabitEthernet0/1',
    networkPlatform: 'Cisco IOS',
    wanIpAddress: '192.168.1.100',
    price: 50000,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 2,
    customerId: 1,
    serviceCode: 'INT-002',
    description: 'Backup internet connection',
    status: 'suspended',
    bandwidth: '50 Mbps',
    serviceType: 'Internet',
    servicePlatform: 'Wireless',
    billingCycle: 'Monthly',
    billingCycleAmount: 25000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Postpaid',
    serviceAddress: '123 Main Street',
    addressState: 'Lagos',
    addressCity: 'Lagos',
    addressLocalGovernment: 'Victoria Island',
    serialNumber: 'SN987654321',
    macAddress: '00:1B:44:11:3A:B8',
    coreDevice: 'Mikrotik Router',
    coreInterface: 'Ethernet1',
    networkPlatform: 'RouterOS',
    wanIpAddress: '192.168.1.101',
    price: 25000,
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
  },
  {
    id: 3,
    customerId: 2,
    serviceCode: 'INT-003',
    description: 'Enterprise internet solution',
    status: 'active',
    bandwidth: '200 Mbps',
    serviceType: 'Internet',
    servicePlatform: 'Fiber Optic',
    billingCycle: 'Monthly',
    billingCycleAmount: 100000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '456 Oak Avenue',
    addressState: 'Abuja',
    addressCity: 'Abuja',
    addressLocalGovernment: 'Central Business District',
    serialNumber: 'SN456789123',
    macAddress: '00:1B:44:11:3A:B9',
    coreDevice: 'Juniper Router',
    coreInterface: 'ge-0/0/1',
    networkPlatform: 'Junos OS',
    wanIpAddress: '192.168.1.102',
    price: 100000,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-25T14:00:00Z',
  },
  {
    id: 4,
    customerId: 3,
    serviceCode: 'INT-004',
    description: 'Basic internet package',
    status: 'cancelled',
    bandwidth: '25 Mbps',
    serviceType: 'Internet',
    servicePlatform: 'Copper',
    billingCycle: 'Monthly',
    billingCycleAmount: 15000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '789 Pine Road',
    addressState: 'Port Harcourt',
    addressCity: 'Port Harcourt',
    addressLocalGovernment: 'Port Harcourt City',
    serialNumber: 'SN789123456',
    macAddress: '00:1B:44:11:3A:BA',
    coreDevice: 'TP-Link Router',
    coreInterface: 'WAN',
    networkPlatform: 'OpenWrt',
    wanIpAddress: '192.168.1.103',
    price: 15000,
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
  {
    id: 5,
    customerId: 4,
    serviceCode: 'CLOUD-001',
    description: 'Cloud hosting service',
    status: 'active',
    bandwidth: 'Unlimited',
    serviceType: 'Cloud',
    servicePlatform: 'AWS',
    billingCycle: 'Monthly',
    billingCycleAmount: 75000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Postpaid',
    serviceAddress: '321 Tech Boulevard',
    addressState: 'Kano',
    addressCity: 'Kano',
    addressLocalGovernment: 'Municipal',
    serialNumber: 'SN111222333',
    macAddress: '00:1B:44:11:3A:BB',
    coreDevice: 'Cloud Server',
    coreInterface: 'Virtual',
    networkPlatform: 'Linux',
    wanIpAddress: '10.0.0.1',
    price: 75000,
    createdAt: '2024-01-18T13:00:00Z',
    updatedAt: '2024-01-18T13:00:00Z',
  },
  {
    id: 6,
    customerId: 4,
    serviceCode: 'CLOUD-002',
    description: 'Database hosting service',
    status: 'active',
    bandwidth: 'Unlimited',
    serviceType: 'Cloud',
    servicePlatform: 'Azure',
    billingCycle: 'Monthly',
    billingCycleAmount: 60000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '321 Tech Boulevard',
    addressState: 'Kano',
    addressCity: 'Kano',
    addressLocalGovernment: 'Municipal',
    serialNumber: 'SN444555666',
    macAddress: '00:1B:44:11:3A:BC',
    coreDevice: 'Cloud Database',
    coreInterface: 'Virtual',
    networkPlatform: 'Windows Server',
    wanIpAddress: '10.0.0.2',
    price: 60000,
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T14:00:00Z',
  },
  {
    id: 7,
    customerId: 5,
    serviceCode: 'DATA-001',
    description: 'Data analytics platform',
    status: 'active',
    bandwidth: '500 Mbps',
    serviceType: 'Data',
    servicePlatform: 'Custom',
    billingCycle: 'Monthly',
    billingCycleAmount: 120000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Postpaid',
    serviceAddress: '654 Innovation Drive',
    addressState: 'Kaduna',
    addressCity: 'Kaduna',
    addressLocalGovernment: 'Kaduna North',
    serialNumber: 'SN777888999',
    macAddress: '00:1B:44:11:3A:BD',
    coreDevice: 'Analytics Server',
    coreInterface: 'Ethernet',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.104',
    price: 120000,
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T14:00:00Z',
  },
  {
    id: 8,
    customerId: 6,
    serviceCode: 'WEB-001',
    description: 'Web hosting service',
    status: 'active',
    bandwidth: 'Unlimited',
    serviceType: 'Web',
    servicePlatform: 'cPanel',
    billingCycle: 'Monthly',
    billingCycleAmount: 30000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '987 Creative Lane',
    addressState: 'Enugu',
    addressCity: 'Enugu',
    addressLocalGovernment: 'Enugu North',
    serialNumber: 'SN000111222',
    macAddress: '00:1B:44:11:3A:BE',
    coreDevice: 'Web Server',
    coreInterface: 'Ethernet',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.105',
    price: 30000,
    createdAt: '2024-01-20T15:00:00Z',
    updatedAt: '2024-01-20T15:00:00Z',
  },
  {
    id: 9,
    customerId: 6,
    serviceCode: 'WEB-002',
    description: 'SSL certificate service',
    status: 'active',
    bandwidth: 'N/A',
    serviceType: 'Security',
    servicePlatform: "Let's Encrypt",
    billingCycle: 'Yearly',
    billingCycleAmount: 15000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-12-31',
    billingMode: 'Prepaid',
    serviceAddress: '987 Creative Lane',
    addressState: 'Enugu',
    addressCity: 'Enugu',
    addressLocalGovernment: 'Enugu North',
    serialNumber: 'SN333444555',
    macAddress: '00:1B:44:11:3A:BF',
    coreDevice: 'SSL Server',
    coreInterface: 'Virtual',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.106',
    price: 15000,
    createdAt: '2024-01-21T16:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
  },
  {
    id: 10,
    customerId: 7,
    serviceCode: 'MOBILE-001',
    description: 'Mobile app hosting',
    status: 'active',
    bandwidth: 'Unlimited',
    serviceType: 'Mobile',
    servicePlatform: 'Firebase',
    billingCycle: 'Monthly',
    billingCycleAmount: 45000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Postpaid',
    serviceAddress: '147 App Street',
    addressState: 'Ibadan',
    addressCity: 'Ibadan',
    addressLocalGovernment: 'Ibadan North',
    serialNumber: 'SN666777888',
    macAddress: '00:1B:44:11:3A:C0',
    coreDevice: 'Mobile Server',
    coreInterface: 'Virtual',
    networkPlatform: 'Google Cloud',
    wanIpAddress: '10.0.0.3',
    price: 45000,
    createdAt: '2024-01-21T16:00:00Z',
    updatedAt: '2024-01-21T16:00:00Z',
  },
  {
    id: 11,
    customerId: 8,
    serviceCode: 'SEC-001',
    description: 'Cybersecurity monitoring',
    status: 'active',
    bandwidth: 'Unlimited',
    serviceType: 'Security',
    servicePlatform: 'Custom',
    billingCycle: 'Monthly',
    billingCycleAmount: 80000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '258 Security Road',
    addressState: 'Calabar',
    addressCity: 'Calabar',
    addressLocalGovernment: 'Calabar Municipal',
    serialNumber: 'SN999000111',
    macAddress: '00:1B:44:11:3A:C1',
    coreDevice: 'Security Server',
    coreInterface: 'Ethernet',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.107',
    price: 80000,
    createdAt: '2024-01-22T17:00:00Z',
    updatedAt: '2024-01-22T17:00:00Z',
  },
  {
    id: 12,
    customerId: 8,
    serviceCode: 'SEC-002',
    description: 'Firewall protection service',
    status: 'suspended',
    bandwidth: 'Unlimited',
    serviceType: 'Security',
    servicePlatform: 'Cisco',
    billingCycle: 'Monthly',
    billingCycleAmount: 35000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Postpaid',
    serviceAddress: '258 Security Road',
    addressState: 'Calabar',
    addressCity: 'Calabar',
    addressLocalGovernment: 'Calabar Municipal',
    serialNumber: 'SN222333444',
    macAddress: '00:1B:44:11:3A:C2',
    coreDevice: 'Cisco Firewall',
    coreInterface: 'GigabitEthernet0/0',
    networkPlatform: 'Cisco IOS',
    wanIpAddress: '192.168.1.108',
    price: 35000,
    createdAt: '2024-01-23T18:00:00Z',
    updatedAt: '2024-01-23T18:00:00Z',
  },
  {
    id: 13,
    customerId: 9,
    serviceCode: 'AI-001',
    description: 'AI model hosting service',
    status: 'active',
    bandwidth: '1 Gbps',
    serviceType: 'AI',
    servicePlatform: 'Custom',
    billingCycle: 'Monthly',
    billingCycleAmount: 150000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '369 AI Avenue',
    addressState: 'Jos',
    addressCity: 'Jos',
    addressLocalGovernment: 'Jos North',
    serialNumber: 'SN555666777',
    macAddress: '00:1B:44:11:3A:C3',
    coreDevice: 'AI Server',
    coreInterface: 'Ethernet',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.109',
    price: 150000,
    createdAt: '2024-01-23T18:00:00Z',
    updatedAt: '2024-01-23T18:00:00Z',
  },
  {
    id: 14,
    customerId: 10,
    serviceCode: 'BLOCK-001',
    description: 'Blockchain node hosting',
    status: 'active',
    bandwidth: '500 Mbps',
    serviceType: 'Blockchain',
    servicePlatform: 'Ethereum',
    billingCycle: 'Monthly',
    billingCycleAmount: 90000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Postpaid',
    serviceAddress: '741 Blockchain Way',
    addressState: 'Benin City',
    addressCity: 'Benin City',
    addressLocalGovernment: 'Oredo',
    serialNumber: 'SN888999000',
    macAddress: '00:1B:44:11:3A:C4',
    coreDevice: 'Blockchain Node',
    coreInterface: 'Ethernet',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.110',
    price: 90000,
    createdAt: '2024-01-24T19:00:00Z',
    updatedAt: '2024-01-24T19:00:00Z',
  },
  {
    id: 15,
    customerId: 11,
    serviceCode: 'IOT-001',
    description: 'IoT device management platform',
    status: 'active',
    bandwidth: '200 Mbps',
    serviceType: 'IoT',
    servicePlatform: 'Custom',
    billingCycle: 'Monthly',
    billingCycleAmount: 65000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Prepaid',
    serviceAddress: '852 IoT Street',
    addressState: 'Abeokuta',
    addressCity: 'Abeokuta',
    addressLocalGovernment: 'Abeokuta North',
    serialNumber: 'SN111222333',
    macAddress: '00:1B:44:11:3A:C5',
    coreDevice: 'IoT Gateway',
    coreInterface: 'Ethernet',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.111',
    price: 65000,
    createdAt: '2024-01-25T20:00:00Z',
    updatedAt: '2024-01-25T20:00:00Z',
  },
  {
    id: 16,
    customerId: 12,
    serviceCode: 'VR-001',
    description: 'VR content hosting service',
    status: 'active',
    bandwidth: '2 Gbps',
    serviceType: 'VR',
    servicePlatform: 'Custom',
    billingCycle: 'Monthly',
    billingCycleAmount: 180000,
    cycleStartDate: '2024-01-01',
    cycleEndDate: '2024-01-31',
    billingMode: 'Postpaid',
    serviceAddress: '963 VR Boulevard',
    addressState: 'Sokoto',
    addressCity: 'Sokoto',
    addressLocalGovernment: 'Sokoto North',
    serialNumber: 'SN444555666',
    macAddress: '00:1B:44:11:3A:C6',
    coreDevice: 'VR Server',
    coreInterface: 'Ethernet',
    networkPlatform: 'Linux',
    wanIpAddress: '192.168.1.112',
    price: 180000,
    createdAt: '2024-01-26T21:00:00Z',
    updatedAt: '2024-01-26T21:00:00Z',
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

    const totalRevenue = mockServices.reduce((sum, service) => sum + service.price, 0)

    return {
      totalCustomers: mockCustomers.length,
      totalServices: mockServices.length,
      totalRevenue,
      pendingServices: mockServices.filter((s) => s.status === 'active').length,
      completedServices: mockServices.filter((s) => s.status === 'active').length,
      paidServices: mockServices.length,
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

  // Mark service as active
  async markServiceAsActive(id: number): Promise<Service | null> {
    return this.updateService(id, { status: 'active' })
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
