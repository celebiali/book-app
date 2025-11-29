import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.scss'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

import { useBooksStore } from '@/stores/books'
const booksStore = useBooksStore()
booksStore.init()

app.mount('#app')
