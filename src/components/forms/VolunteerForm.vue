<template>
  <form 
    @submit.prevent="onSubmit" 
    novalidate 
    class="form-col"
    aria-labelledby="volunteer-form-title"
  >
    <h2 id="volunteer-form-title" class="sr-only">Volunteer Application Form</h2>

    <div class="form-row">
      <label for="fullname">Full name *</label>
      <input 
        id="fullname" 
        v-model.trim="form.fullName" 
        @blur="t.fullName=true" 
        placeholder="e.g. Alex Chen"
        aria-required="true"
      />
      <div v-if="t.fullName && errors.fullName" class="error" role="alert">
        {{ errors.fullName }}
      </div>
    </div>

    <div class="form-row">
      <label for="email">Email *</label>
      <input 
        id="email"
        type="email" 
        v-model.trim="form.email" 
        @blur="t.email=true" 
        placeholder="you@example.com"
        aria-required="true"
      />
      <div v-if="t.email && errors.email" class="error" role="alert">{{ errors.email }}</div>
    </div>

    <div class="form-row">
      <label for="role">Preferred role *</label>
      <select 
        id="role" 
        v-model="form.role" 
        @blur="t.role=true"
        aria-required="true"
      >
        <option value="">Select one</option>
        <option>Event Crew</option>
        <option>Peer Support Helper</option>
        <option>Content Assistant</option>
      </select>
      <div v-if="t.role && errors.role" class="error" role="alert">{{ errors.role }}</div>
    </div>

    <div class="form-row">
      <label for="availability">Availability *</label>
      <input 
        id="availability"
        v-model.trim="form.availability" 
        @blur="t.availability=true" 
        placeholder="e.g. Weeknights after 6pm"
        aria-required="true"
      />
      <div v-if="t.availability && errors.availability" class="error" role="alert">{{ errors.availability }}</div>
    </div>

    <div class="form-row checkbox">
      <input 
        id="consent"
        type="checkbox"
        v-model="form.consent" 
        @blur="t.consent=true"
        aria-required="true"
      />
      <label for="consent">I agree to be contacted about volunteering *</label>
    </div>
    <div v-if="t.consent && errors.consent" class="error" role="alert">{{ errors.consent }}</div>

    <button class="btn" type="submit" :disabled="loading">
      {{ loading ? "Sending..." : "Submit" }}
    </button>

    <div v-if="successMsg" class="small success" role="status">{{ successMsg }}</div>
    <div v-if="errorMsg" class="small error" role="alert">{{ errorMsg }}</div>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { db } from '@/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const submissions = useLocalStorage('volunteer_submissions', [])

const form = reactive({ fullName:'', email:'', role:'', availability:'', consent:false })
const t = reactive({ fullName:false, email:false, role:false, availability:false, consent:false })
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

const errors = computed(() => ({
  fullName: !form.fullName ? 'Name is required' : (form.fullName.length<2?'Name must be at least 2 characters':''),
  email: !form.email ? 'Email is required' : (!emailRe.test(form.email) ? 'Enter a valid email' : ''),
  role: !form.role ? 'Please select a role' : '',
  availability: !form.availability ? 'Please add availability' : '',
  consent: !form.consent ? 'You must agree to be contacted' : ''
}))

async function onSubmit() {
  Object.keys(t).forEach(k => t[k] = true)
  if (Object.values(errors.value).some(Boolean)) return

  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''

  // ✅ 本地备份
  submissions.value.push({ ...form, submittedAt: new Date().toISOString() })

  try {
    // ✅ 发邮件（原逻辑保留）
    const res = await fetch("https://us-central1-finalassignment-a39fa.cloudfunctions.net/sendMail1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.fullName,
        email: form.email,
        role: form.role,
        availability: form.availability
      }),
    })
    const data = await res.json()
    if (data.success) {
      successMsg.value = "✅ Volunteer message sent successfully!"
    } else {
      errorMsg.value = "⚠️ Failed to send email: " + (data.error || "Unknown error")
    }

    // ✅ Firestore 自动写入（正确集合名）
    console.log('📤 Writing to Firestore:', form)
    await addDoc(collection(db, '5032Finalassignment'), {
      fullName: form.fullName,
      email: form.email,
      role: form.role,
      availability: form.availability,
      consent: form.consent,
      submittedAt: serverTimestamp(),
    })
    console.log('✅ Firestore write completed')

  } catch (err) {
    console.error('❌ Error:', err)
    errorMsg.value = "❌ Network or Firestore error: " + err.message
  } finally {
    loading.value = false
    setTimeout(() => { successMsg.value = ''; errorMsg.value = '' }, 4000)
  }

  // ✅ 清空表单
  Object.keys(form).forEach(k => form[k] = (typeof form[k] === 'boolean' ? false : ''))
}
</script>

<style scoped>
.form-col { display: grid; gap: 12px; }
.error { color: #b91c1c; font-size: 0.9em; }
.btn[disabled] { opacity: 0.6; pointer-events: none; }
.success { color: #14532d; }
.checkbox { display:flex; align-items:center; gap:8px; }
</style>
