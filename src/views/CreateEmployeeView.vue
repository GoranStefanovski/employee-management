<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeesStore } from '@/stores/employees'
import { validateEmployeeForm, type EmployeeFormInput } from '@/utils/employeeFormValidation'

const router = useRouter()
const employees = useEmployeesStore()

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

const existingCodes = computed(() => new Set(employees.list.map((e) => e.code)))

function showError(field: keyof typeof touched): boolean {
  return touched[field] || submitAttempted.value
}

function errorFor(field: string): string | undefined {
  if (!showError(field as keyof typeof touched)) return undefined
  return fieldErrors.value[field]
}

function onSave() {
  submitAttempted.value = true
  const result = validateEmployeeForm(form, { existingCodes: existingCodes.value })
  fieldErrors.value = result.fieldErrors

  if (!result.valid || !result.normalized) return

  const added = employees.addEmployee(result.normalized)
  if (!added) {
    fieldErrors.value = { ...fieldErrors.value, code: 'This employee code is already in use.' }
    return
  }

  router.push({ name: 'employees' })
}

function onCancel() {
  router.push({ name: 'employees' })
}
</script>

<template>
  <main class="mx-auto max-w-lg px-4 py-8">
    <h1 class="text-2xl font-semibold text-slate-900">Create employee</h1>
    <p class="mt-1 text-sm text-slate-600">Required fields are marked with an asterisk.</p>

    <form class="mt-8 space-y-5" novalidate @submit.prevent="onSave">
      <div>
        <label for="emp-code" class="block text-sm font-medium text-slate-700">Code *</label>
        <input
          id="emp-code"
          v-model="form.code"
          type="text"
          autocomplete="off"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('code') }"
          :aria-invalid="errorFor('code') ? 'true' : 'false'"
          :aria-describedby="errorFor('code') ? 'emp-code-error' : undefined"
          @blur="touched.code = true"
        />
        <p v-if="errorFor('code')" id="emp-code-error" class="mt-1 text-sm text-red-600" role="alert">
          {{ errorFor('code') }}
        </p>
      </div>

      <div>
        <label for="emp-full-name" class="block text-sm font-medium text-slate-700">Full name *</label>
        <input
          id="emp-full-name"
          v-model="form.fullName"
          type="text"
          autocomplete="name"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('fullName') }"
          :aria-invalid="errorFor('fullName') ? 'true' : 'false'"
          :aria-describedby="errorFor('fullName') ? 'emp-full-name-error' : undefined"
          @blur="touched.fullName = true"
        />
        <p
          v-if="errorFor('fullName')"
          id="emp-full-name-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errorFor('fullName') }}
        </p>
      </div>

      <div>
        <label for="emp-occupation" class="block text-sm font-medium text-slate-700">Occupation *</label>
        <input
          id="emp-occupation"
          v-model="form.occupation"
          type="text"
          autocomplete="organization-title"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('occupation') }"
          :aria-invalid="errorFor('occupation') ? 'true' : 'false'"
          :aria-describedby="errorFor('occupation') ? 'emp-occupation-error' : undefined"
          @blur="touched.occupation = true"
        />
        <p
          v-if="errorFor('occupation')"
          id="emp-occupation-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errorFor('occupation') }}
        </p>
      </div>

      <div>
        <label for="emp-department" class="block text-sm font-medium text-slate-700">Department *</label>
        <input
          id="emp-department"
          v-model="form.department"
          type="text"
          autocomplete="off"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('department') }"
          :aria-invalid="errorFor('department') ? 'true' : 'false'"
          :aria-describedby="errorFor('department') ? 'emp-department-error' : undefined"
          @blur="touched.department = true"
        />
        <p
          v-if="errorFor('department')"
          id="emp-department-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errorFor('department') }}
        </p>
      </div>

      <div>
        <label for="emp-date-employment" class="block text-sm font-medium text-slate-700">
          Date of employment
        </label>
        <p class="mt-0.5 text-xs text-slate-500">Leave blank to use today’s date.</p>
        <input
          id="emp-date-employment"
          v-model="form.dateOfEmployment"
          type="date"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('dateOfEmployment') }"
          :aria-invalid="errorFor('dateOfEmployment') ? 'true' : 'false'"
          :aria-describedby="errorFor('dateOfEmployment') ? 'emp-date-employment-error' : undefined"
          @blur="touched.dateOfEmployment = true"
        />
        <p
          v-if="errorFor('dateOfEmployment')"
          id="emp-date-employment-error"
          class="mt-1 text-sm text-red-600"
          role="alert"
        >
          {{ errorFor('dateOfEmployment') }}
        </p>
      </div>

      <div>
        <label for="emp-date-termination" class="block text-sm font-medium text-slate-700">
          Termination date
        </label>
        <p class="mt-0.5 text-xs text-slate-500">Optional. Leave blank if not applicable.</p>
        <input
          id="emp-date-termination"
          v-model="form.terminationDate"
          type="date"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-500': errorFor('terminationDate') }"
          :aria-invalid="errorFor('terminationDate') ? 'true' : 'false'"
          :aria-describedby="errorFor('terminationDate') ? 'emp-date-termination-error' : undefined"
          @blur="touched.terminationDate = true"
        />
        <p
          v-if="errorFor('terminationDate')"
          id="emp-date-termination-error"
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
          @click="onCancel"
        >
          Cancel
        </button>
      </div>
    </form>
  </main>
</template>
