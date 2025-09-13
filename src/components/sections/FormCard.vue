<template>
  <div>
    <h3 style="margin-top:0">{{ title }}</h3>
    <p class="small" v-if="desc">{{ desc }}</p>
    <slot><!-- 放具体表单，如 VolunteerForm --></slot>
  </div>
</template>
<script setup>
defineProps({ title: String, desc: String })
</script>
