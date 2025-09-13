<template>
  <form @submit.prevent="onSubmit" novalidate class="form-col">
    <div class="form-row">
      <label>Full name *</label>
      <input v-model.trim="form.fullName" @blur="t.fullName=true" placeholder="e.g. Alex Chen"/>
      <div v-if="t.fullName && errors.fullName" class="error">{{ errors.fullName }}</div>
    </div>

    <div class="form-row">
      <label>Email *</label>
      <input type="email" v-model.trim="form.email" @blur="t.email=true" placeholder="you@example.com"/>
      <div v-if="t.email && errors.email" class="error">{{ errors.email }}</div>
    </div>

    <div class="form-row">
      <label>Preferred role *</label>
      <select v-model="form.role" @blur="t.role=true">
        <option value="">Select one</option>
        <option>Event Crew</option>
        <option>Peer Support Helper</option>
        <option>Content Assistant</option>
      </select>
      <div v-if="t.role && errors.role" class="error">{{ errors.role }}</div>
    </div>

    <div class="form-row">
      <label>Availability *</label>
      <input v-model.trim="form.availability" @blur="t.availability=true" placeholder="e.g. Weeknights after 6pm"/>
      <div v-if="t.availability && errors.availability" class="error">{{ errors.availability }}</div>
    </div>

    <div class="form-row" style="display:flex;gap:8px;align-items:center">
      <input id="consent" type="checkbox" v-model="form.consent" @blur="t.consent=true" style="width:18px;height:18px"/>
      <label for="consent">I agree to be contacted about volunteering *</label>
    </div>
    <div v-if="t.consent && errors.consent" class="error">{{ errors.consent }}</div>

    <button class="btn" type="submit">Submit</button>
    <div v-if="submitted" class="small" style="color:#14532d;margin-top:10px">Thanks! Saved locally.</div>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

const submissions = useLocalStorage('volunteer_submissions', [])

const form = reactive({ fullName:'', email:'', role:'', availability:'', consent:false })
const t = reactive({ fullName:false, email:false, role:false, availability:false, consent:false })
const submitted = ref(false)
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

const errors = computed(()=>({
  fullName: !form.fullName ? 'Name is required' : (form.fullName.length<2?'Name must be at least 2 characters':''),
  email: !form.email ? 'Email is required' : (!emailRe.test(form.email) ? 'Enter a valid email' : ''),
  role: !form.role ? 'Please select a role' : '',
  availability: !form.availability ? 'Please add availability' : '',
  consent: !form.consent ? 'You must agree to be contacted' : ''
}))

function onSubmit(){
  Object.keys(t).forEach(k=>t[k]=true)
  if (Object.values(errors.value).some(Boolean)) return
  submissions.value.push({ ...form, submittedAt:new Date().toISOString() })
  submitted.value = true
  form.fullName=''; form.email=''; form.role=''; form.availability=''; form.consent=false
  setTimeout(()=>submitted.value=false, 2000)
}
</script>

<style scoped>
.form-col{display:grid;gap:12px}
</style>
