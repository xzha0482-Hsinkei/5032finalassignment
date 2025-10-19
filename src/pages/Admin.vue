<template>
  <section class="section">
    <div class="container">
      <h1 class="h1">Admin Dashboard</h1>
      <p class="lead">
        Monitor volunteer data, visualize activity trends, and export reports.
      </p>

      <!-- ✅ 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card"><h3>Total Users</h3><p>{{ stats.totalUsers }}</p></div>
        <div class="stat-card"><h3>Active Volunteers</h3><p>{{ stats.activeVolunteers }}</p></div>
        <div class="stat-card"><h3>Average Rating</h3><p>{{ stats.avgRating.toFixed(1) }}/5</p></div>
      </div>

      <!-- ✅ 图表区 -->
      <div class="chart-container"><canvas id="trendChart" height="120"></canvas></div>
      <div class="chart-container" style="margin-top:20px"><canvas id="roleChart" height="120"></canvas></div>

      <!-- ✅ 数据表格 -->
      <div class="card" style="padding:16px;margin-top:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <strong>Total Records: {{ submissions.length }}</strong>

          <div style="display:flex;gap:10px;align-items:center">
            <v-text-field
              v-model="search"
              label="Search by name or email"
              variant="outlined"
              density="compact"
              clearable
              hide-details
              style="max-width: 300px"
            />
            <v-btn color="primary" @click="exportCSV" prepend-icon="mdi-file-delimited">Export CSV</v-btn>
            <v-btn color="secondary" @click="exportPDF" prepend-icon="mdi-file-pdf-box">Export PDF</v-btn>
          </div>
        </div>

        <v-data-table
          :headers="headers"
          :items="filteredSubmissions"
          :items-per-page="10"
          class="elevation-1"
          :search="search"
          style="margin-top: 15px"
        >
          <template #item.consent="{ item }">
            <span :style="{ color: item.consent ? '#16a34a' : '#b91c1c' }">
              {{ item.consent ? 'Yes' : 'No' }}
            </span>
          </template>

          <template #item.submittedAt="{ item }">
            {{ formatTs(item.submittedAt) }}
          </template>
        </v-data-table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '@/firebase'
import { collection, onSnapshot } from 'firebase/firestore'
import Papa from 'papaparse'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { Chart } from 'chart.js/auto'

const submissions = ref([])
const search = ref('')
const stats = ref({ totalUsers: 0, activeVolunteers: 0, avgRating: 0 })

// ✅ 表头
const headers = [
  { title: 'Name', key: 'fullName', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Availability', key: 'availability', sortable: false },
  { title: 'Consent', key: 'consent', sortable: false },
  { title: 'Submitted', key: 'submittedAt', sortable: true },
]

// ✅ Firestore 实时监听
onMounted(() => {
  onSnapshot(collection(db, '5032Finalassignment'), snapshot => {
    submissions.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    updateStatsAndCharts()
  })
})

// ✅ 更新统计 & 图表
function updateStatsAndCharts() {
  const data = submissions.value
  stats.value.totalUsers = data.length
  stats.value.activeVolunteers = data.filter(u => u.role === 'Volunteer').length
  stats.value.avgRating = data.reduce((a, b) => a + (b.rating || 0), 0) / (data.length || 1)
  renderCharts(data)
}

// ✅ 搜索过滤
const filteredSubmissions = computed(() => {
  if (!search.value) return submissions.value
  const term = search.value.toLowerCase()
  return submissions.value.filter(r =>
    r.fullName?.toLowerCase().includes(term) || r.email?.toLowerCase().includes(term)
  )
})

// ✅ 时间格式化
function formatTs(ts) {
  try {
    if (!ts) return ''
    if (typeof ts.toDate === 'function') return ts.toDate().toLocaleString()
    if (ts.seconds) return new Date(ts.seconds * 1000).toLocaleString()
    return new Date(ts).toLocaleString()
  } catch {
    return ''
  }
}

// ✅ 图表渲染
let trendChart, roleChart
function renderCharts(data) {
  if (trendChart) trendChart.destroy()
  if (roleChart) roleChart.destroy()

  const dateCounts = {}
  data.forEach(d => {
    const raw = d.submittedAt
    let date
    if (raw?.seconds) date = new Date(raw.seconds * 1000)
    else if (typeof raw === 'string') date = new Date(raw)
    else date = new Date()
    const day = date.toISOString().split('T')[0]
    dateCounts[day] = (dateCounts[day] || 0) + 1
  })

  trendChart = new Chart(document.getElementById('trendChart'), {
    type: 'line',
    data: {
      labels: Object.keys(dateCounts),
      datasets: [{
        label: 'Submissions Over Time',
        data: Object.values(dateCounts),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.3)',
        fill: true,
        tension: 0.4,
      }],
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
  })

  const roleCounts = data.reduce((acc, cur) => {
    acc[cur.role] = (acc[cur.role] || 0) + 1
    return acc
  }, {})
  roleChart = new Chart(document.getElementById('roleChart'), {
    type: 'bar',
    data: {
      labels: Object.keys(roleCounts),
      datasets: [{
        label: 'User Roles',
        data: Object.values(roleCounts),
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
      }],
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
  })
}

// ✅ 导出 CSV
function exportCSV() {
  if (!submissions.value.length) return alert('No data to export')
  const csv = Papa.unparse(submissions.value)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'submissions.csv'
  link.click()
}

// ✅ 导出 PDF
function exportPDF() {
  if (!submissions.value.length) return alert('No data to export')
  const doc = new jsPDF()
  doc.text('Volunteer Submissions Report', 14, 15)
  const rows = submissions.value.map(r => [
    r.fullName,
    r.email,
    r.role,
    r.availability,
    r.consent ? 'Yes' : 'No',
    formatTs(r.submittedAt),
  ])
  doc.autoTable({
    head: [['Name', 'Email', 'Role', 'Availability', 'Consent', 'Submitted']],
    body: rows,
    startY: 25
  })
  doc.save('submissions.pdf')
}
</script>

<style scoped>
.section {
  padding: 40px;
  text-align: center;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  padding: 16px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.chart-container {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 20px;
}
</style>
