import axios from 'axios'
import type {
  User,
  Role,
  UserRole,
  CreateUserRoleRequest,
  RemoveUserRoleRequest,
} from '@/types/user'

const API_BASE_URL = '/api'

export const userApi = {
  // Get all users
  async getUsers(): Promise<User[]> {
    const response = await axios.get(`${API_BASE_URL}/users`)
    return response.data
  },

  // Get user by ID
  async getUser(id: number): Promise<User | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/${id}`)
      return response.data
    } catch (error) {
      return null
    }
  },

  // Get all roles
  async getRoles(): Promise<Role[]> {
    const response = await axios.get(`${API_BASE_URL}/roles`)
    return response.data
  },

  // Get role by ID
  async getRole(id: number): Promise<Role | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/roles/${id}`)
      return response.data
    } catch (error) {
      return null
    }
  },

  // Get user roles
  async getUserRoles(userId: number): Promise<UserRole[]> {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/roles`)
    return response.data
  },

  // Get role users
  async getRoleUsers(roleId: number): Promise<UserRole[]> {
    const response = await axios.get(`${API_BASE_URL}/roles/${roleId}/users`)
    return response.data
  },

  // Add user to role
  async addUserToRole(data: CreateUserRoleRequest): Promise<UserRole> {
    const response = await axios.post(`${API_BASE_URL}/user-roles`, data)
    return response.data
  },

  // Remove user from role
  async removeUserFromRole(data: RemoveUserRoleRequest): Promise<void> {
    await axios.delete(`${API_BASE_URL}/user-roles`, { data })
  },

  // Get available users for role (users not already assigned)
  async getAvailableUsersForRole(roleId: number): Promise<User[]> {
    const response = await axios.get(`${API_BASE_URL}/roles/${roleId}/available-users`)
    return response.data
  },

  // Get available roles for user (roles not already assigned)
  async getAvailableRolesForUser(userId: number): Promise<Role[]> {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/available-roles`)
    return response.data
  },
}

// Mock data for development
export const mockUserApi = {
  async getUsers(): Promise<User[]> {
    return [
      {
        id: 1,
        username: 'john.doe',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
      },
      {
        id: 2,
        username: 'jane.smith',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        isActive: true,
        createdAt: '2024-01-16T11:00:00Z',
        updatedAt: '2024-01-16T11:00:00Z',
      },
      {
        id: 3,
        username: 'mike.johnson',
        email: 'mike.johnson@example.com',
        firstName: 'Mike',
        lastName: 'Johnson',
        isActive: false,
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-17T12:00:00Z',
      },
    ]
  },

  async getRoles(): Promise<Role[]> {
    return [
      {
        id: 1,
        name: 'Admin',
        description: 'Full system access',
        permissions: ['read', 'write', 'delete', 'admin'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 2,
        name: 'Manager',
        description: 'Manage customers and services',
        permissions: ['read', 'write'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 3,
        name: 'Viewer',
        description: 'Read-only access',
        permissions: ['read'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      },
    ]
  },

  async getUserRoles(userId: number): Promise<UserRole[]> {
    const users = await this.getUsers()
    const roles = await this.getRoles()

    // Mock assignments
    const assignments: UserRole[] = []

    if (userId === 1) {
      assignments.push({
        id: 1,
        userId: 1,
        roleId: 1,
        assignedAt: '2024-01-15T10:00:00Z',
        assignedBy: 1,
        user: users[0],
        role: roles[0],
      })
    }

    if (userId === 2) {
      assignments.push({
        id: 2,
        userId: 2,
        roleId: 2,
        assignedAt: '2024-01-16T11:00:00Z',
        assignedBy: 1,
        user: users[1],
        role: roles[1],
      })
    }

    return assignments
  },

  async getRoleUsers(roleId: number): Promise<UserRole[]> {
    const users = await this.getUsers()
    const roles = await this.getRoles()

    // Mock assignments
    const assignments: UserRole[] = []

    if (roleId === 1) {
      assignments.push({
        id: 1,
        userId: 1,
        roleId: 1,
        assignedAt: '2024-01-15T10:00:00Z',
        assignedBy: 1,
        user: users[0],
        role: roles[0],
      })
    }

    if (roleId === 2) {
      assignments.push({
        id: 2,
        userId: 2,
        roleId: 2,
        assignedAt: '2024-01-16T11:00:00Z',
        assignedBy: 1,
        user: users[1],
        role: roles[1],
      })
    }

    return assignments
  },

  async addUserToRole(data: CreateUserRoleRequest): Promise<UserRole> {
    const users = await this.getUsers()
    const roles = await this.getRoles()

    const user = users.find((u) => u.id === data.userId)
    const role = roles.find((r) => r.id === data.roleId)

    if (!user || !role) {
      throw new Error('User or role not found')
    }

    return {
      id: Math.random(),
      userId: data.userId,
      roleId: data.roleId,
      assignedAt: new Date().toISOString(),
      assignedBy: 1,
      user,
      role,
    }
  },

  async removeUserFromRole(data: RemoveUserRoleRequest): Promise<void> {
    // Mock implementation
    console.log('Removing user from role:', data)
  },

  async getAvailableUsersForRole(roleId: number): Promise<User[]> {
    const allUsers = await this.getUsers()
    const assignedUsers = await this.getRoleUsers(roleId)
    const assignedUserIds = assignedUsers.map((ur) => ur.userId)

    return allUsers.filter((user) => !assignedUserIds.includes(user.id))
  },

  async getAvailableRolesForUser(userId: number): Promise<Role[]> {
    const allRoles = await this.getRoles()
    const assignedRoles = await this.getUserRoles(userId)
    const assignedRoleIds = assignedRoles.map((ur) => ur.roleId)

    return allRoles.filter((role) => !assignedRoleIds.includes(role.id))
  },
}
