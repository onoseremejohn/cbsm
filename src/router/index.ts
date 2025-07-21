import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'customers',
          name: 'customers',
          component: () => import('../views/CustomersView.vue'),
        },
        {
          path: 'customers/:id',
          name: 'customer-detail',
          component: () => import('../views/CustomerDetailView.vue'),
        },
        {
          path: 'customers/:id/edit',
          name: 'edit-customer',
          component: () => import('../views/EditCustomerView.vue'),
        },
        {
          path: 'customers/:customerId/services/add',
          name: 'add-service',
          component: () => import('../views/AddServiceView.vue'),
        },
        {
          path: 'customers/:customerId/services/:serviceId/edit',
          name: 'edit-service',
          component: () => import('../views/EditServiceView.vue'),
        },
        {
          path: 'user-roles',
          name: 'user-roles',
          component: () => import('../views/UserRoleManagementView.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
