<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { mockUserApi } from '@/services/userApi'
import type { User, Role, UserRole } from '@/types/user'
import BackButton from '@/components/BackButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const activeTab = ref<'users' | 'roles'>('users')
const loading = ref(true)
const error = ref<string | null>(null)

// Data
const users = ref<User[]>([])
const roles = ref<Role[]>([])
const selectedUser = ref<User | null>(null)
const selectedRole = ref<Role | null>(null)
const userRoles = ref<UserRole[]>([])
const roleUsers = ref<UserRole[]>([])
const availableUsers = ref<User[]>([])
const availableRoles = ref<Role[]>([])

// UI state
const showAddUserModal = ref(false)
const showAddRoleModal = ref(false)
const showRemoveUserModal = ref(false)
const showRemoveRoleModal = ref(false)
const removing = ref(false)

const loadData = async () => {
  try {
    loading.value = true
    error.value = null

    const [usersData, rolesData] = await Promise.all([
      mockUserApi.getUsers(),
      mockUserApi.getRoles(),
    ])

    users.value = usersData
    roles.value = rolesData
  } catch (err) {
    error.value = 'Failed to load data'
    console.error('Error loading data:', err)
  } finally {
    loading.value = false
  }
}

const selectUser = async (user: User) => {
  selectedUser.value = user
  try {
    const [userRolesData, availableRolesData] = await Promise.all([
      mockUserApi.getUserRoles(user.id),
      mockUserApi.getAvailableRolesForUser(user.id),
    ])
    userRoles.value = userRolesData
    availableRoles.value = availableRolesData
  } catch (err) {
    console.error('Error loading user roles:', err)
  }
}

const selectRole = async (role: Role) => {
  selectedRole.value = role
  try {
    const [roleUsersData, availableUsersData] = await Promise.all([
      mockUserApi.getRoleUsers(role.id),
      mockUserApi.getAvailableUsersForRole(role.id),
    ])
    roleUsers.value = roleUsersData
    availableUsers.value = availableUsersData
  } catch (err) {
    console.error('Error loading role users:', err)
  }
}

const addUserToRole = async (userId: number, roleId: number) => {
  try {
    await mockUserApi.addUserToRole({ userId, roleId })

    // Refresh data
    if (selectedUser.value) {
      await selectUser(selectedUser.value)
    }
    if (selectedRole.value) {
      await selectRole(selectedRole.value)
    }

    showAddUserModal.value = false
    showAddRoleModal.value = false
  } catch (err) {
    console.error('Error adding user to role:', err)
  }
}

