import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 導入全局樣式
import './assets/styles/main.css'

// 創建應用實例
const app = createApp(App)

// 使用路由
app.use(router)

// 使用狀態管理
app.use(createPinia())

// 掛載應用
app.mount('#app')