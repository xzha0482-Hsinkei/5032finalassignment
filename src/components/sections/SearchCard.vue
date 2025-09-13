<template>
  <div>
    <h3 style="margin-top:0">Search resources</h3>
    <div class="form-row" style="margin-top:10px">
      <label>Keyword
        <input type="search" :value="modelValue" @input="$emit('update:modelValue',$event.target.value)" placeholder="e.g. sleep, prostate"/>
      </label>
      <label>Topic
        <select :value="topic" @change="$emit('update:topic',$event.target.value)">
          <option value="all">All</option>
          <option value="mental-health">Mental health</option>
          <option value="prostate">Prostate</option>
          <option value="testicular">Testicular</option>
        </select>
      </label>
    </div>
  </div>
</template>
<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  topic: { type: String, default: 'all' }
})
defineEmits(['update:modelValue','update:topic'])
</script>
