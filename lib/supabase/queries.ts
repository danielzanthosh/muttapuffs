import { createClient } from "./server"
import { Database } from "@/types/database"
import { BakeryMapMarker, BakeryStats, BakeryWithStats } from "@/types/bakery"

type BakeryInsert = Database["public"]["Tables"]["bakeries"]["Insert"]

export type BakeryFilters = {
  search?: string;
  city?: string;
  district?: string;
  sort?: string;
}

function buildStats(reviews: Array<{
  overall_rating: number | null;
  egg_rating: number | null;
  scam_level: number | null;
  taste_rating?: number | null;
  freshness_rating?: number | null;
  price_rating?: number | null;
}>): BakeryStats {
  const count = reviews.length;
  if (count === 0) {
    return { avgOverall: 0, avgEgg: 0, avgScam: 0, avgTaste: 0, avgFreshness: 0, avgPrice: 0, reviewCount: 0 };
  }

  const sum = reviews.reduce((acc, review) => ({
    overall: acc.overall + Number(review.overall_rating || 0),
    egg: acc.egg + Number(review.egg_rating || 0),
    scam: acc.scam + Number(review.scam_level || 0),
    taste: acc.taste + Number(review.taste_rating || 0),
    freshness: acc.freshness + Number(review.freshness_rating || 0),
    price: acc.price + Number(review.price_rating || 0),
  }), { overall: 0, egg: 0, scam: 0, taste: 0, freshness: 0, price: 0 });

  return {
    avgOverall: sum.overall / count,
    avgEgg: sum.egg / count,
    avgScam: sum.scam / count,
    avgTaste: sum.taste / count,
    avgFreshness: sum.freshness / count,
    avgPrice: sum.price / count,
    reviewCount: count,
  };
}

export async function getBakeries() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bakeries")
    .select("*, bakery_badges(*)")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bakeries:", error)
    return []
  }

  return data
}

export async function getBakeryBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("bakeries")
    .select("*, bakery_badges(*)")
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching bakery by slug ${slug}:`, error)
    return null
  }

  return data
}

export async function getBakeryReviews(bakeryId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(*), review_photos(*)")
    .eq("bakery_id", bakeryId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching reviews for bakery ${bakeryId}:`, error)
    return []
  }

  return data
}

export async function getBakeryPhotos(bakeryId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("review_photos")
    .select("*, reviews!inner(*)")
    .eq("reviews.bakery_id", bakeryId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(`Error fetching photos for bakery ${bakeryId}:`, error)
    return []
  }

  return data
}

export async function createBakery(data: BakeryInsert) {
  const supabase = await createClient()
  const { data: bakery, error } = await supabase
    .from("bakeries")
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create bakery: ${error.message}`)
  }

  return bakery
}

export async function getFilteredBakeries(filters: BakeryFilters): Promise<BakeryWithStats[]> {
  const supabase = await createClient();
  let query = supabase
    .from("bakeries")
    .select("*, bakery_badges(*), reviews(overall_rating, egg_rating, scam_level, taste_rating, freshness_rating, price_rating)");

  if (filters.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }
  if (filters.city && filters.city !== "all") {
    query = query.eq("city", filters.city);
  }
  if (filters.district && filters.district !== "all") {
    query = query.eq("district", filters.district);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching filtered bakeries:", error);
    return [];
  }

  // Calculate averages client-side or via a more complex query. 
  // For MVP, we'll map them here to include calculated stats.
  const bakeriesWithStats = data.map((bakery) => {
    const reviews = bakery.reviews || [];

    return {
      ...bakery,
      stats: buildStats(reviews)
    };
  }) as BakeryWithStats[];

  // Sorting
  if (filters.sort === "top-rated") {
    bakeriesWithStats.sort((a, b) => b.stats.avgOverall - a.stats.avgOverall);
  } else if (filters.sort === "most-reviewed") {
    bakeriesWithStats.sort((a, b) => b.stats.reviewCount - a.stats.reviewCount);
  } else if (filters.sort === "lowest-scam") {
    bakeriesWithStats.sort((a, b) => a.stats.avgScam - b.stats.avgScam);
  } else {
    // newest default
    bakeriesWithStats.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return bakeriesWithStats;
}

export async function getBakeryMapMarkers(): Promise<BakeryMapMarker[]> {
  const bakeries = await getFilteredBakeries({ sort: "top-rated" });

  return bakeries
    .filter((bakery) => typeof bakery.latitude === "number" && typeof bakery.longitude === "number")
    .map((bakery) => ({
      id: bakery.id,
      name: bakery.name,
      slug: bakery.slug,
      city: bakery.city,
      district: bakery.district,
      latitude: bakery.latitude as number,
      longitude: bakery.longitude as number,
      stats: bakery.stats,
    }));
}

export async function getBakeryStats(bakeryId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("overall_rating, egg_rating, scam_level, taste_rating, freshness_rating, price_rating")
    .eq("bakery_id", bakeryId);

  if (error) {
    console.error("Error fetching bakery stats:", error);
    return null;
  }

  const count = data.length;
  if (count === 0) return { avgOverall: 0, avgEgg: 0, avgScam: 0, avgTaste: 0, avgFreshness: 0, avgPrice: 0, count: 0 };

  const sum = data.reduce((acc, r) => ({
    overall: acc.overall + Number(r.overall_rating),
    egg: acc.egg + Number(r.egg_rating),
    scam: acc.scam + Number(r.scam_level),
    taste: acc.taste + Number(r.taste_rating),
    freshness: acc.freshness + Number(r.freshness_rating),
    price: acc.price + Number(r.price_rating),
  }), { overall: 0, egg: 0, scam: 0, taste: 0, freshness: 0, price: 0 });

  return {
    avgOverall: sum.overall / count,
    avgEgg: sum.egg / count,
    avgScam: sum.scam / count,
    avgTaste: sum.taste / count,
    avgFreshness: sum.freshness / count,
    avgPrice: sum.price / count,
    count
  };
}
