import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value.length === 0 ? null : value))
  .nullable();

export const authSchema = z.object({
  email: z.string().trim().email("Use a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signupSchema = authSchema.extend({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username must be 32 characters or less.")
    .regex(/^[a-zA-Z0-9_ -]+$/, "Use letters, numbers, spaces, hyphens, or underscores."),
});

export const profileSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters.").max(32),
  full_name: optionalText,
  avatar_url: z
    .string()
    .trim()
    .url("Avatar must be a valid URL.")
    .or(z.literal(""))
    .transform((value) => (value.length === 0 ? null : value)),
});

export const bakerySchema = z.object({
  name: z.string().trim().min(2, "Bakery name is required.").max(120),
  city: z.string().trim().min(2, "City or town is required.").max(80),
  district: z.string().trim().min(2, "District is required.").max(80),
  description: optionalText,
  address: optionalText,
  phone: optionalText,
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
});

export const reviewSchema = z.object({
  title: optionalText,
  review_text: z.string().trim().min(8, "Write a little more evidence for the report.").max(1600),
  egg_rating: z.coerce.number().int().min(0).max(10),
  taste_rating: z.coerce.number().int().min(0).max(10),
  freshness_rating: z.coerce.number().int().min(0).max(10),
  price_rating: z.coerce.number().int().min(0).max(10),
  scam_level: z.coerce.number().int().min(0).max(10),
  price_paid: z
    .union([z.literal(""), z.coerce.number().min(0).max(10000)])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  visited_at: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : null)),
});

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase().replace(/\s+/g, "_");
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}
