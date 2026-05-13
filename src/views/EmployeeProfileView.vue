<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import type { Employee } from '@/data/employee'
import { useEmployeesStore } from '@/stores/employees'
import { validateEmployeeForm, type EmployeeFormInput } from '@/utils/employeeFormValidation'
import DeleteEmployeeConfirm from '@/components/DeleteEmployeeConfirm.vue'

const route = useRoute()
const router = useRouter()
const employees = useEmployeesStore()

const code = computed(() => String(route.params.code ?? ''))
const isEdit = computed(() => route.name === 'employee-edit')
const employee = computed(() => (code.value ? employees.findByCode(code.value) : undefined))

function employeeToForm(emp: Employee): EmployeeFormInput {
  return {
    code: emp.code,
    fullName: emp.fullName,
    occupation: emp.occupation,
    department: emp.department,
    dateOfEmployment: emp.dateOfEmployment,
    terminationDate: emp.terminationDate ?? '',
  }
}

const form = reactive<EmployeeFormInput>({
  code: '',
  fullName: '',
  occupation: '',
  department: '',
  dateOfEmployment: '',
  terminationDate: '',
})

const touched = reactive({
  code: false,
  fullName: false,
  occupation: false,
  department: false,
  dateOfEmployment: false,
  terminationDate: false,
})

const submitAttempted = ref(false)
const fieldErrors = ref<Record<string, string>>({})
const saveError = ref('')
const showDeleteDialog = ref(false)
const deleteFlowError = ref('')

const existingCodesExceptCurrent = computed(() => {
  const s = new Set(employees.list.map((e) => e.code))
  s.delete(code.value)
  return s
})

function resetFormUi() {
  submitAttempted.value = false
  fieldErrors.value = {}
  touched.code = false
  touched.fullName = false
  touched.occupation = false
  touched.department = false
  touched.dateOfEmployment = false
  touched.terminationDate = false
}

watch(
  () => [code.value, route.name, employee.value] as const,
  ([, name, emp]) => {
    saveError.value = ''
    deleteFlowError.value = ''
    if (name === 'employee-edit' && emp) {
      Object.assign(form, employeeToForm(emp))
      resetFormUi()
    }
  },
  { immediate: true },
)

function showError(field: keyof typeof touched): boolean {
  return touched[field] || submitAttempted.value
}

function errorFor(field: string): string | undefined {
  if (!showError(field as keyof typeof touched)) return undefined
  return fieldErrors.value[field]
}

function formatDateLabel(iso: string | null | undefined): string {
  if (iso == null || iso === '') return '—'
  return iso
}

function onSaveEdit() {
  submitAttempted.value = true
  saveError.value = ''
  const result = validateEmployeeForm(form, {
    existingCodes: existingCodesExceptCurrent.value,
  })
  fieldErrors.value = result.fieldErrors
  if (!result.valid || !result.normalized) return

  const next: Employee = { ...result.normalized, code: code.value }
  if (!employees.updateEmployee(code.value, next)) {
    saveError.value =
      'Could not save changes. This employee may have been removed or the list may be out of sync.'
    return
  }

  router.push({ name: 'employee-view', params: { code: code.value } })
}

function onCancelEdit() {
  router.push({ name: 'employee-view', params: { code: code.value } })
}

function goToEdit() {
  router.push({ name: 'employee-edit', params: { code: code.value } })
}

function openDeleteDialog() {
  deleteFlowError.value = ''
  showDeleteDialog.value = true
}

function closeDeleteDialog() {
  showDeleteDialog.value = false
}

function confirmDelete() {
  if (!employee.value) return
  if (!employees.removeEmployee(code.value)) {
    showDeleteDialog.value = false
    deleteFlowError.value = 'Could not delete this employee. They may have already been removed.'
    return
  }
  showDeleteDialog.value = false
  router.push({ name: 'employees' })
}
</script>

