"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { ReviewPhoto } from "@/types/bakery";
import { X } from "lucide-react";

export function PuffProofGallery({ photos }: { photos: ReviewPhoto[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

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

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedPhoto) {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedPhoto]);

  if (photos.length === 0) {
    return (
      <div className="aspect-square bg-white border-2 border-chocolate-brown rounded-lg border-dashed flex items-center justify-center opacity-40">
        <span className="text-xs font-black uppercase">No Photos Found</span>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="grid grid-cols-2 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="gallery-item brutalist-card p-1 bg-white overflow-hidden aspect-square relative group cursor-zoom-in"
            onClick={() => setSelectedPhoto(photo.cloudinary_url)}
          >
            <img
              src={photo.cloudinary_url}
              alt="Puff Proof"
              className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-chocolate-brown/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-black text-[10px] uppercase tracking-tighter bg-chocolate-brown/80 px-2 py-1 rounded">VIEW EVIDENCE</span>
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-bakery-cream/95 shadow-brutalist-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            className="absolute top-4 right-4 bg-white border-3 border-chocolate-brown p-2 rounded-brutalist shadow-brutalist-sm z-[101]"
            onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
          >
            <X size={24} />
          </button>
          <div className="max-w-5xl w-full max-h-[90vh] relative brutalist-card p-2 bg-white cursor-default" onClick={e => e.stopPropagation()}>
            <img
              src={selectedPhoto}
              alt="Evidence Full View"
              className="w-full h-full object-contain max-h-[85vh]"
            />
          </div>
        </div>
      )}
    </>
  );
}
