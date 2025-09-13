<template>
  <section class="section">
    <div class="container" style="max-width:560px">
      <h1 class="h1">Create an account</h1>
      <div class="card" style="padding:16px">
        <form @submit.prevent="onSubmit" novalidate style="display:grid;gap:12px">
          <div>
            <label>Email</label>
            <input v-model.trim="email" type="email" required autocomplete="username" maxlength="120" />
          </div>
          <div>
            <label>Role</label>
            <select v-model="role" required>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label>Password</label>
            <input v-model="password" type="password" required minlength="8" maxlength="64" autocomplete="new-password" />
          </div>
          <div>
            <label>Confirm password</label>
            <input v-model="confirm" type="password" required minlength="8" maxlength="64" autocomplete="new-password" />
          </div>
          <button class="btn btn-primary" type="submit" :disabled="busy">Create account</button>
          <p v-if="msg" class="small" style="color:#b91c1c">{{ msg }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/composables/useAuth'

const email = ref(''); const role = ref('user'); const password = ref(''); const confirm = ref('')
const msg = ref(''); const busy = ref(false); const router = useRouter()

async function onSubmit(){
  msg.value='';
  if (password.value !== confirm.value){ msg.value='Passwords do not match'; return }
  busy.value=true
  try{
    await register({ email: email.value, password: password.value, role: role.value })
    router.push('/login')
  }catch(e){ msg.value = e.message || 'Registration failed' }
  finally{ busy.value=false }
}
</script>
