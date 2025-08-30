<template>
  <div>
    <h5 class="mb-2">Search resources</h5>
    <div class="mb-3">
      <label class="form-label">Keyword</label>
      <input type="search" class="form-control" :value="modelValue" @input="$emit('update:modelValue',$event.target.value)" placeholder="e.g. sleep, prostate">
    </div>
    <div>
      <label class="form-label">Topic</label>
      <select class="form-select" :value="topic" @change="$emit('update:topic',$event.target.value)">
        <option value="all">All</option>
        <option value="mental-health">Mental health</option>
        <option value="prostate">Prostate</option>
        <option value="testicular">Testicular</option>
      </select>
    </div>
  </div>
</template>
<script setup>
defineProps({ modelValue: String, topic: String })
defineEmits(['update:modelValue','update:topic'])
</script>
