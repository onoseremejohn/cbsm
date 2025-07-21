export interface Customer {
  id: number
  contact_first_name: string
  contact_middle_name: string
  contact_surname: string
  business_name: string
  phone_numbers: string[]
  email_addresses: string[]
  physical_address: string
  state: string
  local_government_area: string
  city: string
}

export interface Service {
  id: number
  customerId: number
  serviceCode: string
  description?: string
  bandwidth?: string
  serviceType?: string
  servicePlatform?: string
  billingCycle?: string
  billingCycleAmount?: number
  cycleStartDate?: string
  cycleEndDate?: string
  billingMode?: string
  serviceAddress?: string
  addressState?: string
  addressCity?: string
  addressLocalGovernment?: string
  serialNumber?: string
  macAddress?: string
  coreDevice?: string
  coreInterface?: string
  networkPlatform?: string
  wanIpAddress?: string
  status: 'active' | 'suspended' | 'cancelled' | 'terminated'
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
}
