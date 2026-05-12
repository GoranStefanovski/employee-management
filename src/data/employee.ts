/**
 * Employee row shape from the Purple Cross sample JSON.
 * Dates are ISO calendar strings (YYYY-MM-DD); parse in UI/store when needed.
 */
export interface Employee {
  code: string
  fullName: string
  occupation: string
  department: string
  dateOfEmployment: string
  terminationDate: string | null
}
