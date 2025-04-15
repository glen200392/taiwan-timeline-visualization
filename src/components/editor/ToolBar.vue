<template>
  <div class="toolbar bg-white border-b border-gray-200 p-2 flex items-center space-x-2">
    <!-- 文字格式工具 -->
    <div class="format-tools flex items-center space-x-2 border-r border-gray-200 pr-2">
      <button 
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        @click="$emit('format', 'bold')"
        :class="{ 'bg-gray-100': activeFormats.includes('bold') }">
        <span class="w-5 h-5 text-gray-700">B</span>
      </button>
      <button 
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        @click="$emit('format', 'italic')"
        :class="{ 'bg-gray-100': activeFormats.includes('italic') }">
        <span class="w-5 h-5 text-gray-700">I</span>
      </button>
      <button 
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        @click="$emit('format', 'underline')"
        :class="{ 'bg-gray-100': activeFormats.includes('underline') }">
        <span class="w-5 h-5 text-gray-700">U</span>
      </button>
    </div>

    <!-- 對齊工具 -->
    <div class="align-tools flex items-center space-x-2 border-r border-gray-200 pr-2">
      <button 
        v-for="align in alignments" 
        :key="align"
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        @click="$emit('align', align)"
        :class="{ 'bg-gray-100': currentAlignment === align }">
        <span class="w-5 h-5 text-gray-700">{{ alignmentIcon(align) }}</span>
      </button>
    </div>

    <!-- 插入工具 -->
    <div class="insert-tools flex items-center space-x-2">
      <button 
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        @click="$emit('insert', 'image')">
        <span class="w-5 h-5 text-gray-700">📷</span>
      </button>
      <button 
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        @click="$emit('insert', 'chart')">
        <span class="w-5 h-5 text-gray-700">📊</span>
      </button>
      <button 
        class="p-2 rounded hover:bg-gray-100 transition-colors"
        @click="$emit('insert', 'shape')">
        <span class="w-5 h-5 text-gray-700">⬡</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  activeFormats?: string[]
  currentAlignment?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeFormats: () => [],
  currentAlignment: 'left'
})

const alignments = ['left', 'center', 'right']

const alignmentIcon = (align: string) => {
  switch (align) {
    case 'left': return '⫷'
    case 'center': return '☰'
    case 'right': return '⫸'
    default: return '⫷'
  }
}

defineEmits<{
  (e: 'format', type: string): void
  (e: 'align', type: string): void
  (e: 'insert', type: string): void
}>()
</script>

<style scoped>
.toolbar {
  min-height: 56px;
  user-select: none;
}

button {
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>