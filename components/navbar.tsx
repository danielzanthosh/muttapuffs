"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 w-full px-4 py-4 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <Link
          href="/"
          className="bg-bakery-paper border-2 border-chocolate-brown px-4 py-2 rounded-brutalist shadow-brutalist-sm rotate-[-1deg] hover:rotate-0 transition-transform z-50"
        >
          <span className="font-comic font-bold text-2xl tracking-tighter">
            Mutta<span className="text-warm-orange">Meter</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink href="/bakeries">Case Files</NavLink>
          <NavLink href="/map">Bakery Map</NavLink>
          <NavLink href="/leaderboards">Leaderboards</NavLink>
          <Link 
            href="/login" 
            className="btn-primary py-2 text-base"
          >
            Join the Hunt
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden bg-bakery-paper border-2 border-chocolate-brown p-2 rounded-brutalist shadow-brutalist-sm z-50 pointer-events-auto"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        )}

      </div>
      </nav>

      {/* Mobile Menu Overlay (Outside of nav to avoid GSAP transform containment context) */}
      {isOpen && (
        <div className="fixed inset-0 bg-bakery-paper z-[100] md:hidden flex flex-col items-center justify-center gap-6 pointer-events-auto">
          {/* Close Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute top-4 right-4 bg-bakery-paper border-2 border-chocolate-brown p-2 rounded-brutalist z-[101]"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>

          <NavLink href="/bakeries" onClick={() => setIsOpen(false)} className="text-xl px-6 py-3">Case Files</NavLink>
          <NavLink href="/map" onClick={() => setIsOpen(false)} className="text-xl px-6 py-3">Bakery Map</NavLink>
          <NavLink href="/leaderboards" onClick={() => setIsOpen(false)} className="text-xl px-6 py-3">Leaderboards</NavLink>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="btn-primary py-3 px-8 text-xl"
          >
            Join the Hunt
          </Link>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "bg-bakery-paper border-2 border-chocolate-brown px-3 py-1.5 rounded-brutalist shadow-brutalist-sm font-comic font-bold text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutalist-sm transition-all",
        className
      )}
    >
      {children}
    </Link>
  );
}
