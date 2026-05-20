import { describe, it, expect } from 'vitest';
import {
  authSchema,
  signupSchema,
  profileSchema,
  bakerySchema,
  reviewSchema,
  normalizeUsername,
  slugify,
  formValue
} from '../lib/validation';

describe('normalizeUsername', () => {
  it('trims whitespace and converts to lowercase', () => {
    expect(normalizeUsername('  Kochi_Puff_Lover  ')).toBe('kochi_puff_lover');
  });

  it('replaces spaces with underscores', () => {
    expect(normalizeUsername('Mutta Puff Inspector')).toBe('mutta_puff_inspector');
  });

  it('compresses multiple spaces into a single underscore', () => {
    expect(normalizeUsername('Chaotic   Bakery   Reviewer')).toBe('chaotic_bakery_reviewer');
  });
});

describe('slugify', () => {
  it('converts to lowercase and trims whitespace', () => {
    expect(slugify('  Bakery Name  ')).toBe('bakery-name');
  });

  it('replaces ampersands with "and"', () => {
    expect(slugify('KR & Sons Bakery')).toBe('kr-and-sons-bakery');
  });

  it('replaces non-alphanumeric characters with hyphens', () => {
    expect(slugify('Kozhikode\'s Special (Double Egg) Puff!!!')).toBe('kozhikode-s-special-double-egg-puff');
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugify('---Best Puffs in Town---')).toBe('best-puffs-in-town');
  });
});

describe('formValue', () => {
  it('retrieves text value from FormData correctly', () => {
    const fd = new FormData();
    fd.append('username', 'puff_master');
    expect(formValue(fd, 'username')).toBe('puff_master');
  });

  it('returns empty string if key is missing or not a string', () => {
    const fd = new FormData();
    expect(formValue(fd, 'non_existent')).toBe('');
  });
});

describe('authSchema', () => {
  it('passes on valid email and password', () => {
    const valid = authSchema.safeParse({
      email: 'muttalover@gmail.com',
      password: 'superpassword'
    });
    expect(valid.success).toBe(true);
  });

  it('fails on invalid emails', () => {
    const invalid = authSchema.safeParse({
      email: 'not-an-email',
      password: 'password123'
    });
    expect(invalid.success).toBe(false);
  });

  it('fails on short passwords', () => {
    const invalid = authSchema.safeParse({
      email: 'muttalover@gmail.com',
      password: '12345'
    });
    expect(invalid.success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('passes on valid credentials and username', () => {
    const valid = signupSchema.safeParse({
      email: 'inspector@domain.com',
      password: 'validpassword',
      username: 'mutta-puff_123'
    });
    expect(valid.success).toBe(true);
  });

  it('fails on short usernames', () => {
    const invalid = signupSchema.safeParse({
      email: 'inspector@domain.com',
      password: 'validpassword',
      username: 'mu'
    });
    expect(invalid.success).toBe(false);
  });

  it('fails on usernames exceeding 32 characters', () => {
    const invalid = signupSchema.safeParse({
      email: 'inspector@domain.com',
      password: 'validpassword',
      username: 'a'.repeat(33)
    });
    expect(invalid.success).toBe(false);
  });

  it('fails on usernames with forbidden special characters', () => {
    const invalid = signupSchema.safeParse({
      email: 'inspector@domain.com',
      password: 'validpassword',
      username: 'mutta@puff'
    });
    expect(invalid.success).toBe(false);
  });
});

describe('profileSchema', () => {
  it('transforms empty strings to null for optional full_name and avatar_url', () => {
    const result = profileSchema.safeParse({
      username: 'puff_inspector',
      full_name: '   ',
      avatar_url: ''
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.full_name).toBeNull();
      expect(result.data.avatar_url).toBeNull();
    }
  });

  it('fails on invalid avatar URLs', () => {
    const result = profileSchema.safeParse({
      username: 'puff_inspector',
      full_name: 'Puff Inspector',
      avatar_url: 'not-a-url'
    });
    expect(result.success).toBe(false);
  });
});

describe('bakerySchema', () => {
  it('validates a standard correct bakery model', () => {
    const result = bakerySchema.safeParse({
      name: 'Best Mutta Puffs',
      city: 'Ernakulam',
      district: 'Ernakulam',
      description: 'Legendary crispy snacks',
      address: 'Near Metro Station',
      phone: '+91 9876543210',
      latitude: '9.9816',
      longitude: '76.2999'
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.latitude).toBe(9.9816);
      expect(result.data.longitude).toBe(76.2999);
    }
  });

  it('fails when name or location details are too short', () => {
    const result = bakerySchema.safeParse({
      name: 'A',
      city: 'B',
      district: 'C'
    });
    expect(result.success).toBe(false);
  });

  it('fails when coordinates are out of bounds', () => {
    const result = bakerySchema.safeParse({
      name: 'Out of Bounds Bakery',
      city: 'Kochi',
      district: 'Ernakulam',
      latitude: 95.0, // max 90
      longitude: 76.2999
    });
    expect(result.success).toBe(false);
  });
});

describe('reviewSchema', () => {
  it('validates a correct review and coerces rating types', () => {
    const result = reviewSchema.safeParse({
      title: 'Awesome Puff',
      review_text: 'The egg was huge, fully half an egg. Crispy crust too!',
      egg_rating: '9',
      taste_rating: '8',
      freshness_rating: '10',
      price_rating: '7',
      scam_level: '1',
      price_paid: '15',
      visited_at: '2026-05-20'
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.egg_rating).toBe(9);
      expect(result.data.scam_level).toBe(1);
      expect(result.data.price_paid).toBe(15);
      expect(result.data.visited_at).toBe('2026-05-20');
    }
  });

  it('transforms empty strings or missing optional values to null', () => {
    const result = reviewSchema.safeParse({
      title: '',
      review_text: 'Highly authentic, but expensive.',
      egg_rating: 8,
      taste_rating: 7,
      freshness_rating: 6,
      price_rating: 5,
      scam_level: 2,
      price_paid: '',
      visited_at: ''
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBeNull();
      expect(result.data.price_paid).toBeNull();
      expect(result.data.visited_at).toBeNull();
    }
  });

  it('fails on too short review text', () => {
    const result = reviewSchema.safeParse({
      review_text: 'Short',
      egg_rating: 8,
      taste_rating: 8,
      freshness_rating: 8,
      price_rating: 8,
      scam_level: 2
    });
    expect(result.success).toBe(false);
  });

  it('fails when ratings are outside the 0-10 range', () => {
    const result = reviewSchema.safeParse({
      review_text: 'Super crispy and delicious egg puff.',
      egg_rating: 11, // max 10
      taste_rating: 8,
      freshness_rating: 8,
      price_rating: 8,
      scam_level: -1 // min 0
    });
    expect(result.success).toBe(false);
  });
});
