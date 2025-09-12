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
 */
export function formatDateToMonthDayYear(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // Get month name
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' })
  
  // Get day with ordinal suffix
  const day = dateObj.getDate()
  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`
  
  // Get year
  const year = dateObj.getFullYear()
  
  return `${monthName} ${dayWithSuffix}, ${year}`
}