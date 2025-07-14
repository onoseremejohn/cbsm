export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Role {
  id: number
  name: string
  description: string
  permissions: string[]
  createdAt: string
  updatedAt: string
}

export interface UserRole {
  id: number
  userId: number
  roleId: number
  assignedAt: string
  assignedBy: number
  user: User
  role: Role
}

export interface CreateUserRoleRequest {
  userId: number
  roleId: number
}

export interface RemoveUserRoleRequest {
  userId: number
  roleId: number
}
