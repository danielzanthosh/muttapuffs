import { ReviewWithProfile } from "@/types/bakery";
import { ScamLevelBadge } from "./ui-primitives";
import { formatReviewDate, formatPrice, getPuffBadge, getScamAlerts, getItemDetails } from "@/lib/puff-utils";
import { User, Calendar, Receipt, MessageCircle } from "lucide-react";
import Image from "next/image";

export function ReviewCard({ review }: { review: ReviewWithProfile }) {
  const { itemName, cleanTitle, ratingLabel } = getItemDetails(review.title);

  const badge = getPuffBadge({
    egg: review.egg_rating,
    taste: review.taste_rating,
    freshness: review.freshness_rating,
    price: review.price_rating,
    scam: review.scam_level
  });

  const alerts = getScamAlerts({
    egg: review.egg_rating,
    freshness: review.freshness_rating,
    scam: review.scam_level
  });

  const displayTitle = cleanTitle || itemName || "Field Report";

  return (
    <div className="brutalist-card bg-white p-6 relative overflow-hidden group">
      {/* Receipt Tear Effect (SVG) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-chocolate-brown/10" style={{ backgroundImage: 'radial-gradient(circle, transparent 70%, #3E2723 70%)', backgroundSize: '8px 8px', backgroundPosition: '0 -4px' }} />
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
        <div className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="comic-badge bg-bakery-cream text-chocolate-brown border-2 border-chocolate-brown text-[10px] py-0.5 px-2 font-black">
              🔍 {itemName}
            </span>
            <span className="comic-badge bg-warm-orange text-white text-[10px] py-0.5 px-2">{badge}</span>
            {alerts.map((alert, i) => (
              <span key={i} className="comic-badge bg-tomato-red text-white text-[10px] py-0.5 px-2 uppercase">{alert}</span>
            ))}
          </div>
          
          <h4 className="text-xl font-black tracking-tight mb-1">{displayTitle}</h4>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold opacity-60">
            <div className="flex items-center gap-1">
              <User size={12} />
              @{review.profiles.username}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {formatReviewDate(review.created_at)}
            </div>
            {review.price_paid && (
              <div className="flex items-center gap-1">
                <Receipt size={12} />
                {formatPrice(review.price_paid)}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="bg-egg-yellow border-3 border-chocolate-brown p-2 rounded-brutalist text-center min-w-[60px] rotate-[3deg] group-hover:rotate-0 transition-transform">
            <div className="text-[8px] font-black uppercase leading-none">OVERALL</div>
            <div className="text-2xl font-black">{(Number(review.overall_rating) || 0).toFixed(1)}</div>
          </div>
          <ScamLevelBadge level={review.scam_level} />
        </div>
      </div>

      <div className="p-4 bg-bakery-paper border-2 border-chocolate-brown rounded-lg mb-6 relative">
        <MessageCircle size={16} className="absolute -top-2 -left-2 text-chocolate-brown fill-white" />
        <p className="text-sm font-medium leading-relaxed italic">
          &quot;{review.review_text}&quot;
        </p>
      </div>

      {review.review_photos && review.review_photos.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4">
          {review.review_photos.map((photo) => (
            <div key={photo.id} className="brutalist-card p-1 bg-white overflow-hidden aspect-video relative group/photo">
              <Image
                src={photo.cloudinary_url} 
                alt="Snack Proof" 
                fill
                className="object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4 comic-badge bg-egg-yellow text-[8px] py-0.5 px-2 rotate-[-2deg] opacity-0 group-hover/photo:opacity-100 transition-opacity">
                PHOTO EVIDENCE #ID-{photo.id.slice(0,4)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t-2 border-dashed border-chocolate-brown/10">
        <RatingMiniPill label={ratingLabel} value={review.egg_rating} />
        <RatingMiniPill label="TASTE" value={review.taste_rating} />
        <RatingMiniPill label="FRESH" value={review.freshness_rating} />
        <RatingMiniPill label="VALUE" value={review.price_rating} />
      </div>
    </div>
  );
}

function RatingMiniPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[8px] font-black opacity-40 uppercase mb-1">{label}</span>
      <div className="font-black text-sm">{value}/10</div>
    </div>
  );
}

export function ReviewList({ reviews }: { reviews: ReviewWithProfile[] }) {
  if (reviews.length === 0) {
    return (
      <div className="p-16 border-3 border-dashed border-chocolate-brown/20 rounded-brutalist bg-white/50 text-center">
        <div className="text-5xl mb-4 opacity-20">🕵️‍♀️</div>
        <h3 className="text-xl font-black opacity-40">No evidence found in this sector.</h3>
        <p className="text-sm font-bold opacity-30 mt-2">Be the lead investigator and file the first report.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <div key={review.id} className="review-card-anim">
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
}
