<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: [] }>()

function onBackdropClick() {
  emit('close')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-100"
    @click="onBackdropClick"
  >
    <div @click.stop>
      <slot />
    </div>
  </div>
</template>
