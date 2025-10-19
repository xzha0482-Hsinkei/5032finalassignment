<template>
  <section class="admin-table">
    <h2>User Feedback Records</h2>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
        />
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredData"
        :items-per-page="10"
        :search="search"
        class="elevation-1"
      >
        <template #item.date="{ item }">
          {{ formatDate(item.date) }}
        </template>
      </v-data-table>
    </v-card>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase'

// 表格配置
const headers = [
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Message', value: 'message' },
  { text: 'Date', value: 'date' }
]

const data = ref([])
const search = ref('')

// 加载 Firestore 数据
onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'feedback'))
  data.value = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
})

const filteredData = computed(() => {
  if (!search.value) return data.value
  const term = search.value.toLowerCase()
  return data.value.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(term))
  )
})

function formatDate(ts) {
  if (!ts) return ''
  try {
    return new Date(ts.seconds * 1000).toLocaleString()
  } catch {
    return String(ts)
  }
}
</script>

<style scoped>
.admin-table {
  max-width: 1000px;
  margin: 40px auto;
}
</style>
