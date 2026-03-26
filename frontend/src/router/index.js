import { createRouter, createWebHistory } from 'vue-router'
import secretaryRoutes from './modules/secretary'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/MainLayout.vue'),
      redirect: '/workbench',
      children: secretaryRoutes,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/case-workbench',
    },
  ],
})

router.beforeEach((to) => {
  document.title = `${to.name} - 广仲仲裁系统.v1`
})

export default router
