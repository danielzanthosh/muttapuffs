"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { ReviewPhoto } from "@/types/bakery";

export function PuffProofGallery({ photos }: { photos: ReviewPhoto[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (photos.length > 0) {
      gsap.from(".gallery-item", {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
    }
  }, [photos]);

  if (photos.length === 0) {
    return (
      <div className="aspect-square bg-white border-2 border-chocolate-brown rounded-lg border-dashed flex items-center justify-center opacity-40">
        <span className="text-xs font-black uppercase">No Photos Found</span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid grid-cols-2 gap-4">
      {photos.map((photo) => (
        <div 
          key={photo.id} 
          className="gallery-item brutalist-card p-1 bg-white overflow-hidden aspect-square relative group cursor-zoom-in"
        >
          <img 
            src={photo.cloudinary_url} 
            alt="Puff Proof" 
            className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-chocolate-brown/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white font-black text-[10px] uppercase tracking-tighter">VIEW EVIDENCE</span>
          </div>
        </div>
      ))}
    </div>
  );
}
