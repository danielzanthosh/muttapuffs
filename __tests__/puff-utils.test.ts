import { describe, it, expect } from 'vitest';
import { 
  formatReviewDate, 
  calculateOverallRating, 
  getPuffBadge, 
  getScamAlerts, 
  formatPrice 
} from '../lib/puff-utils';

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

describe('calculateOverallRating', () => {
  it('calculates the correct overall rating using weightings', () => {
    // egg: 35%, taste: 25%, freshness: 20%, price: 20%
    // egg=8, taste=6, freshness=5, price=7, scam=2
    // base = (8 * 0.35) + (6 * 0.25) + (5 * 0.2) + (7 * 0.2) = 2.8 + 1.5 + 1.0 + 1.4 = 6.7
    // reduction = 2 * 0.1 = 0.2
    // overall = 6.7 - 0.2 = 6.5
    expect(calculateOverallRating({
      egg: 8,
      taste: 6,
      freshness: 5,
      price: 7,
      scam: 2
    })).toBeCloseTo(6.5, 5);
  });

  it('handles perfect score scenarios', () => {
    expect(calculateOverallRating({
      egg: 10,
      taste: 10,
      freshness: 10,
      price: 10,
      scam: 0
    })).toBe(10);
  });

  it('clamps output value to a minimum of 0', () => {
    expect(calculateOverallRating({
      egg: 0,
      taste: 0,
      freshness: 0,
      price: 0,
      scam: 10
    })).toBe(0);
  });

  it('clamps output value to a maximum of 10 even if input parameters exceed standard ranges', () => {
    expect(calculateOverallRating({
      egg: 12,
      taste: 12,
      freshness: 12,
      price: 12,
      scam: 0
    })).toBe(10);
  });
});

describe('getPuffBadge', () => {
  it('assigns Certified Mutta badge when egg score is high and scam level is low', () => {
    expect(getPuffBadge({ egg: 8, taste: 5, freshness: 5, price: 5, scam: 2 })).toBe('Certified Mutta');
    expect(getPuffBadge({ egg: 10, taste: 5, freshness: 5, price: 5, scam: 0 })).toBe('Certified Mutta');
  });

  it('assigns Egg Missing Case badge when egg score is low and scam level is high', () => {
    expect(getPuffBadge({ egg: 2, taste: 5, freshness: 5, price: 5, scam: 8 })).toBe('Egg Missing Case');
    expect(getPuffBadge({ egg: 0, taste: 5, freshness: 5, price: 5, scam: 10 })).toBe('Egg Missing Case');
  });

  it('assigns Cold Case Puff badge when freshness is low', () => {
    // If Certified Mutta condition also met, it prioritizes Certified Mutta
    expect(getPuffBadge({ egg: 5, taste: 5, freshness: 3, price: 5, scam: 5 })).toBe('Cold Case Puff');
    expect(getPuffBadge({ egg: 5, taste: 5, freshness: 1, price: 5, scam: 5 })).toBe('Cold Case Puff');
  });

  it('assigns Flavor Witness Approved badge when taste is high', () => {
    expect(getPuffBadge({ egg: 5, taste: 8, freshness: 5, price: 5, scam: 5 })).toBe('Flavor Witness Approved');
  });

  it('assigns Budget Hero badge when price is high', () => {
    expect(getPuffBadge({ egg: 5, taste: 5, freshness: 5, price: 8, scam: 5 })).toBe('Budget Hero');
  });

  it('defaults to Puff Report Filed when no other conditions are met', () => {
    expect(getPuffBadge({ egg: 5, taste: 5, freshness: 5, price: 5, scam: 5 })).toBe('Puff Report Filed');
  });

  it('verifies conditional priority mapping order', () => {
    // Both egg >= 8/scam <= 2 (Certified Mutta) and freshness <= 3 (Cold Case Puff) are met.
    // Since Certified Mutta is checked first, it should take precedence.
    expect(getPuffBadge({ egg: 8, taste: 5, freshness: 3, price: 5, scam: 2 })).toBe('Certified Mutta');
  });
});

describe('getScamAlerts', () => {
  it('identifies High Scam Probability', () => {
    expect(getScamAlerts({ egg: 5, freshness: 5, scam: 7 })).toContain('High Scam Probability');
  });

  it('identifies Low Egg Evidence', () => {
    expect(getScamAlerts({ egg: 3, freshness: 5, scam: 5 })).toContain('Low Egg Evidence');
  });

  it('identifies Freshness Under Investigation', () => {
    expect(getScamAlerts({ egg: 5, freshness: 3, scam: 5 })).toContain('Freshness Under Investigation');
  });

  it('returns empty array when ratings are good', () => {
    expect(getScamAlerts({ egg: 8, freshness: 8, scam: 1 })).toEqual([]);
  });

  it('handles multiple concurrent alerts', () => {
    const alerts = getScamAlerts({ egg: 2, freshness: 2, scam: 8 });
    expect(alerts).toHaveLength(3);
    expect(alerts).toContain('High Scam Probability');
    expect(alerts).toContain('Low Egg Evidence');
    expect(alerts).toContain('Freshness Under Investigation');
  });
});

describe('formatPrice', () => {
  it('formats rupees correctly with symbol and no decimal places', () => {
    const formatted = formatPrice(15);
    // Replace non-breaking spaces with standard space for matching
    const sanitized = formatted.replace(/\u00a0/g, ' ');
    expect(sanitized).toMatch(/₹\s*15/);
  });

  it('handles zero gracefully', () => {
    const formatted = formatPrice(0);
    const sanitized = formatted.replace(/\u00a0/g, ' ');
    expect(sanitized).toMatch(/₹\s*0/);
  });
});

