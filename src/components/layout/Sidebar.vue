<template>
  <div class="sidebar w-sidebar h-full bg-white border-r border-gray-200 flex flex-col">
    <!-- 幻燈片列表 -->
    <div class="slides-list flex-1 overflow-y-auto p-4">
      <h2 class="text-sm font-medium text-gray-500 mb-4">幻燈片</h2>
      <div class="space-y-3">
        <div 
          v-for="(slide, index) in slides" 
          :key="index"
          class="slide-thumbnail bg-white border rounded-lg p-2 cursor-pointer hover:border-primary transition-colors"
          :class="{ 'border-primary': currentSlide === index }"
          @click="$emit('select-slide', index)">
          <div class="aspect-video bg-gray-50 rounded flex items-center justify-center overflow-hidden">
            <!-- 幻燈片縮略圖預覽 -->
            <div class="transform scale-[0.2] origin-center">
              <component 
                :is="slide.component" 
                v-bind="slide.props"
                class="pointer-events-none" />
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500 text-center">
            第 {{ index + 1 }} 頁
          </div>
        </div>
      </div>
    </div>

    <!-- 模板選擇器 -->
    <div class="templates p-4 border-t border-gray-200">
      <h2 class="text-sm font-medium text-gray-500 mb-4">模板</h2>
      <div class="grid grid-cols-2 gap-2">
        <button 
          v-for="template in templates" 
          :key="template.name"
          class="template-item aspect-video bg-gray-50 rounded-lg p-2 hover:bg-gray-100 transition-colors"
          @click="$emit('apply-template', template.id)">
          <div class="w-full h-full flex items-center justify-center text-xs text-gray-500">
            {{ template.name }}
          </div>
        </button>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div class="actions p-4 border-t border-gray-200">
      <button 
        class="w-full bg-primary text-white rounded-lg py-2 px-4 hover:bg-primary/90 transition-colors"
        @click="$emit('add-slide')">
        新增幻燈片
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Slide {
  component: any
  props: Record<string, any>
}

interface Template {
  id: string
  name: string
}

interface Props {
  slides: Slide[]
  currentSlide: number
  templates: Template[]
}

withDefaults(defineProps<Props>(), {
  slides: () => [],
  currentSlide: 0,
  templates: () => []
})

defineEmits<{
  (e: 'select-slide', index: number): void
  (e: 'apply-template', templateId: string): void
  (e: 'add-slide'): void
}>()
</script>

<style scoped>
.sidebar {
  min-width: var(--sidebar-width, 240px);
  max-width: var(--sidebar-width, 240px);
}

.slides-list {
  scrollbar-width: thin;
  scrollbar-color: theme('colors.gray.300') theme('colors.gray.100');
}

.slides-list::-webkit-scrollbar {
  width: 6px;
}

.slides-list::-webkit-scrollbar-track {
  background: theme('colors.gray.100');
}

.slides-list::-webkit-scrollbar-thumb {
  background-color: theme('colors.gray.300');
  border-radius: 3px;
}
</style>