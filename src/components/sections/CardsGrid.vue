<template>
  <section class="two-col">
    <div class="container">
      <h2 v-if="title" style="margin:0 0 12px">{{ title }}</h2>
      <div class="grid grid-2">
        <article v-for="(it,i) in items" :key="i" class="card">
          <h3 style="margin:0">{{ it.title }}</h3>
          <p class="small" style="color:var(--muted)">{{ it.excerpt }}</p>

          <div v-if="it.meta" class="small" style="margin:.5rem 0 0">
            <div v-for="(m,idx) in toArray(it.meta)" :key="idx">• {{ m }}</div>
          </div>

          <div v-if="it.tags?.length" style="margin-top:8px">
            <span v-for="t in it.tags" :key="t" class="tag">{{ t }}</span>
          </div>

          <dl v-if="it.details" class="small" style="margin-top:8px">
            <div><strong>Audience:</strong> {{ it.details.audience }}</div>
            <div><strong>Duration:</strong> {{ it.details.duration }}</div>
            <div><strong>Location:</strong> {{ it.details.location }}</div>
            <div><strong>Partners:</strong> {{ (it.details.partners||[]).join(', ') }}</div>
          </dl>

          <div style="margin-top:12px" v-if="it.cta">
            <a :href="it.cta.href" class="btn">{{ it.cta.label }}</a>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: String,
  items: { type: Array, default: () => [] }
})
function toArray(v){ return Array.isArray(v) ? v : (v ? [v] : []) }
</script>
