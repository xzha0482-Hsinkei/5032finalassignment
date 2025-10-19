import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated, hasRole, useCurrentUser } from '../composables/useAuth'

const Home        = () => import('../pages/HomePlaceholder.vue')
const Programs    = () => import('../pages/Programs.vue')
const Learn       = () => import('../pages/Learn.vue')
const GetInvolved = () => import('../pages/GetInvolved.vue')
const Login       = () => import('../pages/Login.vue')
const Register    = () => import('../pages/Register.vue')
const Admin       = () => import('../pages/Admin.vue')

// ✅ 新增地图组件
const MapView     = () => import('../components/MapView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',              name: 'home',         component: Home,        meta: { title: 'Home' } },
    { path: '/programs',      name: 'programs',     component: Programs,    meta: { title: 'Programs' } },
    { path: '/learn',         name: 'learn',        component: Learn,       meta: { title: 'Learn' } },
    { path: '/get-involved',  name: 'get-involved', component: GetInvolved, meta: { title: 'Get Involved' } },
    { path: '/login',         name: 'login',        component: Login,       meta: { title: 'Login' } },
    { path: '/register',      name: 'register',     component: Register,    meta: { title: 'Register' } },

    // ✅ 新增地图路由
    { path: '/map',           name: 'map',          component: MapView,     meta: { title: 'Map & Route Planner' } },

    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { title: 'Admin', requiresAuth: true, requiresAdmin: true }
    },

    // fallback 重定向
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior () { return { top: 0 } }
})

// ✅ 设置动态标题
router.afterEach((to) => {
  const base = 'Men’s Health NFP'
  const t = to.meta?.title ? `${base} – ${to.meta.title}` : base
  if (typeof document !== 'undefined') document.title = t
})

// ✅ 修复登录角色跳转与管理员显示问题
router.beforeEach((to, from, next) => {
  const user = useCurrentUser().value

  // 🔒 需要登录的页面：未登录 -> 跳回首页
  if (to.meta?.requiresAuth && !isAuthenticated.value) {
    return next({ name: 'home' })
  }

  // 🔐 管理员访问控制
  if (to.meta?.requiresAdmin) {
    const ok = hasRole(['admin'])
    if (!ok?.value) return next({ name: 'home' })
  }

  // 🚀 登录后访问 login/register -> 自动跳转
  if (['login', 'register'].includes(to.name) && user) {
    if (user.role === 'admin') return next({ name: 'admin' })
    return next({ name: 'home' })
  }

  next()
})

export default router
