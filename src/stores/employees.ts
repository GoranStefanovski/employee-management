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

  return { list, count, loadFromSample }
})
