<template>
  <form @submit.prevent="onSubmit" novalidate>
    <div class="form-floating mb-3">
      <input class="form-control" id="fullName" placeholder=" " v-model.trim="form.fullName" @blur="t.fullName=true">
      <label for="fullName">Full name *</label>
      <div v-if="t.fullName && errors.fullName" class="error mt-1">{{ errors.fullName }}</div>
    </div>

    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="email" placeholder=" " v-model.trim="form.email" @blur="t.email=true">
      <label for="email">Email *</label>
      <div v-if="t.email && errors.email" class="error mt-1">{{ errors.email }}</div>
    </div>

    <div class="form-floating mb-3">
      <select class="form-select" id="role" v-model="form.role" @blur="t.role=true">
        <option value=""></option>
        <option>Event Crew</option>
        <option>Peer Support Helper</option>
        <option>Content Assistant</option>
      </select>
      <label for="role">Preferred role *</label>
      <div v-if="t.role && errors.role" class="error mt-1">{{ errors.role }}</div>
    </div>

    <div class="form-floating mb-3">
      <input class="form-control" id="availability" placeholder=" " v-model.trim="form.availability" @blur="t.availability=true">
      <label for="availability">Availability *</label>
      <div v-if="t.availability && errors.availability" class="error mt-1">{{ errors.availability }}</div>
    </div>

    <div class="form-check mb-3">
      <input id="consent" type="checkbox" class="form-check-input" v-model="form.consent" @blur="t.consent=true">
      <label for="consent" class="form-check-label">I agree to be contacted *</label>
      <div v-if="t.consent && errors.consent" class="error mt-1">{{ errors.consent }}</div>
    </div>

    <button class="btn btn-gradient" type="submit">Submit</button>
    <div v-if="submitted" class="small text-success mt-2">Thanks! Saved locally.</div>
  </form>
</template>

<script setup>
/* ——保持你原本的 <script setup> 验证逻辑不变—— */
</script>
