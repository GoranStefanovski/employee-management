import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Employee } from '@/data/employee'
import { sampleEmployees } from '@/data/employees'

export const useEmployeesStore = defineStore('employees', () => {
  const list = ref<Employee[]>([])

  /** Replace in-memory list with a copy of the sample JSON (for dev / reset). */
  function loadFromSample() {
    list.value = sampleEmployees.map((e) => ({ ...e }))
  }

  const count = computed(() => list.value.length)

  /** @returns whether the employee was added; false if `code` already exists */
  function addEmployee(employee: Employee): boolean {
    if (list.value.some((e) => e.code === employee.code)) {
      return false
    }
    list.value.push({ ...employee })
    return true
  }

  function findByCode(code: string): Employee | undefined {
    return list.value.find((e) => e.code === code)
  }

  /** Replace row matching `code` with a clone; URL param always wins for `code` so bookmarks stay consistent. */
  function updateEmployee(code: string, employee: Employee): boolean {
    const i = list.value.findIndex((e) => e.code === code)
    if (i === -1) return false
    list.value[i] = { ...employee, code }
    return true
  }

  /** Remove the row with this `code`. @returns false if not found. */
  function removeEmployee(code: string): boolean {
    const i = list.value.findIndex((e) => e.code === code)
    if (i === -1) return false
    list.value.splice(i, 1)
    return true
  }

  return { list, count, loadFromSample, addEmployee, findByCode, updateEmployee, removeEmployee }
})
