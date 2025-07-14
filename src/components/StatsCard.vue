<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  title: string
  value: string | number
  icon?: Component
  iconClass?: string
  bgColor?: string
  textColor?: string
}

withDefaults(defineProps<Props>(), {
  iconClass: 'text-custom-red-600',
  bgColor: 'bg-custom-red-100',
  textColor: 'text-gray-900',
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
    <div class="flex items-center gap-4">
      <div
        v-if="icon"
        :class="['w-10 h-10 flex items-center justify-center rounded-full', bgColor]"
      >
        <component :is="icon" :class="iconClass" />
      </div>
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <p :class="['text-2xl font-semibold', textColor]">{{ value }}</p>
      </div>
    </div>
  </div>
</template>