const removeUserFromRole = async (userId: number, roleId: number) => {
  try {
    removing.value = true
    await mockUserApi.removeUserFromRole({ userId, roleId })

    // Refresh data
    if (selectedUser.value) {
      await selectUser(selectedUser.value)
    }
    if (selectedRole.value) {
      await selectRole(selectedRole.value)
    }

    showRemoveUserModal.value = false
    showRemoveRoleModal.value = false
  } catch (err) {
    console.error('Error removing user from role:', err)
  } finally {
    removing.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <BackButton />
      <div>
        <h1 class="text-2xl font-bold text-gray-900">User Role Management</h1>
        <p class="text-gray-600">Manage user roles and permissions</p>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <p class="text-red-800">{{ error }}</p>
      <button @click="loadData" class="mt-2 text-red-600 hover:text-red-800 underline">
        Try again
      </button>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'users'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'users'
                ? 'border-custom-red-500 text-custom-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Manage Users
          </button>
          <button
            @click="activeTab = 'roles'"
            :class="[
              'py-2 px-1 border-b-2 font-medium text-sm',
              activeTab === 'roles'
                ? 'border-custom-red-500 text-custom-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            Manage Roles
          </button>
        </nav>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Users List -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Users</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <button
                v-for="user in users"
                :key="user.id"
                @click="selectUser(user)"
                :class="[
                  'w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors',
                  selectedUser?.id === user.id
                    ? 'bg-custom-red-50 border-r-2 border-custom-red-500'
                    : '',
                ]"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ user.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div v-if="selectedUser" class="lg:col-span-2 space-y-6">
          <!-- User Info -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">
                  {{ selectedUser.firstName }} {{ selectedUser.lastName }}
                </h3>
                <button
                  @click="showAddRoleModal = true"
                  class="bg-custom-red-600 text-white px-4 py-2 rounded-lg hover:bg-custom-red-700 transition-colors"
                >
                  Add Role
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Username</label>
                  <p class="text-gray-900">{{ selectedUser.username }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <p class="text-gray-900">{{ selectedUser.email }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Status</label>
                  <span
                    :class="[
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      selectedUser.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ selectedUser.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Created</label>
                  <p class="text-gray-900">{{ formatDate(selectedUser.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- User Roles -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Assigned Roles</h3>
            </div>
            <div v-if="userRoles.length === 0" class="p-6 text-center text-gray-500">
              <p>No roles assigned to this user.</p>
            </div>
            <div v-else class="divide-y divide-gray-200">
              <div
                v-for="userRole in userRoles"
                :key="userRole.id"
                class="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ userRole.role.name }}</p>
                  <p class="text-sm text-gray-500">{{ userRole.role.description }}</p>
                  <p class="text-xs text-gray-400">
                    Assigned: {{ formatDate(userRole.assignedAt) }}
                  </p>
                </div>
                <button
                  @click="showRemoveRoleModal = true"
                  class="text-red-600 hover:text-red-900 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Roles Tab -->
      <div v-if="activeTab === 'roles'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Roles List -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Roles</h3>
            </div>
            <div class="divide-y divide-gray-200">
              <button
                v-for="role in roles"
                :key="role.id"
                @click="selectRole(role)"
                :class="[
                  'w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors',
                  selectedRole?.id === role.id
                    ? 'bg-custom-red-50 border-r-2 border-custom-red-500'
                    : '',
                ]"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ role.name }}</p>
                  <p class="text-sm text-gray-500">{{ role.description }}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Role Details -->
        <div v-if="selectedRole" class="lg:col-span-2 space-y-6">
          <!-- Role Info -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">{{ selectedRole.name }}</h3>
                <button
                  @click="showAddUserModal = true"
                  class="bg-custom-red-600 text-white px-4 py-2 rounded-lg hover:bg-custom-red-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Description</label>
                  <p class="text-gray-900">{{ selectedRole.description }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Permissions</label>
                  <div class="flex flex-wrap gap-2 mt-1">
                    <span
                      v-for="permission in selectedRole.permissions"
                      :key="permission"
                      class="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {{ permission }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Role Users -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Assigned Users</h3>
            </div>
            <div v-if="roleUsers.length === 0" class="p-6 text-center text-gray-500">
              <p>No users assigned to this role.</p>
            </div>
            <div v-else class="divide-y divide-gray-200">
              <div
                v-for="roleUser in roleUsers"
                :key="roleUser.id"
                class="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ roleUser.user.firstName }} {{ roleUser.user.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">{{ roleUser.user.email }}</p>
                  <p class="text-xs text-gray-400">
                    Assigned: {{ formatDate(roleUser.assignedAt) }}
                  </p>
                </div>
                <button
                  @click="showRemoveUserModal = true"
                  class="text-red-600 hover:text-red-900 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add User to Role Modal -->
    <div
      v-if="showAddUserModal && selectedRole"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Add User to {{ selectedRole.name }}</h3>
        <div v-if="availableUsers.length === 0" class="text-center text-gray-500 py-4">
          <p>No available users to add to this role.</p>
        </div>
        <div v-else class="space-y-2 max-h-60 overflow-y-auto">
          <button
            v-for="user in availableUsers"
            :key="user.id"
            @click="addUserToRole(user.id, selectedRole.id)"
            class="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <p class="text-sm font-medium text-gray-900">
              {{ user.firstName }} {{ user.lastName }}
            </p>
            <p class="text-sm text-gray-500">{{ user.email }}</p>
          </button>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="showAddUserModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Add Role to User Modal -->
    <div
      v-if="showAddRoleModal && selectedUser"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          Add Role to {{ selectedUser.firstName }} {{ selectedUser.lastName }}
        </h3>
        <div v-if="availableRoles.length === 0" class="text-center text-gray-500 py-4">
          <p>No available roles to add to this user.</p>
        </div>
        <div v-else class="space-y-2 max-h-60 overflow-y-auto">
          <button
            v-for="role in availableRoles"
            :key="role.id"
            @click="addUserToRole(selectedUser.id, role.id)"
            class="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <p class="text-sm font-medium text-gray-900">{{ role.name }}</p>
            <p class="text-sm text-gray-500">{{ role.description }}</p>
          </button>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="showAddRoleModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Remove User from Role Modal -->
    <div
      v-if="showRemoveUserModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Remove User from Role</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to remove this user from the role? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showRemoveUserModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            :disabled="removing"
          >
            Cancel
          </button>
          <button
            @click="removeUserFromRole(1, 1)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            :disabled="removing"
          >
            <span v-if="removing">Removing...</span>
            <span v-else>Remove</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Role from User Modal -->
    <div
      v-if="showRemoveRoleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Remove Role from User</h3>
        <p class="text-gray-600 mb-6">
          Are you sure you want to remove this role from the user? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            @click="showRemoveRoleModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
            :disabled="removing"
          >
            Cancel
          </button>
          <button
            @click="removeUserFromRole(1, 1)"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            :disabled="removing"
          >
            <span v-if="removing">Removing...</span>
            <span v-else>Remove</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
