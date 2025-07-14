export interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address: string
  createdAt: string
  updatedAt: string
}

export interface Service {
  id: number
  customerId: number
  name: string
  description: string
  price: number
  status: 'pending' | 'completed' | 'cancelled'
  isPaid: boolean
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
