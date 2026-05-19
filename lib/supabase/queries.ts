import { createClient } from "./server"
import { Database } from "@/types/database"
import { BakeryMapMarker, BakeryStats, BakeryWithStats } from "@/types/bakery"
import { getDemoState } from "@/lib/demo-store"

type BakeryInsert = Database["public"]["Tables"]["bakeries"]["Insert"]

export type BakeryFilters = {
  search?: string;
  city?: string;
  district?: string;
  sort?: string;
}

export const hasSupabaseEnv = () => {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

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
  if (!hasSupabaseEnv()) {
    const { bakeries } = getDemoState();
    return bakeries;
  }

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
  if (!hasSupabaseEnv()) {
    const { bakeries } = getDemoState();
    return bakeries.find((b) => b.slug === slug) || null;
  }

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
  if (!hasSupabaseEnv()) {
    const { reviews } = getDemoState();
    return reviews.filter((r) => r.bakery_id === bakeryId);
  }

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
  if (!hasSupabaseEnv()) {
    const { photos, reviews } = getDemoState();
    const reviewIds = reviews.filter((r) => r.bakery_id === bakeryId).map((r) => r.id);
    return photos.filter((p) => reviewIds.includes(p.review_id));
  }

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
  // Demo mode handles mutations via its own addDemoBakery, but for server-side logic:
  if (!hasSupabaseEnv()) {
    throw new Error("Mutation not supported in demo mode via queries.ts");
  }

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
  let rawBakeries: (Database["public"]["Tables"]["bakeries"]["Row"] & { 
    reviews?: Pick<Database["public"]["Tables"]["reviews"]["Row"], "overall_rating" | "egg_rating" | "scam_level" | "taste_rating" | "freshness_rating" | "price_rating">[]; 
    bakery_badges?: Database["public"]["Tables"]["bakery_badges"]["Row"][]; 
  })[] = [];
  let allReviews: Database["public"]["Tables"]["reviews"]["Row"][] = [];

  if (!hasSupabaseEnv()) {
    const state = getDemoState();
    rawBakeries = state.bakeries;
    allReviews = state.reviews;
  } else {
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
    rawBakeries = data;
  }

  // Calculate averages client-side or via a more complex query. 
  // For MVP, we'll map them here to include calculated stats.
  const bakeriesWithStats = rawBakeries.map((bakery) => {
    // If in demo mode, reviews are in allReviews, otherwise they were fetched in the query
    const reviews = hasSupabaseEnv() 
      ? (bakery.reviews || []) 
      : allReviews.filter(r => r.bakery_id === bakery.id);

    return {
      ...bakery,
      stats: buildStats(reviews)
    };
  }) as BakeryWithStats[];

  // Applying local filters for demo mode
  let filtered = bakeriesWithStats;
  if (!hasSupabaseEnv()) {
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(b => b.name.toLowerCase().includes(term));
    }
    if (filters.city && filters.city !== "all") {
      filtered = filtered.filter(b => b.city === filters.city);
    }
    if (filters.district && filters.district !== "all") {
      filtered = filtered.filter(b => b.district === filters.district);
    }
  }

  // Sorting
  if (filters.sort === "top-rated") {
    filtered.sort((a, b) => b.stats.avgOverall - a.stats.avgOverall);
  } else if (filters.sort === "most-reviewed") {
    filtered.sort((a, b) => b.stats.reviewCount - a.stats.reviewCount);
  } else if (filters.sort === "lowest-scam") {
    filtered.sort((a, b) => a.stats.avgScam - b.stats.avgScam);
  } else {
    // newest default
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return filtered;
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
  let reviews: Pick<Database["public"]["Tables"]["reviews"]["Row"], "overall_rating" | "egg_rating" | "scam_level" | "taste_rating" | "freshness_rating" | "price_rating">[] = [];

  if (!hasSupabaseEnv()) {
    const { reviews: allReviews } = getDemoState();
    reviews = allReviews.filter(r => r.bakery_id === bakeryId);
  } else {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("overall_rating, egg_rating, scam_level, taste_rating, freshness_rating, price_rating")
      .eq("bakery_id", bakeryId);

    if (error) {
      console.error("Error fetching bakery stats:", error);
      return null;
    }
    reviews = data;
  }

  const count = reviews.length;
  if (count === 0) return { avgOverall: 0, avgEgg: 0, avgScam: 0, avgTaste: 0, avgFreshness: 0, avgPrice: 0, count: 0 };

  const sum = reviews.reduce((acc, r) => ({
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
