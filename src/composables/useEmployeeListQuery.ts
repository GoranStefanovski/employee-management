import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import type { Employee } from '@/data/employee'
import { useEmployeesStore } from '@/stores/employees'
import { getEmploymentStatusLabel } from '@/utils/employeeDateLabels'

export type EmployeeListSortField =
  | 'fullName'
  | 'occupation'
  | 'department'
  | 'dateOfEmployment'
  | 'terminationDate'

export type EmployeeListSortDir = 'asc' | 'desc'

export type EmployeeListEmploymentFilter = '' | 'Employed soon' | 'Currently employed'

function rowMatchesSearch(emp: Employee, raw: string): boolean {
  const q = raw.trim().toLowerCase()
  if (!q) return true
  const hay = [emp.fullName, emp.code, emp.occupation, emp.department].join('\n').toLowerCase()
  return hay.includes(q)
}

/** Search, department/employment filters, and sort for the employees index list (Pinia `list` is read-only here). */
export function useEmployeeListQuery() {
  const { list } = storeToRefs(useEmployeesStore())

  const searchQuery = ref('')
  const departmentFilter = ref('')
  const employmentFilter = ref<EmployeeListEmploymentFilter>('')
  const sortField = ref<EmployeeListSortField>('fullName')
  const sortDir = ref<EmployeeListSortDir>('asc')

  const uniqueDepartments = computed(() => {
    const set = new Set(list.value.map((e) => e.department))
    return [...set].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  })

  const displayedEmployees = computed(() => {
    let rows = list.value.filter((emp) => {
      if (!rowMatchesSearch(emp, searchQuery.value)) return false
      if (departmentFilter.value && emp.department !== departmentFilter.value) return false
      if (
        employmentFilter.value &&
        getEmploymentStatusLabel(emp.dateOfEmployment) !== employmentFilter.value
      ) {
        return false
      }
      return true
    })

    const dir = sortDir.value === 'asc' ? 1 : -1
    const field = sortField.value
    rows = [...rows].sort((a, b) => {
      const va =
        field === 'terminationDate'
          ? (a.terminationDate ?? '')
          : field === 'dateOfEmployment'
            ? a.dateOfEmployment
            : a[field]
      const vb =
        field === 'terminationDate'
          ? (b.terminationDate ?? '')
          : field === 'dateOfEmployment'
            ? b.dateOfEmployment
            : b[field]
      return va.localeCompare(vb, undefined, { sensitivity: 'base', numeric: true }) * dir
    })

    return rows
  })

  const hasActiveFilters = computed(() => {
    return !!(
      searchQuery.value.trim() ||
      departmentFilter.value ||
      employmentFilter.value ||
      sortField.value !== 'fullName' ||
      sortDir.value !== 'asc'
    )
  })

  function clearFilters() {
    searchQuery.value = ''
    departmentFilter.value = ''
    employmentFilter.value = ''
    sortField.value = 'fullName'
    sortDir.value = 'asc'
  }

  return {
    searchQuery,
    departmentFilter,
    employmentFilter,
    sortField,
    sortDir,
    uniqueDepartments,
    displayedEmployees,
    hasActiveFilters,
    clearFilters,
  }
}
