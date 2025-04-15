import { defineStore } from 'pinia';

export interface Slide {
  id: string;
  content: {
    text?: string;
    layout: string;
    elements: Array<{
      type: string;
      content: any;
      position: { x: number; y: number };
      size: { width: number; height: number };
    }>;
  };
}

export interface PresentationState {
  slides: Slide[];
  currentSlideIndex: number;
  title: string;
  lastSaved: string;
}

export const usePresentationStore = defineStore('presentation', {
  state: (): PresentationState => ({
    slides: [],
    currentSlideIndex: 0,
    title: 'Untitled Presentation',
    lastSaved: new Date().toISOString(),
  }),

  getters: {
    currentSlide: (state) => state.slides[state.currentSlideIndex],
    slideCount: (state) => state.slides.length,
  },

  actions: {
    addSlide(layout: string = 'blank') {
      const newSlide: Slide = {
        id: crypto.randomUUID(),
        content: {
          layout,
          elements: [],
        },
      };
      this.slides.push(newSlide);
    },

    removeSlide(index: number) {
      if (index >= 0 && index < this.slides.length) {
        this.slides.splice(index, 1);
        if (this.currentSlideIndex >= this.slides.length) {
          this.currentSlideIndex = Math.max(0, this.slides.length - 1);
        }
      }
    },

    setCurrentSlide(index: number) {
      if (index >= 0 && index < this.slides.length) {
        this.currentSlideIndex = index;
      }
    },

    addElement(element: { type: string; content: any }) {
      if (!this.currentSlide) return;
      
      this.currentSlide.content.elements.push({
        ...element,
        position: { x: 0, y: 0 },
        size: { width: 200, height: 100 },
      });
    },

    updateElement(slideId: string, elementIndex: number, updates: Partial<any>) {
      const slide = this.slides.find(s => s.id === slideId);
      if (slide && slide.content.elements[elementIndex]) {
        slide.content.elements[elementIndex] = {
          ...slide.content.elements[elementIndex],
          ...updates,
        };
      }
    },

    savePresentation() {
      this.lastSaved = new Date().toISOString();
      localStorage.setItem('presentation', JSON.stringify({
        slides: this.slides,
        title: this.title,
      }));
    },

    loadPresentation() {
      const saved = localStorage.getItem('presentation');
      if (saved) {
        const data = JSON.parse(saved);
        this.slides = data.slides;
        this.title = data.title;
        this.currentSlideIndex = 0;
      } else {
        // Initialize with a blank slide
        this.addSlide('blank');
      }
    },
  },
});
