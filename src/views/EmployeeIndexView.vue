<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Employee } from '@/data/employee'
import DeleteEmployeeConfirm from '@/components/DeleteEmployeeConfirm.vue'
import { useEmployeesStore } from '@/stores/employees'
import { getEmploymentStatusLabel, getTerminationLabel } from '@/utils/employeeDateLabels'

const employees = useEmployeesStore()

const deleteTarget = ref<Employee | null>(null)
const listActionError = ref('')

function openDelete(emp: Employee) {
  listActionError.value = ''
  deleteTarget.value = emp
}

function closeDelete() {
  deleteTarget.value = null
}

function confirmRowDelete() {
  const t = deleteTarget.value
  if (!t) return
  if (!employees.removeEmployee(t.code)) {
    deleteTarget.value = null
    listActionError.value = 'Could not remove that employee. Try again or refresh the page.'
    return
  }
  deleteTarget.value = null
}

function employmentLabel(emp: Employee) {
  return getEmploymentStatusLabel(emp.dateOfEmployment)
}

function terminationLabel(emp: Employee) {
  return getTerminationLabel(emp.terminationDate)
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8 md:pb-20">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Employees</h1>
        <p class="mt-1 text-sm text-slate-600">{{ employees.count }} in the list</p>
      </div>
    </div>

    <div
      v-if="listActionError"
      class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      {{ listActionError }}
    </div>

    <template v-if="employees.list.length === 0">
      <div
        class="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center"
        role="status"
      >
        <p class="text-slate-700">No employees yet.</p>
        <p class="mt-2 text-sm text-slate-600">Add someone new or reload the app to restore sample data.</p>
        <RouterLink
          :to="{ name: 'employee-create' }"
          class="mt-6 inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Add employee
        </RouterLink>
      </div>
    </template>

    <template v-else>
      <div class="mt-6 space-y-4 md:hidden">
        <article
          v-for="emp in employees.list"
          :key="emp.code"
          class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h2 class="text-base font-semibold text-slate-900">{{ emp.fullName }}</h2>
          <dl class="mt-3 space-y-2 text-sm">
            <div class="flex justify-between gap-2">
              <dt class="text-slate-500">Occupation</dt>
              <dd class="text-right text-slate-900">{{ emp.occupation }}</dd>
            </div>
            <div class="flex justify-between gap-2">
              <dt class="text-slate-500">Department</dt>
              <dd class="text-right text-slate-900">{{ emp.department }}</dd>
            </div>
            <div class="flex justify-between gap-2">
              <dt class="text-slate-500">Employment</dt>
              <dd class="text-right text-slate-900">{{ employmentLabel(emp) }}</dd>
            </div>
            <div class="flex justify-between gap-2">
              <dt class="text-slate-500">Termination</dt>
              <dd class="text-right text-slate-900">{{ terminationLabel(emp) }}</dd>
            </div>
          </dl>
          <div class="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-3 text-sm">
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
          </div>
        </article>
      </div>

      <div class="mt-6 hidden overflow-x-auto rounded-lg border border-slate-200 md:block">
        <table class="min-w-[52rem] w-full divide-y divide-slate-200 bg-white text-left text-sm">
          <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th scope="col" class="px-4 py-3">Full name</th>
              <th scope="col" class="px-4 py-3">Occupation</th>
              <th scope="col" class="px-4 py-3">Department</th>
              <th scope="col" class="px-4 py-3">Employment</th>
              <th scope="col" class="px-4 py-3">Termination</th>
              <th scope="col" class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-800">
            <tr v-for="emp in employees.list" :key="emp.code" class="hover:bg-slate-50/80">
              <td class="whitespace-nowrap px-4 py-3 font-medium text-slate-900">{{ emp.fullName }}</td>
              <td class="px-4 py-3">{{ emp.occupation }}</td>
              <td class="px-4 py-3">{{ emp.department }}</td>
              <td class="px-4 py-3">{{ employmentLabel(emp) }}</td>
              <td class="px-4 py-3">{{ terminationLabel(emp) }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right">
                <RouterLink
                  :to="{ name: 'employee-view', params: { code: emp.code } }"
                  class="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  View
                </RouterLink>
                <span class="mx-2 text-slate-300" aria-hidden="true">|</span>
                <RouterLink
                  :to="{ name: 'employee-edit', params: { code: emp.code } }"
                  class="font-medium text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </RouterLink>
                <span class="mx-2 text-slate-300" aria-hidden="true">|</span>
                <button
                  type="button"
                  class="font-medium text-red-600 hover:text-red-800"
                  @click="openDelete(emp)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </main>

  <RouterLink
    :to="{ name: 'employee-create' }"
    class="fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 md:inline-flex"
    aria-label="Add employee"
  >
    Add employee
  </RouterLink>

  <DeleteEmployeeConfirm
    :open="deleteTarget !== null"
    :employee-name="deleteTarget?.fullName ?? ''"
    @cancel="closeDelete"
    @confirm="confirmRowDelete"
  />
</template>
