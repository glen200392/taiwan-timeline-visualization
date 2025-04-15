<template>
  <div class="slide-container relative">
    <!-- Zoom Controls -->
    <div class="zoom-controls absolute top-4 right-4 bg-white rounded-lg shadow-md p-2 flex gap-2">
      <button @click="zoomOut" class="p-1 hover:bg-gray-100 rounded">
        <span class="text-lg">-</span>
      </button>
      <span class="py-1 px-2">{{ Math.round(zoom * 100) }}%</span>
      <button @click="zoomIn" class="p-1 hover:bg-gray-100 rounded">
        <span class="text-lg">+</span>
      </button>
    </div>

    <!-- Canvas -->
    <div class="slide-canvas bg-white shadow-lg rounded-lg p-4"
         :style="{ 
           width: `${width}px`, 
           height: `${height}px`,
           transform: `scale(${zoom})`,
           backgroundSize: `${gridSize}px ${gridSize}px`
         }"
         @click="$emit('canvas-click')"
         @dragover.prevent
         @drop.prevent="handleDrop">
      <div class="slide-content relative w-full h-full" ref="contentRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePresentationStore } from '@/stores/presentation'

interface Props {
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 960,
  height: 540
})

const store = usePresentationStore()
const contentRef = ref<HTMLDivElement | null>(null)
const zoom = ref(1)
const gridSize = 20

const zoomIn = () => {
  zoom.value = Math.min(2, zoom.value + 0.1)
}

const zoomOut = () => {
  zoom.value = Math.max(0.5, zoom.value - 0.1)
}

const handleDrop = (event: DragEvent) => {
  const contentElement = contentRef.value
  if (!contentElement || !event.dataTransfer) return

  const rect = contentElement.getBoundingClientRect()
  const x = (event.clientX - rect.left) / zoom.value
  const y = (event.clientY - rect.top) / zoom.value

  // Round to nearest grid position
  const snappedX = Math.round(x / gridSize) * gridSize
  const snappedY = Math.round(y / gridSize) * gridSize

  const elementType = event.dataTransfer.getData('elementType')
  if (elementType) {
    store.addElement({
      type: elementType,
      content: '',
      position: { x: snappedX, y: snappedY }
    })
    store.savePresentation()
  }
}

defineEmits(['canvas-click'])
</script>

<style scoped>
.slide-container {
  margin: 0 auto;
  width: fit-content;
}

.slide-canvas {
  margin: 0 auto;
  transform-origin: top left;
  transition: transform 0.2s ease;
  background-image: 
    linear-gradient(to right, rgba(128, 128, 128, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(128, 128, 128, 0.1) 1px, transparent 1px);
}

.slide-content {
  transform-origin: top left;
}
</style>
