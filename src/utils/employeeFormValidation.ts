import type { Employee } from '@/data/employee'

/** Raw form strings before normalization to `Employee`. */
export interface EmployeeFormInput {
  code: string
  fullName: string
  occupation: string
  department: string
  dateOfEmployment: string
  terminationDate: string
}

export interface EmployeeFormValidationResult {
  valid: boolean
  fieldErrors: Record<string, string>
  /** Present only when `valid` is true */
  normalized?: Employee
}

function isValidCalendarDate(yyyyMmDd: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd)) return false
  const y = Number(yyyyMmDd.slice(0, 4))
  const m = Number(yyyyMmDd.slice(5, 7))
  const d = Number(yyyyMmDd.slice(8, 10))
  const dt = new Date(y, m - 1, d)
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
}

/** Local calendar today as YYYY-MM-DD (used when employment date is left blank). */
function localTodayYyyyMmDd(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function validateEmployeeForm(
  input: EmployeeFormInput,
  options?: { existingCodes?: ReadonlySet<string> },
): EmployeeFormValidationResult {
  const fieldErrors: Record<string, string> = {}

  const code = input.code.trim()
  if (!code) {
    fieldErrors.code = 'Code is required.'
  } else if (options?.existingCodes?.has(code)) {
    fieldErrors.code = 'This employee code is already in use.'
  }

  if (!input.fullName.trim()) {
    fieldErrors.fullName = 'Full name is required.'
  }

  if (!input.occupation.trim()) {
    fieldErrors.occupation = 'Occupation is required.'
  }

  if (!input.department.trim()) {
    fieldErrors.department = 'Department is required.'
  }

  let dateOfEmployment = input.dateOfEmployment.trim()
  if (!dateOfEmployment) {
    // Only four fields are required by product rules; blank employment defaults to today.
    dateOfEmployment = localTodayYyyyMmDd()
  } else if (!isValidCalendarDate(dateOfEmployment)) {
    fieldErrors.dateOfEmployment = 'Enter a valid date.'
  }

  let terminationDate: string | null = null
  const termRaw = input.terminationDate.trim()
  if (termRaw) {
    if (!isValidCalendarDate(termRaw)) {
      fieldErrors.terminationDate = 'Enter a valid date.'
    } else {
      terminationDate = termRaw
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { valid: false, fieldErrors }
  }

  const normalized: Employee = {
    code,
    fullName: input.fullName.trim(),
    occupation: input.occupation.trim(),
    department: input.department.trim(),
    dateOfEmployment,
    terminationDate,
  }

  return { valid: true, fieldErrors, normalized }
}
