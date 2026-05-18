import { describe, it, expect } from 'vitest';
import { validateImageFile } from '../../lib/cloudinary';

describe('validateImageFile', () => {
  it('should return valid for a correct image file', () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

    const result = validateImageFile(file);
    expect(result).toEqual({ valid: true });
  });

  it('should return invalid for unsupported file type', () => {
    const file = new File([''], 'test.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

    const result = validateImageFile(file);
    expect(result).toEqual({ valid: false, error: "Only JPEG, PNG, or WebP images are allowed." });
  });

  it('should return invalid for file exceeding 8MB', () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 9 * 1024 * 1024 }); // 9MB

    const result = validateImageFile(file);
    expect(result).toEqual({ valid: false, error: "File too large. Max 8MB evidence allowed." });
  });

  it('should return valid for file exactly 8MB', () => {
    const file = new File([''], 'test.webp', { type: 'image/webp' });
    Object.defineProperty(file, 'size', { value: 8 * 1024 * 1024 }); // Exactly 8MB

    const result = validateImageFile(file);
    expect(result).toEqual({ valid: true });
  });

  it('should handle missing type or size gracefully', () => {
    // In a real environment, File objects always have type and size, but testing for safety
    const file = { name: 'test.jpg' } as unknown as File;
    const result = validateImageFile(file);

    // Type will be undefined, so it won't be in the array
    expect(result).toEqual({ valid: false, error: "Only JPEG, PNG, or WebP images are allowed." });
  });
});
