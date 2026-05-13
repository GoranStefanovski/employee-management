<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { Employee } from '@/data/employee'
import DeleteEmployeeConfirm from '@/components/DeleteEmployeeConfirm.vue'
import { useEmployeeListQuery } from '@/composables/useEmployeeListQuery'
import { useEmployeesStore } from '@/stores/employees'
import { getEmploymentStatusLabel, getTerminationLabel } from '@/utils/employeeDateLabels'

const employees = useEmployeesStore()

const {
  searchQuery,
  departmentFilter,
  employmentFilter,
  sortField,
  sortDir,
  uniqueDepartments,
  displayedEmployees,
  hasActiveFilters,
  clearFilters,
} = useEmployeeListQuery()

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
        <p class="mt-1 text-sm text-slate-600">
          <template
            v-if="employees.list.length > 0 && displayedEmployees.length !== employees.list.length"
          >
            Showing {{ displayedEmployees.length }} of {{ employees.list.length }} employees
          </template>
          <template v-else-if="employees.list.length > 0">
            {{ employees.list.length }} in the list
          </template>
          <template v-else> No employees in the list </template>
        </p>
      </div>
      <RouterLink
        :to="{ name: 'employee-create' }"
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add employee
      </RouterLink>
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
      <div
        class="mt-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end"
      >
        <div class="min-w-[12rem] flex-1">
          <label for="emp-search" class="block text-xs font-medium uppercase tracking-wide text-slate-500">
            Search
          </label>
          <input
            id="emp-search"
            v-model="searchQuery"
            type="search"
            placeholder="Name, code, role, department…"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autocomplete="off"
          />
        </div>
        <div class="min-w-[10rem]">
          <label for="emp-dept" class="block text-xs font-medium uppercase tracking-wide text-slate-500">
            Department
          </label>
          <select
            id="emp-dept"
            v-model="departmentFilter"
            class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All departments</option>
            <option v-for="d in uniqueDepartments" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>
        <div class="min-w-[10rem]">
          <label for="emp-emp" class="block text-xs font-medium uppercase tracking-wide text-slate-500">
            Employment
          </label>
          <select
            id="emp-emp"
            v-model="employmentFilter"
            class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All</option>
            <option value="Employed soon">Employed soon</option>
            <option value="Currently employed">Currently employed</option>
          </select>
        </div>
        <div class="min-w-[10rem]">
          <label for="emp-sort" class="block text-xs font-medium uppercase tracking-wide text-slate-500">
            Sort by
          </label>
          <select
            id="emp-sort"
            v-model="sortField"
            class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="fullName">Full name</option>
            <option value="occupation">Occupation</option>
            <option value="department">Department</option>
            <option value="dateOfEmployment">Date of employment</option>
            <option value="terminationDate">Termination date</option>
          </select>
        </div>
        <div class="min-w-[8rem]">
          <label for="emp-order" class="block text-xs font-medium uppercase tracking-wide text-slate-500">
            Order
          </label>
          <select
            id="emp-order"
            v-model="sortDir"
            class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        <button
          v-if="hasActiveFilters"
          type="button"
          class="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <div
        v-if="displayedEmployees.length === 0"
        class="mt-6 rounded-lg border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-700"
        role="status"
      >
        <p class="font-medium">No employees match your filters.</p>
        <p class="mt-2 text-sm text-slate-600">Try changing search terms or clear filters.</p>
        <button
          type="button"
          class="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <template v-else>
        <div class="mt-6 space-y-4 md:hidden">
          <article
            v-for="emp in displayedEmployees"
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
              <tr v-for="emp in displayedEmployees" :key="emp.code" class="hover:bg-slate-50/80">
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
    </template>
  </main>

  <RouterLink
    :to="{ name: 'employee-create' }"
    class="fixed bottom-5 right-5 z-50 max-md:hidden flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
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
