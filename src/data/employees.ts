import type { Employee } from './employee'
import raw from './employees.json'

/** Immutable snapshot of the bundled sample data (clone in the store when mutating). */
export const sampleEmployees: readonly Employee[] = raw as Employee[]
