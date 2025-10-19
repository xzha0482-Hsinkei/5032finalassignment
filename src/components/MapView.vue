<template>
  <section class="map-section">
    <h2>🗺️ Plan Your Route</h2>

    <div class="controls">
      <input v-model="start" placeholder="Start location" />
      <input v-model="end" placeholder="Destination" />
      <button @click="getRoute">Get Route</button>
    </div>

    <div ref="mapContainer" class="map-container"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ✅ 修复 Leaflet 图标丢失问题（Vite 环境必需）
import 'leaflet-defaulticon-compatibility'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'

const mapContainer = ref(null)
let map = null
let routeLayer = null

const start = ref('')
const end = ref('')

// ✅ 你 Firebase Cloud Function 的代理地址
const proxyUrl = 'https://us-central1-finalassignment-a39fa.cloudfunctions.net/orsProxy'

onMounted(async () => {
  await nextTick() // 确保 DOM 挂载完毕再初始化地图

  map = L.map(mapContainer.value).setView([-37.8136, 144.9631], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map)

  // ✅ 让地图在容器加载完后自动刷新布局
  setTimeout(() => {
    map.invalidateSize()
  }, 300)
})

async function getRoute() {
  if (!start.value || !end.value) {
    alert('Please enter start and end points')
    return
  }

  try {
    const res = await fetch(`${proxyUrl}?start=${encodeURIComponent(start.value)}&end=${encodeURIComponent(end.value)}`)
    const data = await res.json()

    if (!data.route) {
      alert('No route found.')
      return
    }

    const coords = data.route.geometry.coordinates.map(([lon, lat]) => [lat, lon])

    if (routeLayer) map.removeLayer(routeLayer)
    routeLayer = L.polyline(coords, { color: '#3b82f6', weight: 4 }).addTo(map)
    map.fitBounds(routeLayer.getBounds())

    const startMarker = L.marker(coords[0]).addTo(map)
    const endMarker = L.marker(coords[coords.length - 1]).addTo(map)
    startMarker.bindPopup('Start').openPopup()
    endMarker.bindPopup('Destination')
  } catch (err) {
    console.error('❌ Route fetch error:', err)
    alert('Failed to fetch route: ' + err.message)
  }
}
</script>

<style scoped>
.map-section {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  padding: 24px;
  margin: 20px auto;
  width: min(90%, 900px);
}

h2 {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  width: 200px;
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

button:hover {
  background: #2563eb;
}

.map-container {
  height: 400px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
</style>
