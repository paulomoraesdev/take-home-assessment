/**
 * Utility functions for date formatting
 */

/**
 * Get the ordinal suffix for a day (1st, 2nd, 3rd, 4th, etc.)
 */
function getOrdinalSuffix(day: number): string {
  const remainder10 = day % 10
  const remainder100 = day % 100
  
  if (remainder100 >= 11 && remainder100 <= 13) {
    return 'th'
  }
  
  switch (remainder10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

/**
 * Format a date to "Month Dayth, Year" format (e.g., "January 25th, 1980")
 * Handles timezone issues to preserve the actual date selected by the user
 */
export function formatDateToMonthDayYear(date: Date | string): string {
  let dateObj: Date

  if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string') {
    // For YYYY-MM-DD format, create date at noon to avoid timezone issues
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = date.split('-').map(Number)
      dateObj = new Date(year, month - 1, day, 12, 0, 0)
    }
    // For ISO strings ending with T00:00:00.000Z (midnight UTC), extract just the date part
    else if (date.match(/^\d{4}-\d{2}-\d{2}T00:00:00\.000Z$/)) {
      const dateOnly = date.split('T')[0]
      const [year, month, day] = dateOnly.split('-').map(Number)
      dateObj = new Date(year, month - 1, day, 12, 0, 0)
    }
    else {
      dateObj = new Date(date)
    }
  } else {
    dateObj = new Date(date)
  }

  // Get month name
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' })

  // Get day with ordinal suffix
  const day = dateObj.getDate()
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`

  // Get year
  const year = dateObj.getFullYear()

  return `${monthName} ${dayWithSuffix}, ${year}`
}