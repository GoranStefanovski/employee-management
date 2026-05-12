import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'employees',
      component: () => import('@/views/EmployeeIndexView.vue'),
    },
    {
      path: '/employees/new',
      name: 'employee-create',
      component: () => import('@/views/CreateEmployeeView.vue'),
    },
  ],
})

export default router
