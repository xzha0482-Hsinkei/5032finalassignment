<template>
  <section class="band hero">
    <div class="container">
      <div class="grid grid-2">
        <div>
          <h1 class="h1">But I Must Explain To You How All This Mistaken Idea Of…</h1>
          <p class="lead">
            Evidence-based education and community programs improving men’s health in Melbourne.
            Join workshops, learn from plain-language guides, and connect with local partners.
          </p>
          <div style="margin-top:16px">
            <router-link class="btn btn-primary" to="/programs">Explore programs</router-link>
            <router-link class="btn btn-ghost" to="/learn" style="margin-left:8px">Browse resources</router-link>
          </div>
        </div>

        <div class="card" style="padding:20px">
          <h3 style="margin:0 0 6px">Request info session</h3>
          <p class="small" style="margin:0 0 10px;color:#475569">
            We’ll email you within 3–5 days.
          </p>
          <form @submit.prevent="requestInfo" style="display:grid;gap:10px">
            <div>
              <label for="name">Name</label>
              <input id="name" v-model.trim="name" required minlength="2" maxlength="60" placeholder="Your name" />
            </div>
            <div>
              <label for="email">Email</label>
              <input id="email" v-model.trim="email" type="email" required maxlength="120" placeholder="you@example.com" />
            </div>
            <div>
              <label for="topic">Topic</label>
              <select id="topic" v-model="topic" required>
                <option value="" disabled>Select a topic</option>
                <option value="mental-health">Mental health</option>
                <option value="prostate">Prostate screening</option>
                <option value="fitness">Fitness & lifestyle</option>
              </select>
            </div>
            <button class="btn btn-primary" :disabled="!valid">Request info session</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="grid grid-2">
        <div>
          <h2 class="h2">Somes Us</h2>
          <p class="lead">
            Community-led programs designed with local partners. Flexible formats, measured outcomes, and accessible language.
          </p>
          <router-link class="btn btn-ghost" to="/get-involved">Contact us</router-link>
        </div>
        <div class="grid grid-2">
          <div class="card" style="padding:16px">
            <strong>Small-group workshops</strong>
            <p class="lead">4-week practical routines for connection and resilience.</p>
          </div>
          <div class="card" style="padding:16px">
            <strong>Plain-language resources</strong>
            <p class="lead">Quick reads you can share with family and mates.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ✅ AI 聊天机器人组件放在页面底部 -->
  <AiChat />
</template>

<script setup>
import { ref, computed } from 'vue'
import AiChat from '@/components/AiChat.vue'   // ✅ 正确导入

const name = ref('')
const email = ref('')
const topic = ref('')

const valid = computed(() =>
  name.value.length >= 2 && email.value.includes('@') && topic.value
)

function requestInfo() {
  alert(`Thanks, ${name.value}! We’ll contact you at ${email.value}.`)
  name.value = ''
  email.value = ''
  topic.value = ''
}
</script>