<template>
  <main class="mx-auto max-w-lg px-4 py-8">
    <template v-if="!employee">
      <h1 class="text-2xl font-semibold text-slate-900">Employee not found</h1>
      <p class="mt-2 text-slate-600">
        Invalid or removed code. This employee may have been deleted, or the link is out of date.
      </p>
      <RouterLink
        :to="{ name: 'employees' }"
        class="mt-6 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        Back to list
      </RouterLink>
    </template>

    <template v-else-if="!isEdit">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <h1 class="text-2xl font-semibold text-slate-900">{{ employee.fullName }}</h1>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="goToEdit"
          >
            Edit
          </button>
          <button
            type="button"
            class="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            @click="openDeleteDialog"
          >
            Delete
          </button>
          <RouterLink
            :to="{ name: 'employees' }"
            class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back
          </RouterLink>
        </div>
      </div>

      <div
        v-if="deleteFlowError"
        class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        role="alert"
      >
        {{ deleteFlowError }}
      </div>

      <dl class="mt-8 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
        <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Full name</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ employee.fullName }}</dd>
        </div>
        <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Code</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ employee.code }}</dd>
        </div>
        <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Occupation</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ employee.occupation }}</dd>
        </div>
        <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Department</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ employee.department }}</dd>
        </div>
        <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Date of employment</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ formatDateLabel(employee.dateOfEmployment) }}</dd>
        </div>
        <div class="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt class="text-sm font-medium text-slate-500">Termination date</dt>
          <dd class="text-sm text-slate-900 sm:col-span-2">{{ formatDateLabel(employee.terminationDate) }}</dd>
        </div>
      </dl>
    </template>

    <template v-else>
      <h1 class="text-2xl font-semibold text-slate-900">Edit employee</h1>
      <p class="mt-1 text-sm text-slate-600">{{ employee.fullName }} ({{ employee.code }})</p>

      <div
        v-if="saveError"
        class="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        role="alert"
      >
        {{ saveError }}
      </div>

      <form class="mt-8 space-y-5" novalidate @submit.prevent="onSaveEdit">
        <div>
          <label for="profile-code" class="block text-sm font-medium text-slate-700">Code</label>
          <input
            id="profile-code"
            v-model="form.code"
            type="text"
            disabled
            class="mt-1 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-slate-600"
            aria-readonly="true"
          />
        </div>

        <div>
          <label for="profile-full-name" class="block text-sm font-medium text-slate-700">Full name *</label>
          <input
            id="profile-full-name"
            v-model="form.fullName"
            type="text"
            autocomplete="name"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('fullName') }"
            :aria-invalid="errorFor('fullName') ? 'true' : 'false'"
            :aria-describedby="errorFor('fullName') ? 'profile-full-name-error' : undefined"
            @blur="touched.fullName = true"
          />
          <p
            v-if="errorFor('fullName')"
            id="profile-full-name-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ errorFor('fullName') }}
          </p>
        </div>

        <div>
          <label for="profile-occupation" class="block text-sm font-medium text-slate-700">Occupation *</label>
          <input
            id="profile-occupation"
            v-model="form.occupation"
            type="text"
            autocomplete="organization-title"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('occupation') }"
            :aria-invalid="errorFor('occupation') ? 'true' : 'false'"
            :aria-describedby="errorFor('occupation') ? 'profile-occupation-error' : undefined"
            @blur="touched.occupation = true"
          />
          <p
            v-if="errorFor('occupation')"
            id="profile-occupation-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ errorFor('occupation') }}
          </p>
        </div>

        <div>
          <label for="profile-department" class="block text-sm font-medium text-slate-700">Department *</label>
          <input
            id="profile-department"
            v-model="form.department"
            type="text"
            autocomplete="off"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('department') }"
            :aria-invalid="errorFor('department') ? 'true' : 'false'"
            :aria-describedby="errorFor('department') ? 'profile-department-error' : undefined"
            @blur="touched.department = true"
          />
          <p
            v-if="errorFor('department')"
            id="profile-department-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ errorFor('department') }}
          </p>
        </div>

        <div>
          <label for="profile-date-employment" class="block text-sm font-medium text-slate-700">
            Date of employment
          </label>
          <p class="mt-0.5 text-xs text-slate-500">Leave blank to use today’s date.</p>
          <input
            id="profile-date-employment"
            v-model="form.dateOfEmployment"
            type="date"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('dateOfEmployment') }"
            :aria-invalid="errorFor('dateOfEmployment') ? 'true' : 'false'"
            :aria-describedby="errorFor('dateOfEmployment') ? 'profile-date-employment-error' : undefined"
            @blur="touched.dateOfEmployment = true"
          />
          <p
            v-if="errorFor('dateOfEmployment')"
            id="profile-date-employment-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ errorFor('dateOfEmployment') }}
          </p>
        </div>

        <div>
          <label for="profile-date-termination" class="block text-sm font-medium text-slate-700">
            Termination date
          </label>
          <p class="mt-0.5 text-xs text-slate-500">Optional. Leave blank if not applicable.</p>
          <input
            id="profile-date-termination"
            v-model="form.terminationDate"
            type="date"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('terminationDate') }"
            :aria-invalid="errorFor('terminationDate') ? 'true' : 'false'"
            :aria-describedby="errorFor('terminationDate') ? 'profile-date-termination-error' : undefined"
            @blur="touched.terminationDate = true"
          />
          <p
            v-if="errorFor('terminationDate')"
            id="profile-date-termination-error"
            class="mt-1 text-sm text-red-600"
            role="alert"
          >
            {{ errorFor('terminationDate') }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3 pt-4">
          <button
            type="submit"
            class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
          <button
            type="button"
            class="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            @click="onCancelEdit"
          >
            Cancel
          </button>
        </div>
      </form>
    </template>
  </main>
  <DeleteEmployeeConfirm
    :open="showDeleteDialog"
    :employee-name="employee?.fullName ?? ''"
    @cancel="closeDeleteDialog"
    @confirm="confirmDelete"
  />
</template>
