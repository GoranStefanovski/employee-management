import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './assets/main.css'
import App from './App.vue'
import router from './router'
import { useEmployeesStore } from '@/stores/employees'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

useEmployeesStore(pinia).loadFromSample()

app.mount('#app')
