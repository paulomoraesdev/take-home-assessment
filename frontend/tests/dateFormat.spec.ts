import { describe, it, expect } from 'vitest';
import { formatDateToMonthDayYear } from '@/utils/dateFormat';

describe('formatDateToMonthDayYear', () => {
  it('formats date with correct ordinal suffixes', () => {
    expect(formatDateToMonthDayYear('2024-01-01')).toBe('January 1st, 2024');
    expect(formatDateToMonthDayYear('2024-01-02')).toBe('January 2nd, 2024');
    expect(formatDateToMonthDayYear('2024-01-03')).toBe('January 3rd, 2024');
    expect(formatDateToMonthDayYear('2024-01-04')).toBe('January 4th, 2024');
    expect(formatDateToMonthDayYear('2024-01-11')).toBe('January 11th, 2024');
  });
});
