<template>
  <section class="two-col">
    <div class="container grid grid-2">
      <div>
        <h2 style="margin-top:0">{{ title }}</h2>
        <p class="small" style="color:var(--muted)"><slot /></p>
        <div style="margin-top:12px"><slot name="cta"></slot></div>
      </div>
      <div>
        <slot name="media"><div class="card">Media/Image</div></slot>
      </div>
    </div>
  </section>
</template>
<script setup>
defineProps({ title: String })
</script>
