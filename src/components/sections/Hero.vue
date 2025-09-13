<template>
  <section class="hero">
    <div class="container hero-wrap">
      <div>
        <h1>{{ title }}</h1>
        <p class="small" style="color:#e6f2f8">{{ subtitle }}</p>
        <div style="margin-top:16px"><slot name="lead"></slot></div>
      </div>
      <div class="card">
        <slot name="side-panel"><!-- 默认空：放 FormCard 或 SearchCard --></slot>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>
