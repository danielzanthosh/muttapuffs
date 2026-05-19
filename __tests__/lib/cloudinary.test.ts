import { describe, it, expect } from 'vitest';
import { validateImageFile } from '../../lib/cloudinary';

describe('validateImageFile', () => {
  it('validates a correct PNG file', () => {
    // Create a mock PNG file under 8MB
    const file = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 7 * 1024 * 1024 });

    const result = validateImageFile(file);
    expect(result).toEqual({ valid: true });
  });

  it('rejects files over 8MB', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 9 * 1024 * 1024 });

    const result = validateImageFile(file);
    expect(result).toEqual({ valid: false, error: "File too large. Max 8MB evidence allowed." });
  });
});
