<template>
  <section class="section">
    <div class="container" style="max-width:560px">
      <h1 class="h1">Log in</h1>
      <div class="card" style="padding:16px">
        <form @submit.prevent="onSubmit" novalidate style="display:grid;gap:12px">
          <div>
            <label>Email</label>
            <input v-model.trim="email" type="email" required autocomplete="username" maxlength="120" />
          </div>
          <div>
            <label>Password</label>
            <input v-model="password" type="password" required minlength="8" maxlength="64" autocomplete="current-password" />
          </div>
          <button class="btn btn-primary" type="submit" :disabled="busy">Sign in</button>
          <p v-if="msg" class="small" style="color:#b91c1c">{{ msg }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/composables/useAuth'

const route = useRoute(); const router = useRouter()
const email = ref(''); const password = ref(''); const msg = ref(''); const busy = ref(false)

async function onSubmit(){
  msg.value=''; busy.value=true
  try{
    await login(email.value, password.value)
    router.replace(route.query.redirect || '/')
  }catch(e){ msg.value = e.message || 'Login failed' }
  finally{ busy.value=false }
}
</script>
