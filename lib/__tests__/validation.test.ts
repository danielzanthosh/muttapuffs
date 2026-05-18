import { describe, it, expect } from 'vitest';
import { normalizeUsername, slugify } from '../validation';

describe('normalizeUsername', () => {
  it('converts to lowercase', () => {
    expect(normalizeUsername('JohnDoe')).toBe('johndoe');
  });

  it('replaces spaces with underscores', () => {
    expect(normalizeUsername('john doe')).toBe('john_doe');
    expect(normalizeUsername('john  doe')).toBe('john_doe');
  });

  it('trims whitespace', () => {
    expect(normalizeUsername('  johndoe  ')).toBe('johndoe');
    expect(normalizeUsername('  john doe  ')).toBe('john_doe');
  });

  it('handles multiple operations together', () => {
    expect(normalizeUsername('  John  Doe  ')).toBe('john_doe');
  });

  it('handles empty strings', () => {
    expect(normalizeUsername('')).toBe('');
    expect(normalizeUsername('   ')).toBe('');
  });

  it('leaves already normalized usernames unchanged', () => {
    expect(normalizeUsername('john_doe')).toBe('john_doe');
  });
});

describe('slugify', () => {
  it('converts to lowercase', () => {
    expect(slugify('JOHN')).toBe('john');
  });

  it('replaces ampersands with "and"', () => {
    expect(slugify('Salt & Pepper')).toBe('salt-and-pepper');
  });

  it('replaces non-alphanumeric characters with hyphens', () => {
    expect(slugify('hello world!')).toBe('hello-world');
    expect(slugify('hello! world')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('---hello-world---')).toBe('hello-world');
  });

  it('trims whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('handles multiple hyphens', () => {
    expect(slugify('hello---world')).toBe('hello-world');
  });
});
