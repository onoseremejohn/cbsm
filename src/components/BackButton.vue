<script setup lang="ts">
import { useRouter } from 'vue-router'
import ChevronLeftIcon from './icons/ChevronLeftIcon.vue'

interface Props {
  text?: string
  className?: string
}

withDefaults(defineProps<Props>(), {
  className: 'font-semibold text-gray-600 hover:text-gray-900',
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <button @click="goBack" :class="className">
    <ChevronLeftIcon class="w-5 h-5" />
    <span v-if="text" class="ml-2">{{ text }}</span>
  </button>
</template>
