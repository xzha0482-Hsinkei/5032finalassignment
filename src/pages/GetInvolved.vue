<template>
  
  <section class="band hero">
    <div class="container">
      <h1 class="h1">Join us to improve men’s health</h1>
      <p class="lead">Donate, volunteer, or partner — every action makes a difference.</p>
    </div>
  </section>

  
  <section class="section">
    <div class="container" style="max-width:720px">
      <h2 class="h2">Volunteer interest</h2>
      <p class="lead">We’ll contact you within 3–5 business days.</p>
      <div class="card" style="padding:16px">
        <VolunteerForm />
      </div>
    </div>
  </section>

  
  <section class="section">
    <div class="container">
      <h2 class="h2">Where your donation goes</h2>
      <p class="lead">Your gift supports education resources, community programs, and continuous evaluation.</p>
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px">
        <a class="btn btn-primary" href="mailto:donate@your-nfp.org" rel="noopener">Donate now</a>
        <a class="btn btn-ghost" href="mailto:donate@your-nfp.org?subject=Monthly%20donation" rel="noopener">Make it monthly</a>
      </div>
    </div>
  </section>

  
  <section class="section">
    <div class="container">
      <h2 class="h2">Upcoming events</h2>
      <div class="grid grid-3">
        <article v-for="e in events" :key="e.title" class="card" style="padding:16px">
          <h3 style="margin:0 0 6px">{{ e.title }}</h3>
          <p class="lead" style="margin:0 0 10px">{{ e.meta }}</p>
          <a class="btn btn-ghost" :href="(e.cta && e.cta.href) || '#'" rel="noopener">
            {{ (e.cta && e.cta.label) || 'RSVP' }}
          </a>
        </article>
      </div>
    </div>
  </section>

  
  <section class="section">
    <div class="container">
      <div class="card" style="padding:24px">
        <blockquote style="text-align:center;margin:0">
          <div style="font-size:28px;color:var(--brand)">“</div>
          <p style="margin:6px 0">Volunteering here helped me reconnect with my community.</p>
          <footer class="small" style="color:var(--muted)">Sam, Volunteer</footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFetchJson } from '@/composables/useFetchJson'
import VolunteerForm from '@/components/forms/VolunteerForm.vue'

const events = ref([])

onMounted(async () => {
  events.value = await useFetchJson('/data/events.json', [])
})
</script>
