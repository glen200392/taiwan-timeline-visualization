<template>
  <div class="editor-view h-screen flex">
    <!-- 側邊欄 -->
    <Sidebar
      :slides="slides"
      :current-slide="currentSlideIndex"
      :templates="availableTemplates"
      @select-slide="selectSlide"
      @apply-template="applyTemplate"
      @add-slide="addSlide"
    />

    <!-- 主編輯區 -->
    <div class="flex-1 flex flex-col h-full">
      <!-- 工具欄 -->
      <ToolBar
        :active-formats="activeFormats"
        :current-alignment="currentAlignment"
        @format="applyFormat"
        @align="applyAlignment"
        @insert="insertElement"
      />

      <!-- 編輯區域 -->
      <div class="flex-1 bg-gray-100 p-8 overflow-auto">
        <SlideCanvas
          v-if="currentSlide"
          :width="960"
          :height="540"
          @click="handleCanvasClick">
          <!-- 當前幻燈片內容 -->
          <template v-for="(element, index) in currentSlide.elements" :key="index">
            <div
              :class="{ 
                'selected': selectedElement === index,
                'absolute': true
              }"
              :style="{
                left: `${element.position?.x || 0}px`,
                top: `${element.position?.y || 0}px`,
                width: `${element.size?.width || 'auto'}`,
                height: `${element.size?.height || 'auto'}`,
                ...element.style
              }"
              @click.stop="selectElement(index)"
            >
              <component
                :is="element.type"
                v-bind="element.content"
              />
            </div>
          </template>
        </SlideCanvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePresentationStore } from '@/stores/presentation'
import Sidebar from '@/components/layout/Sidebar.vue'
import ToolBar from '@/components/editor/ToolBar.vue'
import SlideCanvas from '@/components/editor/SlideCanvas.vue'

// Initialize store
const store = usePresentationStore()
const { slides, currentSlideIndex, title } = storeToRefs(store)

// Load presentation on mount
onMounted(() => {
  store.loadPresentation()
})

// 可用模板
const availableTemplates = [
  { id: 'title', name: '標題頁' },
  { id: 'content', name: '內容頁' },
  { id: 'image', name: '圖片頁' },
  { id: 'chart', name: '圖表頁' }
]

// 計算當前幻燈片
const currentSlide = computed(() => store.currentSlide)

// 當前選中的元素索引
const selectedElement = ref(-1)

// 當前活動的格式
const activeFormats = ref(['bold'])

// 當前對齊方式
const currentAlignment = ref('center')

// 選擇幻燈片
function selectSlide(index: number) {
  store.setCurrentSlide(index)
  selectedElement.value = -1
}

// 應用模板
function applyTemplate(templateId: string) {
  store.addSlide(templateId);
  store.setCurrentSlide(store.slideCount - 1);
}

// 添加新幻燈片
function addSlide() {
  store.addSlide();
  store.setCurrentSlide(store.slideCount - 1);
}

// 應用格式
function applyFormat(format: string) {
  if (selectedElement.value === -1 || !currentSlide.value) return

  const element = currentSlide.value.elements[selectedElement.value]
  const style = { ...element.style }

  if (activeFormats.value.includes(format)) {
    activeFormats.value = activeFormats.value.filter(f => f !== format)
    delete style[format]
  } else {
    activeFormats.value.push(format)
    style[format] = true
  }

  store.updateElement(currentSlide.value.id, selectedElement.value, { style })
  store.savePresentation()
}

// 應用對齊方式
function applyAlignment(alignment: string) {
  if (selectedElement.value === -1 || !currentSlide.value) return

  const element = currentSlide.value.elements[selectedElement.value]
  const style = {
    ...element.style,
    textAlign: alignment
  }

  store.updateElement(currentSlide.value.id, selectedElement.value, { style })
  store.savePresentation()
  currentAlignment.value = alignment
}

// 選擇元素
function selectElement(index: number) {
  if (!currentSlide.value) return
  
  selectedElement.value = index
  const element = currentSlide.value.elements[index]
  
  // 更新工具欄狀態
  activeFormats.value = Object.keys(element.style || {}).filter(
    key => ['bold', 'italic', 'underline'].includes(key) && element.style[key]
  )
  currentAlignment.value = element.style?.textAlign || 'left'
}

// 點擊畫布
function handleCanvasClick() {
  selectedElement.value = -1
  activeFormats.value = []
  currentAlignment.value = 'left'
}

</script>

<style scoped>
.selected {
  outline: 2px solid theme('colors.primary');
}
</style>
