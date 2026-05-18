import { Database } from "./database"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Bakery = Database["public"]["Tables"]["bakeries"]["Row"]
export type Review = Database["public"]["Tables"]["reviews"]["Row"]
export type ReviewPhoto = Database["public"]["Tables"]["review_photos"]["Row"]
export type BakeryBadge = Database["public"]["Tables"]["bakery_badges"]["Row"]

export type BakeryWithBadges = Bakery & {
  bakery_badges: BakeryBadge[]
}

export type BakeryStats = {
  avgOverall: number
  avgEgg: number
  avgScam: number
  avgTaste?: number
  avgFreshness?: number
  avgPrice?: number
  reviewCount: number
}

export type BakeryWithStats = BakeryWithBadges & {
  stats: BakeryStats
}

export type BakeryMapMarker = {
  id: string
  name: string
  slug: string
  city: string
  district: string | null
  latitude: number
  longitude: number
  stats: BakeryStats
}

export type ReviewWithProfile = Review & {
  profiles: Profile
  review_photos: ReviewPhoto[]
}

export type BadgeType = 
  | "certified_mutta"
  | "scam_alert"
  | "fresh_batch"
  | "legendary"
  | "budget_friendly"
  | "community_favorite"
