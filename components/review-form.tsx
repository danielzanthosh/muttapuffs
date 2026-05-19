"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { RatingSlider } from "./rating-slider";
import { PuffPhotoUploader } from "./puff-photo-uploader";
import { createClient } from "@/lib/supabase/client";
import { CloudinaryUploadResult } from "@/lib/cloudinary";
import { reviewSchema } from "@/lib/validation";

export function ReviewForm({ bakeryId, onSuccess }: { bakeryId: string; bakerySlug: string; onSuccess?: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [photoResult, setPhotoResult] = useState<CloudinaryUploadResult | null>(null);
  const [ratings, setRatings] = useState({
    egg: 5,
    taste: 5,
    freshness: 5,
    price: 5,
    scam: 0
  });
  const router = useRouter();
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabase = hasSupabaseEnv ? createClient() : null;

  async function handleSubmit(formData: FormData) {
    setError(null);
    const parsed = reviewSchema.safeParse({
      title: formData.get("title"),
      review_text: formData.get("review_text"),
      egg_rating: ratings.egg,
      taste_rating: ratings.taste,
      freshness_rating: ratings.freshness,
      price_rating: ratings.price,
      scam_level: ratings.scam,
      price_paid: formData.get("price_paid") || "",
      visited_at: formData.get("visited_at") || "",
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Check the puff report.");
      return;
    }

    startTransition(async () => {
      if (!hasSupabaseEnv) {
        const response = await fetch("/api/demo/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bakery_id: bakeryId,
            ...parsed.data,
          }),
        });
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Could not file demo report.");
          return;
        }

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/bakeries");
          router.refresh();
        }
        return;
      }

      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) {
        setError("You must be logged in to file a report.");
        return;
      }

      // 1. Create Review
      const { data: review, error: insertError } = await supabase!
        .from("reviews")
        .insert({
          bakery_id: bakeryId,
          user_id: user.id,
          title: parsed.data.title,
          review_text: parsed.data.review_text,
          egg_rating: parsed.data.egg_rating,
          taste_rating: parsed.data.taste_rating,
          freshness_rating: parsed.data.freshness_rating,
          price_rating: parsed.data.price_rating,
          scam_level: parsed.data.scam_level,
          price_paid: parsed.data.price_paid,
          visited_at: parsed.data.visited_at
        })
        .select()
        .single();

      if (insertError) {
        setError(insertError.message);
        return;
      }

      // 2. If photo was uploaded, save record
      if (photoResult && review) {
        const { error: photoError } = await supabase!
          .from("review_photos")
          .insert({
            review_id: review.id,
            user_id: user.id,
            cloudinary_url: photoResult.secure_url,
            cloudinary_public_id: photoResult.public_id,
            width: photoResult.width,
            height: photoResult.height,
            file_size: photoResult.bytes
          });

        if (photoError) {
          console.error("Review created but photo record failed:", photoError);
          // We don't fail the whole process, just notify
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/bakeries");
        router.refresh();
      }
    });
  }

  return (
    <div className="brutalist-card bg-white p-5 sm:p-8 max-w-3xl w-full mx-auto">
      <div className="comic-badge bg-egg-yellow mb-6 uppercase">NEW PUFF REPORT</div>
      <h2 className="text-2xl sm:text-3xl font-black mb-8 tracking-tighter">File a Field Investigation</h2>

      {error && (
        <div className="p-4 mb-6 bg-tomato-red text-white border-3 border-chocolate-brown rounded-brutalist font-bold">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <RatingSlider 
            label="Egg Level" 
            name="egg" 
            value={ratings.egg} 
            onChange={(val) => setRatings({...ratings, egg: val})} 
            description="How much egg is actually inside?"
          />
          <RatingSlider 
            label="Taste Rating" 
            name="taste" 
            value={ratings.taste} 
            onChange={(val) => setRatings({...ratings, taste: val})} 
            description="Is it legendary or just okay?"
          />
          <RatingSlider 
            label="Freshness Check" 
            name="freshness" 
            value={ratings.freshness} 
            onChange={(val) => setRatings({...ratings, freshness: val})} 
            description="Hot and flaky or a cold case?"
          />
          <RatingSlider 
            label="Price Fairness" 
            name="price" 
            value={ratings.price} 
            onChange={(val) => setRatings({...ratings, price: val})} 
            description="Value for money investigation."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="p-5 sm:p-6 bg-bakery-paper border-3 border-chocolate-brown rounded-brutalist relative overflow-hidden h-fit">
            <div className="absolute top-0 right-0 bg-tomato-red text-white font-black text-[8px] px-2 py-1 uppercase rotate-[-45deg] translate-x-3 translate-y-1">DANGER</div>
            <RatingSlider 
              label="Scam Level" 
              name="scam" 
              value={ratings.scam} 
              onChange={(val) => setRatings({...ratings, scam: val})} 
              description="Evidence of empty puff deception."
            />
          </div>

          <PuffPhotoUploader onUploadComplete={setPhotoResult} />
        </div>

        <div className="space-y-6 pt-4 border-t-2 border-dashed border-chocolate-brown/10">
          <div className="space-y-2">
            <label className="font-comic font-black text-sm uppercase">Report Title (Optional)</label>
            <input 
              name="title"
              type="text"
              placeholder="e.g. Legendary Encounter, Egg Missing!"
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            />
          </div>

          <div className="space-y-2">
            <label className="font-comic font-black text-sm uppercase">Full Statement (Review)</label>
            <textarea 
              name="review_text"
              required
              rows={5}
              placeholder="Describe your puff experience in detail..."
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-comic font-black text-sm uppercase">Price Paid (INR)</label>
              <input 
                name="price_paid"
                type="number"
                placeholder="e.g. 15"
                className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
              />
            </div>

            <div className="space-y-2">
              <label className="font-comic font-black text-sm uppercase">Investigation Date</label>
              <input 
                name="visited_at"
                type="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button 
            disabled={isPending}
            type="submit"
            className="btn-primary min-w-0 flex-grow text-lg sm:text-2xl py-5 sm:py-6 disabled:opacity-50 shadow-brutalist-lg active:shadow-none sm:translate-x-[-4px] sm:translate-y-[-4px] active:translate-x-0 active:translate-y-0"
          >
            {isPending ? "SUBMITTING EVIDENCE..." : "FILE PUFF REPORT"}
          </button>
        </div>
      </form>
    </div>
  );
}
