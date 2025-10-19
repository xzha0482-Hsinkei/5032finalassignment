<template>
  <!-- Hero 区 -->
  <section class="band hero">
    <div class="container">
      <h1 class="h1">Join us to improve men’s health</h1>
      <p class="lead">Donate, volunteer, or partner — every action makes a difference.</p>
    </div>
  </section>

  <!-- Volunteer 表单 -->
  <section class="section">
    <div class="container" style="max-width:720px">
      <h2 class="h2">Volunteer interest</h2>
      <p class="lead">We’ll contact you within 3–5 business days.</p>
      <div class="card" style="padding:16px">
        <VolunteerForm />
      </div>
    </div>
  </section>

  <!-- ✅ 新增：地图功能 -->
  <section class="section">
    <div class="container" style="max-width:900px">
      <h2 class="h2">Plan Your Route</h2>
      <p class="lead">Find the best route from your location to our center or event venue.</p>
      <div class="card" style="padding:16px">
        <MapView />
      </div>
    </div>
  </section>

  <!-- 捐赠区块 -->
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

  <!-- 活动区块 -->
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

  <!-- 引用语录 -->
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
import MapView from '@/components/MapView.vue'  // ✅ 新增导入

const events = ref([])

onMounted(async () => {
  events.value = await useFetchJson('/data/events.json', [])
})
</script>

<style scoped>
.h2 {
  color: #1e3a8a;
  margin-bottom: 8px;
}
.lead {
  color: #475569;
}
.section {
  padding: 40px 0;
}
</style>
