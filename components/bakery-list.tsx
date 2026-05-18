"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { BakeryWithStats } from "@/types/bakery";
import { BakeryCard } from "./bakery-card";
import { BakeryFilters } from "./bakery-filters";

export function BakeryList({ bakeries }: { bakeries: BakeryWithStats[] }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(".bakery-card-anim", {
      y: 24,
      opacity: 0,
      duration: 0.45,
      stagger: 0.06,
      ease: "power3.out",
    });
  }, [bakeries]);

  return (
    <div>
      <BakeryFilters />

      {bakeries.length === 0 ? (
        <div className="brutalist-card p-10 md:p-20 bg-white text-center">
          <div className="mx-auto mb-6 h-16 w-16 rotate-[-4deg] border-4 border-dashed border-chocolate-brown bg-egg-yellow shadow-brutalist-md" />
          <h3 className="text-3xl font-black mb-2">Zero Mutta Detected.</h3>
          <p className="font-bold opacity-60">Try adjusting your filters or register a new bakery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {bakeries.map((bakery) => (
            <div key={bakery.id} className="bakery-card-anim">
              <BakeryCard bakery={bakery} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
