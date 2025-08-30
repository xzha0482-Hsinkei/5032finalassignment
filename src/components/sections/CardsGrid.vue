<template>
  <section class="py-4">
    <div class="container">
      <h2 v-if="title" class="h4 mb-3 section-title">{{ title }}</h2>

      <div class="row row-cols-1 row-cols-md-2 g-4">
        <article v-for="(it,i) in items" :key="i" class="col">
          <div class="card card-soft card-elevate h-100 p-3">
            <h5 class="mb-1">{{ it.title }}</h5>
            <p class="text-muted mb-2" v-if="it.excerpt">{{ it.excerpt }}</p>

            <div v-if="it.meta" class="small text-muted">
              <div v-for="(m,idx) in toArray(it.meta)" :key="idx">• {{ m }}</div>
            </div>

            <div v-if="it.tags?.length" class="mt-2">
              <span v-for="t in it.tags" :key="t" class="badge rounded-pill text-bg-light border me-1">{{ t }}</span>
            </div>

            <dl v-if="it.details" class="row small mt-2">
              <div class="col-6"><strong>Audience:</strong> {{ it.details.audience }}</div>
              <div class="col-6"><strong>Duration:</strong> {{ it.details.duration }}</div>
              <div class="col-6"><strong>Location:</strong> {{ it.details.location }}</div>
              <div class="col-6"><strong>Partners:</strong> {{ (it.details.partners||[]).join(', ') }}</div>
            </dl>

            <div class="mt-2" v-if="it.cta">
              <a :href="it.cta.href" class="btn btn-primary btn-sm">{{ it.cta.label }}</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
<script setup>
defineProps({ title:String, items:{ type:Array, default:()=>[] } })
function toArray(v){ return Array.isArray(v) ? v : (v ? [v] : []) }
</script>
