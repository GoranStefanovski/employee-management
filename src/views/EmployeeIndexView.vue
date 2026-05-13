<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Employee } from '@/data/employee'
import DeleteEmployeeConfirm from '@/components/DeleteEmployeeConfirm.vue'
import { useEmployeesStore } from '@/stores/employees'

const employees = useEmployeesStore()

const deleteTarget = ref<Employee | null>(null)

function openDelete(emp: Employee) {
  deleteTarget.value = emp
}

function closeDelete() {
  deleteTarget.value = null
}

function confirmRowDelete() {
  const t = deleteTarget.value
  if (!t) return
  employees.removeEmployee(t.code)
  deleteTarget.value = null
}
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
        class="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-slate-800"
      >
        <span>{{ emp.fullName }}</span>
        <span class="flex shrink-0 flex-wrap items-center gap-3 text-sm">
          <RouterLink
            :to="{ name: 'employee-view', params: { code: emp.code } }"
            class="font-medium text-indigo-600 hover:text-indigo-800"
          >
            View
          </RouterLink>
          <RouterLink
            :to="{ name: 'employee-edit', params: { code: emp.code } }"
            class="font-medium text-indigo-600 hover:text-indigo-800"
          >
            Edit
          </RouterLink>
          <button
            type="button"
            class="font-medium text-red-600 hover:text-red-800"
            @click="openDelete(emp)"
          >
            Delete
          </button>
        </span>
      </li>
    </ul>
  </main>
  <DeleteEmployeeConfirm
    :open="deleteTarget !== null"
    :employee-name="deleteTarget?.fullName ?? ''"
    @cancel="closeDelete"
    @confirm="confirmRowDelete"
  />
</template>
