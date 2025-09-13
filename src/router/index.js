
import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, hasRole } from '../composables/useAuth'


const Home          = () => import('../pages/HomePlaceholder.vue')
const Programs      = () => import('../pages/Programs.vue')
const Learn         = () => import('../pages/Learn.vue')
const GetInvolved   = () => import('../pages/GetInvolved.vue')
const Login         = () => import('../pages/Login.vue')
const Register      = () => import('../pages/Register.vue')
const Admin         = () => import('../pages/Admin.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',              name: 'home',         component: Home,        meta: { title: 'Home' } },
    { path: '/programs',      name: 'programs',     component: Programs,    meta: { title: 'Programs' } },
    { path: '/learn',         name: 'learn',        component: Learn,       meta: { title: 'Learn' } },
    { path: '/get-involved',  name: 'get-involved', component: GetInvolved, meta: { title: 'Get Involved' } },
    { path: '/login',         name: 'login',        component: Login,       meta: { title: 'Login' } },
    { path: '/register',      name: 'register',     component: Register,    meta: { title: 'Register' } },

    
    { path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { title: 'Admin', requiresAuth: true, requiresAdmin: true }
    },

    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior () { return { top: 0 } }
})


router.afterEach((to) => {
  const base = 'Men’s Health NFP'
  const t = to.meta?.title ? `${base} – ${to.meta.title}` : base
  if (typeof document !== 'undefined') document.title = t
})


router.beforeEach((to, _from, next) => {
  if (to.meta?.requiresAuth && !isAuthenticated.value) {
    
    return next({ name: 'home' })
  }
  if (to.meta?.requiresAdmin) {
    
    const ok = hasRole(['admin'])
    if (!ok?.value) return next({ name: 'home' })
  }
  next()
})

export default router
