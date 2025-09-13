<template>
  <section class="section">
    <div class="container">
      <h1 class="h1">Admin</h1>
      <p class="lead">Local demo only. Manage volunteer submissions saved in your browser.</p>

      <div class="card" style="padding:16px;margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
          <strong>Submissions: {{ submissions.length }}</strong>
          <button class="btn btn-ghost" @click="clearAll" :disabled="!submissions.length">Clear all</button>
        </div>

        <div v-if="!submissions.length" class="small" style="margin-top:10px;color:var(--muted)">
          No submissions yet.
        </div>

        <div v-else style="overflow:auto;margin-top:10px">
          <table style="width:100%; border-collapse:collapse">
            <thead>
              <tr>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb">Name</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb">Email</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb">Role</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb">Availability</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb">Consent</th>
                <th style="text-align:left;padding:8px;border-bottom:1px solid #e5e7eb">Submitted</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r,i) in submissions" :key="i">
                <td style="padding:8px;border-bottom:1px solid #f1f5f9">{{ r.fullName }}</td>
                <td style="padding:8px;border-bottom:1px solid #f1f5f9">{{ r.email }}</td>
                <td style="padding:8px;border-bottom:1px solid #f1f5f9">{{ r.role }}</td>
                <td style="padding:8px;border-bottom:1px solid #f1f5f9">{{ r.availability }}</td>
                <td style="padding:8px;border-bottom:1px solid #f1f5f9">{{ r.consent ? 'Yes' : 'No' }}</td>
                <td style="padding:8px;border-bottom:1px solid #f1f5f9">{{ formatTs(r.submittedAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="small" style="color:#64748b;margin-top:10px">
        Tip: In production, move authentication & data to a backend with httpOnly cookies and database storage.
      </p>
    </div>
  </section>
</template>

<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'

const submissions = useLocalStorage('volunteer_submissions', [])
function clearAll(){ submissions.value = [] }
function formatTs(ts){ try{ return new Date(ts).toLocaleString() }catch{ return ts } }
</script>
