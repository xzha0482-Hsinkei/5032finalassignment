<template>
  <div>
    <h5 class="mb-2">{{ title }}</h5>
    <p v-if="desc" class="small text-muted">{{ desc }}</p>
    <slot />
  </div>
</template>
<script setup>
defineProps({ title: String, desc: String })
</script>
