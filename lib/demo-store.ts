import { BakeryWithBadges, ReviewWithProfile, ReviewPhoto } from "@/types/bakery";
import { calculateOverallRating } from "@/lib/puff-utils";
import { slugify } from "@/lib/validation";

type DemoBakery = BakeryWithBadges;

type DemoState = {
  bakeries: DemoBakery[];
  reviews: ReviewWithProfile[];
  photos: ReviewPhoto[];
};

const now = new Date().toISOString();

function makeReview(input: {
  id: string;
  bakery_id: string;
  user: string;
  title: string;
  review_text: string;
  egg_rating: number;
  taste_rating: number;
  freshness_rating: number;
  price_rating: number;
  scam_level: number;
  price_paid: number;
}): ReviewWithProfile {
  const overall_rating = calculateOverallRating({
    egg: input.egg_rating,
    taste: input.taste_rating,
    freshness: input.freshness_rating,
    price: input.price_rating,
    scam: input.scam_level,
  });

  return {
    id: input.id,
    bakery_id: input.bakery_id,
    user_id: `demo-user-${input.user}`,
    title: input.title,
    review_text: input.review_text,
    egg_rating: input.egg_rating,
    taste_rating: input.taste_rating,
    freshness_rating: input.freshness_rating,
    price_rating: input.price_rating,
    scam_level: input.scam_level,
    overall_rating,
    price_paid: input.price_paid,
    visited_at: "2026-05-18",
    created_at: now,
    profiles: {
      id: `demo-user-${input.user}`,
      username: input.user,
      full_name: null,
      avatar_url: null,
      is_admin: false,
      created_at: now,
    },
    review_photos: [],
  };
}

function createInitialState(): DemoState {
  const bakeries: DemoBakery[] = [
    {
      id: "demo-bakery-best",
      name: "Best Bakery Fort Kochi",
      slug: "best-bakery-fort-kochi",
      description: "Old-school counter, fast tea, and puffs that arrive like sealed evidence packets.",
      address: "Princess Street, Fort Kochi",
      city: "Kochi",
      district: "Ernakulam",
      latitude: 9.9656,
      longitude: 76.2424,
      phone: "+91 98765 43210",
      created_by: "demo-user-system",
      created_at: now,
      updated_at: now,
      bakery_badges: [
        { id: "badge-best-1", bakery_id: "demo-bakery-best", badge_type: "certified_mutta", label: "CERTIFIED MUTTA", created_at: now },
        { id: "badge-best-2", bakery_id: "demo-bakery-best", badge_type: "community_favorite", label: "LOCAL LEGEND", created_at: now },
      ],
    },
    {
      id: "demo-bakery-elite",
      name: "Elite Snacks Palayam",
      slug: "elite-snacks-palayam",
      description: "Excellent crunch, but the egg evidence depends heavily on batch timing.",
      address: "Palayam Market Road",
      city: "Thiruvananthapuram",
      district: "Thiruvananthapuram",
      latitude: 8.5037,
      longitude: 76.9488,
      phone: null,
      created_by: "demo-user-system",
      created_at: now,
      updated_at: now,
      bakery_badges: [
        { id: "badge-elite-1", bakery_id: "demo-bakery-elite", badge_type: "fresh_batch", label: "FRESH BATCH", created_at: now },
      ],
    },
    {
      id: "demo-bakery-crown",
      name: "Crown Bakery Kozhikode",
      slug: "crown-bakery-kozhikode",
      description: "Budget-friendly puff stop with a serious tea crowd and a suspiciously loyal fan base.",
      address: "SM Street",
      city: "Kozhikode",
      district: "Kozhikode",
      latitude: 11.2588,
      longitude: 75.7804,
      phone: null,
      created_by: "demo-user-system",
      created_at: now,
      updated_at: now,
      bakery_badges: [
        { id: "badge-crown-1", bakery_id: "demo-bakery-crown", badge_type: "budget_friendly", label: "BUDGET HERO", created_at: now },
      ],
    },
  ];

  const reviews = [
    makeReview({
      id: "demo-review-best-1",
      bakery_id: "demo-bakery-best",
      user: "puff_witness",
      title: "[Mutta Puff] Clean egg evidence",
      review_text: "Half egg visible, masala balanced, pastry still warm. Case closed with dignity.",
      egg_rating: 9,
      taste_rating: 9,
      freshness_rating: 8,
      price_rating: 8,
      scam_level: 1,
      price_paid: 22,
    }),
    makeReview({
      id: "demo-review-elite-1",
      bakery_id: "demo-bakery-elite",
      user: "chaaya_detective",
      title: "[Chaaya / Tea] Strong Ginger Tea",
      review_text: "Perfect brew strength and ginger kick. Hot, rejuvenating glass of tea. Best paired with a fresh kadi.",
      egg_rating: 8,
      taste_rating: 9,
      freshness_rating: 9,
      price_rating: 9,
      scam_level: 0,
      price_paid: 12,
    }),
    makeReview({
      id: "demo-review-crown-1",
      bakery_id: "demo-bakery-crown",
      user: "kadi_inspector",
      title: "[Kadi / Vada] Hot Uzhunnu Vada",
      review_text: "Crispy outer layer, soft black gram batter inside with bits of ginger and peppercorns. Excellent budget snack.",
      egg_rating: 7,
      taste_rating: 8,
      freshness_rating: 8,
      price_rating: 10,
      scam_level: 1,
      price_paid: 10,
    }),
    makeReview({
      id: "demo-review-best-2",
      bakery_id: "demo-bakery-best",
      user: "sweet_tooth",
      title: "[Pazhampori] Golden Pazhampori",
      review_text: "Proper ripe banana, sweet inside and crunchy batter outside. No heavy oil smell. Highly recommended local snack.",
      egg_rating: 9,
      taste_rating: 9,
      freshness_rating: 9,
      price_rating: 8,
      scam_level: 1,
      price_paid: 15,
    }),
    makeReview({
      id: "demo-review-elite-2",
      bakery_id: "demo-bakery-elite",
      user: "scam_buster",
      title: "[Mutta Puff] Egg Smell Only Scam",
      review_text: "Absolute crime! Just pastry sheet and a smear of masala. No egg slice in sight, just egg smell.",
      egg_rating: 0,
      taste_rating: 3,
      freshness_rating: 5,
      price_rating: 2,
      scam_level: 10,
      price_paid: 20,
    }),
  ];

  return { bakeries, reviews, photos: [] };
}

