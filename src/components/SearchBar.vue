<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  placeholder?: string
  modelValue?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'search', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search...',
  modelValue: ''
})

const emit = defineEmits<Emits>()

const searchValue = ref(props.modelValue)

watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue)
  emit('search', newValue)
})

watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})
</script>

<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg
        class="h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <input
      v-model="searchValue"
      type="text"
      :placeholder="placeholder"
      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-custom-red-500 focus:border-custom-red-500 sm:text-sm"
    />
  </div>
</template> 