<template>
  <ModalComponent :isOpen="isOpen" @close="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div
        class="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 bg-white"
      >
        <h2 class="text-xl font-semibold text-gray-900">{{ title }}</h2>
        <button @click="$emit('close')" class="p-1" aria-label="Close">
          <CloseIcon class="w-6 h-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </button>
      </div>
      <div class="p-6">
        <slot />
      </div>
    </div>
  </ModalComponent>
</template>

<script setup lang="ts">
import ModalComponent from './ModalComponent.vue'
import CloseIcon from './icons/CloseIcon.vue'
import { defineProps } from 'vue'

defineProps<{ isOpen: boolean; title: string }>()
</script>
