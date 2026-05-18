"use client";

import Link from "next/link";
import { BakeryWithStats } from "@/types/bakery";
import { BadgeChip, RatingPill, ScamLevelBadge } from "./ui-primitives";
import { MapPin, MessageCircle } from "lucide-react";

export function BakeryCard({ bakery }: { bakery: BakeryWithStats }) {
  return (
    <Link 
      href={`/bakeries/${bakery.slug}`}
      className="group flex h-full flex-col border-4 border-chocolate-brown bg-white p-6 shadow-brutalist-md transition-transform hover:-translate-y-1 hover:rotate-[-0.5deg] focus:outline-none focus:ring-4 focus:ring-warm-orange"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {bakery.bakery_badges.map((badge) => (
              <BadgeChip key={badge.id} type={badge.badge_type} label={badge.label} />
            ))}
          </div>
          <h3 className="text-2xl font-black tracking-tighter group-hover:text-warm-orange transition-colors">
            {bakery.name}
          </h3>
          <div className="flex items-center gap-1 text-sm font-bold opacity-60 mt-1">
            <MapPin size={14} />
            {bakery.city}, {bakery.district}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <RatingPill value={bakery.stats.avgOverall} label="PUFF" />
          <ScamLevelBadge level={bakery.stats.avgScam} />
        </div>
      </div>

      <p className="text-sm font-medium line-clamp-2 mb-6 opacity-80">
        {bakery.description || "No investigation notes available for this location yet."}
      </p>

      <div className="mt-auto pt-4 border-t-2 border-dashed border-chocolate-brown/10 flex justify-between items-center">
        <div className="flex items-center gap-1.5 font-black text-xs opacity-60">
          <MessageCircle size={14} />
          {bakery.stats.reviewCount} REPORTS
        </div>
        
        <RatingPill value={bakery.stats.avgEgg} label="MUTTA" />
      </div>
    </Link>
  );
}