const globalForDemo = globalThis as typeof globalThis & { __muttapuffsDemo?: DemoState };

export function getDemoState() {
  if (!globalForDemo.__muttapuffsDemo) {
    globalForDemo.__muttapuffsDemo = createInitialState();
  }

  return globalForDemo.__muttapuffsDemo;
}

export function addDemoBakery(input: {
  name: string;
  city: string;
  district: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  latitude?: number | null;
  longitude?: number | null;
}) {
  const state = getDemoState();
  const slugBase = slugify(input.name);
  const slug = state.bakeries.some((bakery) => bakery.slug === slugBase)
    ? `${slugBase}-${Date.now().toString(36)}`
    : slugBase;
  const id = `demo-bakery-${Date.now().toString(36)}`;

  const bakery: DemoBakery = {
    id,
    name: input.name,
    slug,
    description: input.description,
    address: input.address,
    city: input.city,
    district: input.district,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    phone: input.phone,
    created_by: "demo-user-local",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    bakery_badges: [
      { id: `${id}-badge`, bakery_id: id, badge_type: "community_favorite", label: "NEW CASE", created_at: new Date().toISOString() },
    ],
  };

  state.bakeries.unshift(bakery);
  return bakery;
}

export function addDemoReview(input: {
  bakery_id: string;
  title: string | null;
  review_text: string;
  egg_rating: number;
  taste_rating: number;
  freshness_rating: number;
  price_rating: number;
  scam_level: number;
  price_paid: number | null;
  visited_at: string | null;
}) {
  const state = getDemoState();
  const review = makeReview({
    id: `demo-review-${Date.now().toString(36)}`,
    bakery_id: input.bakery_id,
    user: "local_investigator",
    title: input.title || "Local field report",
    review_text: input.review_text,
    egg_rating: input.egg_rating,
    taste_rating: input.taste_rating,
    freshness_rating: input.freshness_rating,
    price_rating: input.price_rating,
    scam_level: input.scam_level,
    price_paid: input.price_paid || 0,
  });

  review.visited_at = input.visited_at;
  review.created_at = new Date().toISOString();
  state.reviews.unshift(review);
  return review;
}
