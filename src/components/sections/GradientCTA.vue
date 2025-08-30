<template>
  <section class="gradient-cta">
    <div class="container grid grid-2">
      <div>
        <h2 style="margin-top:0">{{ title }}</h2>
        <p class="small" style="opacity:.95"><slot /></p>
      </div>
      <div>
        <p class="small" style="opacity:.95"><slot name="right" /></p>
        <div style="margin-top:10px" v-if="cta">
          <a :href="cta.href" class="btn">{{ cta.label }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
defineProps({ title:String, cta:Object })
</script>
