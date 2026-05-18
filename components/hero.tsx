"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-hero-reveal]", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power4.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative overflow-hidden px-4 pb-20 pt-16 md:pt-20">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-lg md:p-8" data-hero-reveal>
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="comic-badge bg-egg-yellow">CASE FILE 001</span>
            <span className="comic-badge bg-tomato-red text-white">SCAM ALERT WATCH</span>
          </div>

          <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-tighter md:text-7xl lg:text-8xl">
            Find puffs with actual mutta inside.
          </h1>

          <p className="mt-8 max-w-2xl text-lg font-bold leading-relaxed md:text-2xl">
            A community bakery investigation board for Kerala: map the legends, expose empty-shell scams,
            and file puff proof before the trail goes cold.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/bakeries" className="btn-primary text-center text-xl">
              Open Case Files
            </Link>
            <Link href="/map" className="btn-secondary text-center text-xl">
              Launch Bakery Radar
            </Link>
          </div>
        </div>

        <div className="grid gap-6" data-hero-reveal>
          <div className="border-4 border-chocolate-brown bg-egg-yellow p-5 shadow-brutalist-md md:p-6">
            <div className="mb-3 text-xs font-black uppercase opacity-70">Live Receipt</div>
            <div className="space-y-3 font-comic text-2xl font-black uppercase leading-none md:text-4xl">
              <div className="flex justify-between border-b-2 border-dashed border-chocolate-brown pb-2">
                <span>Egg Level</span>
                <span>35%</span>
              </div>
              <div className="flex justify-between border-b-2 border-dashed border-chocolate-brown pb-2">
                <span>Taste</span>
                <span>25%</span>
              </div>
              <div className="flex justify-between border-b-2 border-dashed border-chocolate-brown pb-2">
                <span>Freshness</span>
                <span>20%</span>
              </div>
              <div className="flex justify-between">
                <span>Price</span>
                <span>20%</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="border-4 border-chocolate-brown bg-tomato-red p-5 text-white shadow-brutalist-md">
              <div className="text-xs font-black uppercase opacity-80">Warning Stamp</div>
              <div className="mt-3 text-4xl font-black leading-none">LOW EGG EVIDENCE</div>
            </div>
            <div className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
              <div className="text-xs font-black uppercase opacity-60">Community Note</div>
              <p className="mt-3 font-comic text-2xl font-black leading-tight">
                "Egg smell only" is not a review. It is evidence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
