<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const employeesSectionActive = computed(() => {
  const n = route.name
  return (
    n === 'employees' ||
    n === 'employee-create' ||
    n === 'employee-view' ||
    n === 'employee-edit'
  )
})
</script>

<template>
  <div class="flex min-h-screen flex-col bg-slate-50">
    <header class="border-b border-slate-200 bg-white shadow-sm">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3 sm:px-6 lg:px-8"
      >
        <div class="flex min-w-0 flex-1 items-center gap-6 sm:gap-8">
          <RouterLink
            :to="{ name: 'employees' }"
            class="group flex shrink-0 items-baseline gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-sm"
          >
            <span
              class="text-lg font-bold tracking-tight text-purple-900 group-hover:text-purple-800 sm:text-xl"
            >
              Purple Cross
            </span>
            <span class="hidden text-xs font-medium uppercase tracking-wider text-slate-400 sm:inline">
              Ltd
            </span>
          </RouterLink>

        </div>

        <div
          class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-1.5 pr-3 shadow-sm"
          role="status"
          aria-label="Signed in user"
        >
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white"
            aria-hidden="true"
          >
            PC
          </span>
          <span class="max-w-[10rem] truncate text-sm font-medium text-slate-800 sm:max-w-none">
            Casey Admin
          </span>
        </div>
      </div>
    </header>

    <div class="flex-1">
      <RouterView />
    </div>
  </div>
</template>
