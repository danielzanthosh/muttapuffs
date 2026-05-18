"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  }, []);

  return (
    <nav 
      ref={navRef}
      className="sticky top-0 z-50 w-full px-4 py-4 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        <Link 
          href="/" 
          className="bg-white border-3 border-chocolate-brown px-4 py-2 rounded-brutalist shadow-brutalist-sm rotate-[-1deg] hover:rotate-0 transition-transform"
        >
          <span className="font-comic font-bold text-2xl tracking-tighter">
            Mutta<span className="text-warm-orange">Meter</span>
          </span>
        </Link>

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

        <Link href="/bakeries" className="md:hidden bg-white border-3 border-chocolate-brown p-2 rounded-brutalist shadow-brutalist-sm">
          <span className="font-comic font-bold text-sm">CASES</span>
        </Link>
      </div>
    </nav>
  );
}

function NavLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link 
      href={href} 
      className={cn(
        "bg-white border-3 border-chocolate-brown px-3 py-1.5 rounded-brutalist shadow-brutalist-sm font-comic font-bold text-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-brutalist-sm transition-all",
        className
      )}
    >
      {children}
    </Link>
  );
}
