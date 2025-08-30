<template>
  <section class="hero">
    <div class="container">
      <div class="row g-4 align-items-start">
        <div class="col-md-7">
          <h1 class="display-5 fw-bold mb-2">{{ title }}</h1>
          <p class="small text-light mb-3" style="opacity:.95">{{ subtitle }}</p>
          <slot name="lead"></slot>
        </div>
        <div class="col-md-5">
          <div class="card card-soft card-elevate p-3">
            <slot name="side-panel"></slot>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
defineProps({ title:String, subtitle:{type:String, default:''} })
</script>
