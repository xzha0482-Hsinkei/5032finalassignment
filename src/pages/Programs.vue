<template>
  
  <section class="band hero">
    <div class="container">
      <h1 class="h1">Programs designed with local partners</h1>
      <p class="lead">Clinically informed, community-led, and practical.</p>
      <p class="small" style="color:#e6f4fb;margin:6px 0 0">
        Explore our flagship programs and register your interest.
      </p>
    </div>
  </section>

  
  <section class="section">
    <div class="container">
      <div class="grid grid-2" v-for="p in programs" :key="p.title" style="align-items:start">
        <article class="card" style="padding:16px">
          <h3 style="margin:0 0 6px">{{ p.title }}</h3>
          <p class="lead" style="margin:0 0 10px">{{ p.excerpt }}</p>

          <ul class="list-clean" style="display:grid;gap:6px">
            <li v-if="p.details?.audience"><strong>Audience:</strong> {{ p.details.audience }}</li>
            <li v-if="p.details?.duration"><strong>Duration:</strong> {{ p.details.duration }}</li>
            <li v-if="p.details?.location"><strong>Location:</strong> {{ p.details.location }}</li>
            <li v-if="p.details?.partners?.length">
              <strong>Partners:</strong> {{ p.details.partners.join(', ') }}
            </li>
          </ul>
          <div style="margin-top:10px">
            <a class="btn btn-primary" :href="p.cta?.href || '#'" rel="noopener">{{ p.cta?.label || 'Register interest' }}</a>
          </div>
        </article>

        
        <div class="media-placeholder">Image / Video</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetchJson } from '@/composables/useFetchJson'

const programs = ref([])

onMounted(async () => {
  
  programs.value = await useFetchJson('/data/programs.json', [])
})
</script>
