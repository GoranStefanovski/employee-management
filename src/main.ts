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

// Seed list once per session so deep links have data and navigating away from create/index does not wipe in-memory rows.
useEmployeesStore(pinia).loadFromSample()

app.mount('#app')
