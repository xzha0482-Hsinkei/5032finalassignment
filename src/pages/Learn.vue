<template>
  <div>
    <Hero title="Learn – trusted, plain-language resources" subtitle="Educational only — not a substitute for medical advice.">
      <template #side-panel>
        <SearchCard v-model="search" v-model:topic="topic"/>
      </template>
    </Hero>

    <section class="py-4">
      <div class="container">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <h2 class="h4 mb-0">Articles & Guides</h2>
          <div class="small text-muted">Showing {{ filtered.length }} result(s)</div>
        </div>

        <div class="row g-3">
          <article v-for="a in filtered" :key="a.id" class="col-md-6">
            <div class="card h-100 p-3">
              <h5 class="mb-1"><a :href="a.href" class="text-decoration-none">{{ a.title }}</a></h5>
              <p class="text-muted mb-2">{{ a.excerpt }}</p>
              <div class="mb-2">
                <span v-for="t in a.tags" :key="t" class="tag me-1">{{ t }}</span>
              </div>
              <p class="small text-muted mb-0">Updated {{ a.updatedAt }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Hero from '@/components/sections/Hero.vue'
import SearchCard from '@/components/sections/SearchCard.vue'
import { ref, computed, onMounted } from 'vue'
import { useFetchJson } from '@/composables/useFetchJson'

const articles = ref([])
const search = ref('')
const topic = ref('all')

onMounted(async () => {
  articles.value = await useFetchJson('/data/articles.json', [
    { id:'check-in', title:'Checking in with yourself', excerpt:'Quick self-check steps.', tags:['mental-health'], updatedAt:'2025-08-20', href:'#' }
  ])
})

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return articles.value.filter(a => {
    const matchQ = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    const matchTag = topic.value === 'all' || a.tags?.includes(topic.value)
    return matchQ && matchTag
  })
})
</script>
