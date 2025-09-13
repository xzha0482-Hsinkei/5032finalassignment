<template>
  <div class="d-inline-flex align-items-center">
    <button v-for="i in 5" :key="i" type="button"
      class="btn btn-sm border-0 p-0 me-1"
      :aria-label="`Rate ${i} star${i>1?'s':''}`"
      :disabled="readonly"
      @click="$emit('update:modelValue', i)">
      <span :style="{color: (modelValue >= i) ? '#f59e0b' : '#d1d5db', fontSize: '1.1rem'}">★</span>
    </button>
    <span v-if="count!=null" class="small text-muted ms-1">({{ count }})</span>
  </div>
</template>
<script setup>
defineProps({ modelValue: {type:Number, default:0}, readonly: {type:Boolean, default:false}, count: Number })
defineEmits(['update:modelValue'])
</script>
