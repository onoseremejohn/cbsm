<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { debounce } from '@/utils/debounce'

interface Props {
  gap?: number
  gapX?: number
  gapY?: number
  minWidth?: number
  containerClassName?: string
}

const props = withDefaults(defineProps<Props>(), {
  gap: 20,
  minWidth: 250,
})

const columns = ref(1)
const gridRef = ref<HTMLDivElement | null>(null)
const hasCalculated = ref(false)

// Function to calculate and set the number of columns based on container width
const handleResize = (entries: ResizeObserverEntry[]) => {
  const entry = entries[0]
  const columnGap = props.gapX ?? props.gap
  const newColumns = Math.max(
    Math.floor((entry.contentRect.width + columnGap) / (props.minWidth + columnGap)),
    1,
  )

  hasCalculated.value = true
  if (columns.value !== newColumns) {
    columns.value = newColumns
  }
}

// Debounced version of handleResize to minimize frequent state updates
const debouncedResize = debounce(
  // Accept any arguments and forward them to handleResize
  (...args: unknown[]) => handleResize(args as ResizeObserverEntry[]),
  300
)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (gridRef.value) {
    resizeObserver = new ResizeObserver(debouncedResize)
    resizeObserver.observe(gridRef.value)
  }
  // Trigger initial calculation immediately
  const rect = gridRef.value?.getBoundingClientRect()
  if (rect) {
    handleResize([{ contentRect: rect } as ResizeObserverEntry])
  }
})

onUnmounted(() => {
  if (resizeObserver && gridRef.value) {
    resizeObserver.unobserve(gridRef.value)
    resizeObserver.disconnect()
  }
})

// Watch for prop changes and recalculate
watch([() => props.gap, () => props.gapX, () => props.minWidth], () => {
  if (gridRef.value) {
    // Trigger a resize calculation when props change
    const rect = gridRef.value.getBoundingClientRect()
    handleResize([{ contentRect: rect } as ResizeObserverEntry])
  }
})
</script>

<template>
  <div
    ref="gridRef"
    :class="[
      'grid duration-300',
      {
        'opacity-0': !hasCalculated,
      },
      containerClassName,
    ]"
    :style="{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      columnGap: gapX !== undefined ? `${gapX}px` : `${gap}px`,
      rowGap: gapY !== undefined ? `${gapY}px` : `${gap}px`,
    }"
  >
    <slot v-if="columns > 0" />
  </div>
</template>
