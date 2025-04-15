// 幻燈片元素類型
export interface SlideElement {
  component: string
  props: Record<string, any>
}

// 幻燈片類型
export interface Slide {
  elements: SlideElement[]
}

// 模板類型
export interface Template {
  id: string
  name: string
  elements: SlideElement[]
}

// 格式類型
export type FormatType = 'bold' | 'italic' | 'underline'

// 對齊類型
export type AlignType = 'left' | 'center' | 'right'

// 插入類型
export type InsertType = 'image' | 'chart' | 'shape'