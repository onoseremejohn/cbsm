export interface Customer {
  id: number
  contactFirstName: string
  contactMiddleName?: string
  contactSurname: string
  businessName: string
  phoneNumbers: string[]
  emailAddresses: string[]
  physicalAddress: string
  addressState: string
  addressLocalGovernment: string
  addressCity: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: number
  customerId: number
  serviceCode: string
  description: string
  status: 'active' | 'suspended' | 'cancelled' | 'terminated'
  bandwidth: string
  serviceType: string
  servicePlatform: string
  billingCycle: string
  billingCycleAmount: number
  cycleStartDate: string
  cycleEndDate: string
  billingMode: string
  serviceAddress: string
  addressState: string
  addressCity: string
  addressLocalGovernment: string
  serialNumber: string
  macAddress: string
  coreDevice: string
  coreInterface: string
  networkPlatform: string
  wanIpAddress: string
  price: number
  createdAt: string
  updatedAt: string
}

export interface CustomerWithServices extends Customer {
  services: Service[]
}

export interface CustomerStats {
  totalCustomers: number
  totalServices: number
  totalRevenue: number
  pendingServices: number
  completedServices: number
  paidServices: number
}
