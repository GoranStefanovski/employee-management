<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'

const employees = useEmployeesStore()
</script>

<template>
  <main class="mx-auto max-w-2xl px-4 py-8">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Employees</h1>
        <p class="mt-1 text-sm text-slate-600">{{ employees.count }} loaded from sample data</p>
      </div>
      <RouterLink
        :to="{ name: 'employee-create' }"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add employee
      </RouterLink>
    </div>
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
