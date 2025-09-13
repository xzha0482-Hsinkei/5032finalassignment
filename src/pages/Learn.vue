<template>
  
  <section class="band section--tight">
    <div class="container">
      <h1 class="h1">Learn – trusted, plain-language resources</h1>
      <p class="lead" style="margin:0 0 12px">Educational only — not a substitute for medical advice.</p>

      <div class="grid" style="grid-template-columns:2fr 1fr">
        <div>
          <label for="kw">Keyword</label>
          <input id="kw" v-model.trim="kw" placeholder="e.g. sleep, prostate" />
        </div>
        <div>
          <label for="topic">Topic</label>
          <select id="topic" v-model="topic">
            <option value="all">All</option>
            <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  
  <section class="section">
    <div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <h2 class="h2" style="margin:0">Articles & Guides</h2>
        <div class="small">Showing {{ filtered.length }} result(s)</div>
      </div>

      <div class="grid grid-2">
        <article v-for="a in filtered" :key="a.id" class="card" style="padding:16px">
          <h3 style="margin:0 0 6px">{{ a.title }}</h3>
          <p class="lead" style="margin:0 0 10px">{{ a.excerpt }}</p>
          <div class="small" style="margin-bottom:10px;color:var(--muted)">
            Updated {{ a.updatedAt }}
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
            <span v-for="tag in a.tags" :key="tag" class="small" style="padding:2px 8px;border:1px solid #cbd5e1;border-radius:999px">
              {{ tag }}
            </span>
          </div>
          <a class="btn btn-ghost" :href="a.href || '#'" rel="noopener">Read</a>
        </article>
      </div>
    </div>
  </section>

  
  <section class="section">
    <div class="container">
      <ReviewsPanel />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useFetchJson } from '@/composables/useFetchJson'
import ReviewsPanel from '@/components/ratings/ReviewsPanel.vue'   

const articles = ref([])
const kw = ref('')
const topic = ref('all')
const topics = ref([])

onMounted(async () => {
  articles.value = await useFetchJson('/data/articles.json', [])
  const set = new Set()
  for (const a of articles.value) (a.tags || []).forEach(t => set.add(t))
  topics.value = [...set]
})

const filtered = computed(() => {
  const q = kw.value.toLowerCase()
  return articles.value.filter(a => {
    const matchQ = !q || a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q)
    const matchTag = topic.value === 'all' || (a.tags || []).includes(topic.value)
    return matchQ && matchTag
  })
})
</script>
