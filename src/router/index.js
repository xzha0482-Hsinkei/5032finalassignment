import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/HomePlaceholder.vue'), meta: { title: 'Home' } },
    { path: '/programs', name: 'programs', component: () => import('../pages/Programs.vue'), meta: { title: 'Programs' } },
    { path: '/learn', name: 'learn', component: () => import('../pages/Learn.vue'), meta: { title: 'Learn' } },
    { path: '/get-involved', name: 'get-involved', component: () => import('../pages/GetInvolved.vue'), meta: { title: 'Get Involved' } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach(to => {
  document.title = to.meta?.title ? `Men’s Health NFP – ${to.meta.title}` : 'Men’s Health NFP'
})

export default router
