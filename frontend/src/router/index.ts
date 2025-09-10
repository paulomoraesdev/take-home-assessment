import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/contact',
          name: 'contact',
          component: () => import('../views/ContactView.vue'),
          meta: { isModal: true }
        },
        {
          path: '/contact/:id',
          name: 'contact-detail',
          component: () => import('../views/ContactDetailView.vue'),
          meta: { isModal: true }
        }
      ]
    }
  ],
})

export default router
