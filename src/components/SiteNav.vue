<!-- src/components/SiteNav.vue -->
<template>
  <nav class="site-nav">
    <div class="container nav-inner">
      <!-- 左侧品牌 -->
      <router-link to="/" class="brand" aria-label="Home">
        Men’s Health NFP
      </router-link>

      <!-- 右侧链接 -->
      <div class="links">
        <router-link to="/programs">Programs</router-link>
        <router-link to="/learn">Learn</router-link>
        <router-link to="/get-involved">Get Involved</router-link>

        <!-- 仅管理员显示 -->
        <router-link v-if="adminOk" to="/admin">Admin</router-link>

        <!-- 认证区：未登录显示 login/register；已登录显示邮箱与退出 -->
        <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
        <router-link v-if="!isAuthenticated" to="/register">Register</router-link>

        <div v-else class="account">
          <span class="small" style="color:#334155">{{ user?.email }}</span>
          <button class="btn btn-ghost" @click="onLogout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { isAuthenticated, hasRole, logout, useCurrentUser } from '@/composables/useAuth'

const router   = useRouter()
const adminOk  = hasRole(['admin'])     
const user     = useCurrentUser()       

function onLogout () {
  logout()
  router.push('/')                      
}
</script>

<style scoped>
.brand { font-weight: 700; }
.account { display: inline-flex; align-items: center; gap: 8px; }
</style>
