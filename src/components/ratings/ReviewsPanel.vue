<!-- src/components/ratings/ReviewsPanel.vue -->
<template>
  <section class="reviews-panel">
    <header class="header">
      <h2 class="title">Community Reviews</h2>
      <StarRating :modelValue="avg" :readonly="true" />
      <span class="avg">Avg: {{ avg }}</span>
      <span class="count">({{ allReviews.length }} reviews)</span>
    </header>

    
    <div class="editor">
      <div class="rating-row">
        <label>Rate:</label>
        <StarRating v-model="rating" :readonly="!isAuthenticated" />
      </div>

      <label class="sr-only" for="rv-comment">Comment</label>
      <textarea id="rv-comment"
        v-model.trim="comment"
        :disabled="!isAuthenticated"
        required minlength="5" maxlength="300"
        placeholder="Share your experience (5–300 chars)"></textarea>

      <button class="btn" @click="submitReview" :disabled="!isAuthenticated">
        Submit
      </button>
      <p v-if="!isAuthenticated" class="muted">Please log in to submit a review.</p>
    </div>

    
    <ul class="list">
      <li v-for="r in allReviews" :key="r.id" class="item">
        <StarRating :modelValue="r.rating" :readonly="true" />
        <div class="comment">{{ r.comment }}</div>
        <div class="meta">by {{ r.user }} · {{ new Date(r.ts).toLocaleString() }}</div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import StarRating from './StarRating.vue'
import { useFetchJson } from '@/composables/useFetchJson'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { isAuthenticated, useCurrentUser } from '@/composables/useAuth'


const seedReviews = await useFetchJson('/data/reviews.json', [])


const localReviews = useLocalStorage('nfp_reviews', [])


const allReviews = computed(() => [...seedReviews.value, ...localReviews.value])
const avg = computed(() => {
  if (!allReviews.value.length) return 0
  const sum = allReviews.value.reduce((s, r) => s + Number(r.rating || 0), 0)
  return Number((sum / allReviews.value.length).toFixed(2))
})


const rating  = ref(0)
const comment = ref('')
const me = useCurrentUser()

function submitReview () {
  if (!isAuthenticated.value) {
    alert('Please log in to submit a review.')
    return
  }

  const r = Number(rating.value)
  const c = String(comment.value || '')

  
  if (r < 1 || r > 5) {
    alert('Rating must be from 1 to 5.')
    return
  }
  if (c.length < 5 || c.length > 300) {
    alert('Comment must be 5–300 characters.')
    return
  }

  localReviews.value = [
    ...localReviews.value,
    {
      id: crypto.randomUUID(),
      user: me.value?.email || 'user',
      rating: r,
     
      comment: c,
      ts: Date.now()
    }
  ]

  rating.value = 0
  comment.value = ''
  alert('Thanks for your feedback!')
}
</script>

<style scoped>
.reviews-panel { padding: 1rem; border-radius: 10px; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,.05); }
.header { display: flex; align-items: center; gap: .5rem; flex-wrap: wrap; }
.title { margin: 0; font-size: 1.25rem; }
.avg, .count { color: #555; }
.editor { margin: 1rem 0; display: grid; gap: .5rem; }
.rating-row { display: flex; align-items: center; gap: .5rem; }
textarea { width: 100%; min-height: 90px; padding: .5rem; border: 1px solid #ddd; border-radius: 8px; }
.btn { padding: .5rem .9rem; border: none; border-radius: 8px; cursor: pointer; background: var(--brand, #3b82f6); color: #fff; }
.btn:disabled { opacity: .6; cursor: not-allowed; }
.muted { color: #777; font-size: .9rem; }
.list { list-style: none; padding: 0; margin: 0; display: grid; gap: .75rem; }
.item { padding: .75rem; border: 1px solid #eee; border-radius: 10px; background: #fafafa; }
.comment { white-space: pre-wrap; }
.meta { color: #666; font-size: .85rem; margin-top: .25rem; }
</style>
