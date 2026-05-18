import { describe, it, expect } from 'vitest';
import { formatReviewDate } from '../lib/puff-utils';

describe('formatReviewDate', () => {
  it('formats dates correctly', () => {
    expect(formatReviewDate('2023-10-15')).toBe('15 Oct 2023');
  });

  it('handles valid date formats', () => {
    expect(formatReviewDate('2024-02-29')).toBe('29 Feb 2024'); // Leap year
    expect(formatReviewDate('2024-01-01T00:00:00.000Z')).toBe('1 Jan 2024'); // ISO string
  });

  it('handles empty strings gracefully', () => {
    expect(formatReviewDate('')).toBe('Invalid Date');
  });

  it('handles invalid date strings gracefully', () => {
    expect(formatReviewDate('not-a-date')).toBe('Invalid Date');
  });
});
