/** Local calendar today as YYYY-MM-DD for string comparison (no UTC shift). */
function localTodayYyyyMmDd(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isYyyyMmDd(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s)
}

/**
 * Employment start vs today (calendar, local).
 * Future start → "Employed soon"; today or past → "Currently employed".
 */
export function getEmploymentStatusLabel(dateOfEmployment: string): 'Employed soon' | 'Currently employed' {
  if (!isYyyyMmDd(dateOfEmployment)) return 'Currently employed'
  const today = localTodayYyyyMmDd()
  if (dateOfEmployment > today) return 'Employed soon'
  return 'Currently employed'
}

/**
 * Termination row vs today.
 * No date → em dash. Future → "To be terminated". Past → "Terminated".
 * Same calendar day as today → "Terminated" (treat as no longer "upcoming").
 */
export function getTerminationLabel(terminationDate: string | null): string {
  if (terminationDate == null || terminationDate.trim() === '') return '—'
  const iso = terminationDate.trim()
  if (!isYyyyMmDd(iso)) return '—'
  const today = localTodayYyyyMmDd()
  if (iso > today) return 'To be terminated'
  return 'Terminated'
}
