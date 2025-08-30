<template>
  <div>
    <Hero title="Join us to improve men’s health" subtitle="Donate, volunteer, or partner — every action makes a difference.">
      <template #side-panel>
        <FormCard title="Volunteer interest" desc="We’ll contact you within 3–5 business days.">
          <VolunteerForm />
        </FormCard>
      </template>
    </Hero>

    <section class="py-4">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-6">
            <div class="card p-3 h-100">
              <h4>Where your donation goes</h4>
              <ul class="mb-0">
                <li>40% Education & resources</li>
                <li>35% Community programs</li>
                <li>25% Evaluation & research</li>
              </ul>
              <div class="mt-3">
                <a href="mailto:donate@your-nfp.org" class="btn btn-primary me-2">Donate one-off</a>
                <a href="mailto:donate@your-nfp.org?subject=Monthly%20donation" class="btn btn-outline-secondary">Make it monthly</a>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="card p-3 h-100">
              <h4>Partner with us</h4>
              <p>Corporate sponsorship, community co-hosted events, and workplace/campus talks.</p>
              <a href="mailto:partnerships@your-nfp.org" class="btn btn-outline-secondary">Request a Partnership Kit</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CardsGrid title="Upcoming events" :items="eventsMapped" />

    <section class="container small text-muted py-3">
      <p class="mb-0"><strong>Disclaimer:</strong> Information is educational only and not medical advice.</p>
    </section>
  </div>
</template>

<script setup>
import Hero from '@/components/sections/Hero.vue'
import FormCard from '@/components/sections/FormCard.vue'
import VolunteerForm from '@/components/forms/VolunteerForm.vue'
import CardsGrid from '@/components/sections/CardsGrid.vue'
import { useFetchJson } from '@/composables/useFetchJson'
import { ref, onMounted, computed } from 'vue'

const events = ref([])
onMounted(async () => {
  events.value = await useFetchJson('/data/events.json', [
    { title:'Men’s Mental Fitness – 4-week Workshop', meta:'Carlton · Wed evenings', cta:{ label:'RSVP', href:'#' } }
  ])
})
const eventsMapped = computed(() =>
  events.value.map(e => ({ title:e.title, excerpt:e.meta, cta:e.cta||{label:'RSVP',href:'#'} }))
)
</script>
