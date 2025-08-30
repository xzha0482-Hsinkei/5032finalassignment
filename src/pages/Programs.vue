<template>
  <div>
    <Hero title="Programs designed with local partners" subtitle="Clinically informed, community-led, and practical.">
      <template #side-panel>
        <FormCard title="Request info session">
          <form @submit.prevent>
            <div class="mb-3"><label class="form-label">Name</label><input class="form-control" placeholder="Your name"></div>
            <div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" placeholder="you@example.com"></div>
            <button class="btn btn-primary" type="submit">Send request</button>
          </form>
        </FormCard>
      </template>
    </Hero>

    <CardsGrid title="Our programs" :items="cards" />
  </div>
</template>

<script setup>
import Hero from '@/components/sections/Hero.vue'
import FormCard from '@/components/sections/FormCard.vue'
import CardsGrid from '@/components/sections/CardsGrid.vue'
import { ref, onMounted } from 'vue'
import { useFetchJson } from '@/composables/useFetchJson'

const cards = ref([])
onMounted(async () => {
  cards.value = await useFetchJson('/data/programs.json', [
    {
      title:'Men’s Mental Fitness Workshops',
      excerpt:'4-week small-group routines for connection and resilience.',
      details:{ audience:'Men 18+', duration:'4 weeks', location:'Carlton & CBD', partners:['Local clinics','Community orgs'] },
      cta:{ label:'Register interest', href:'#' }
    }
  ])
})
</script>
