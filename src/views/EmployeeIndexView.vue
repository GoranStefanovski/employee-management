<script setup lang="ts">
import { onMounted } from 'vue'
import { useEmployeesStore } from '@/stores/employees'

const employees = useEmployeesStore()

onMounted(() => {
  employees.loadFromSample()
})
</script>

<template>
  <main class="mx-auto max-w-2xl px-4 py-8">
    <h1 class="text-2xl font-semibold text-slate-900">Employees</h1>
    <p class="mt-1 text-sm text-slate-600">{{ employees.count }} loaded from sample data</p>
    <ul class="mt-6 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
      <li
        v-for="emp in employees.list"
        :key="emp.code"
        class="px-4 py-3 text-slate-800"
      >
        {{ emp.fullName }}
      </li>
    </ul>
  </main>
</template>
