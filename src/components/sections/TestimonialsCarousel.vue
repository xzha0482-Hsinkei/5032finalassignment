<template>
  <section class="two-col">
    <div class="container">
      <div class="card" style="position:relative">
        <button class="btn secondary" style="position:absolute;left:10px;top:50%;transform:translateY(-50%)"
                @click="prev" aria-label="Previous">‹</button>
        <button class="btn secondary" style="position:absolute;right:10px;top:50%;transform:translateY(-50%)"
                @click="next" aria-label="Next">›</button>

        <blockquote style="text-align:center;margin:30px 40px">
          <div style="font-size:28px;color:var(--brand)">“</div>
          <p style="margin:6px 0">{{ current.quote }}</p>
          <footer class="small" style="color:var(--muted)">{{ current.author }} <span v-if="current.role">· {{ current.role }}</span></footer>
        </blockquote>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
  items: { type: Array, default: () => [
    { quote: 'Great program and friendly crew.', author: 'Participant' },
    { quote: 'I felt supported to seek help.', author: 'Workshop Attendee' }
  ] }
})
const i = ref(0)
const current = computed(()=> props.items[i.value] || props.items[0])
function prev(){ i.value = (i.value - 1 + props.items.length) % props.items.length }
function next(){ i.value = (i.value + 1) % props.items.length }
</script>
