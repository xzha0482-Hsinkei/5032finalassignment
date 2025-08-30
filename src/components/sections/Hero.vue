<template>
  <section class="hero">
    <div class="container">
      <div class="row g-4 align-items-start">
        <div class="col-md-7">
          <h1>{{ title }}</h1>
          <p class="small text-light-50">{{ subtitle }}</p>
          <slot name="lead"></slot>
        </div>
        <div class="col-md-5">
          <div class="card p-3">
            <slot name="side-panel"></slot>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
defineProps({ title: String, subtitle: { type: String, default: '' } })
</script>
