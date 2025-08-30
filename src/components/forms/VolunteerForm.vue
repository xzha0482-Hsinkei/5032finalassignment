<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="mb-3">
      <label class="form-label">Full name *</label>
      <input class="form-control" v-model.trim="form.fullName" @blur="t.fullName=true" placeholder="e.g. Alex Chen">
      <div v-if="t.fullName && errors.fullName" class="error">{{ errors.fullName }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Email *</label>
      <input type="email" class="form-control" v-model.trim="form.email" @blur="t.email=true" placeholder="you@example.com">
      <div v-if="t.email && errors.email" class="error">{{ errors.email }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Preferred role *</label>
      <select class="form-select" v-model="form.role" @blur="t.role=true">
        <option value="">Select one</option>
        <option>Event Crew</option>
        <option>Peer Support Helper</option>
        <option>Content Assistant</option>
      </select>
      <div v-if="t.role && errors.role" class="error">{{ errors.role }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Availability *</label>
      <input class="form-control" v-model.trim="form.availability" @blur="t.availability=true" placeholder="e.g. Weeknights after 6pm">
      <div v-if="t.availability && errors.availability" class="error">{{ errors.availability }}</div>
    </div>

    <div class="form-check mb-2">
      <input id="consent" type="checkbox" class="form-check-input" v-model="form.consent" @blur="t.consent=true">
      <label for="consent" class="form-check-label">I agree to be contacted about volunteering *</label>
    </div>
    <div v-if="t.consent && errors.consent" class="error">{{ errors.consent }}</div>

    <button class="btn btn-primary" type="submit">Submit</button>
    <div v-if="submitted" class="small text-success mt-2">Thanks! Saved locally.</div>
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
  setTimeout(()=>submitted.value=false, 1800)
}
</script>
