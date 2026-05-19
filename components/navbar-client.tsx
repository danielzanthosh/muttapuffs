"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function NavbarClient({ isAdmin, isSignedIn }: { isAdmin: boolean; isSignedIn: boolean }) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from(navRef.current, {
      y: -12,
      opacity: 0,
      duration: 0.22,
      ease: "power3.out",
    });
  }, []);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 w-full bg-bakery-paper px-3 py-3 pointer-events-none md:px-4 md:py-4"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 pointer-events-auto md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link
            href={isSignedIn ? "/bakeries" : "/"}
            className="bg-white border-3 border-chocolate-brown px-4 py-2 rounded-brutalist shadow-brutalist-sm rotate-[-1deg] hover:rotate-0 transition-transform"
          >
            <span className="font-comic font-bold text-2xl tracking-tighter">
              Mutta<span className="text-warm-orange">Meter</span>
            </span>
          </Link>

          <Link
            href={isSignedIn ? "/profile" : "/login"}
            className="rounded-brutalist border-3 border-chocolate-brown bg-white p-2 font-comic text-sm font-bold shadow-brutalist-sm md:hidden"
          >
            {isSignedIn ? "PROFILE" : "SIGN IN"}
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <NavLink href="/bakeries">Case Files</NavLink>
          <NavLink href="/map">Bakery Map</NavLink>
          <NavLink href="/leaderboards">Leaderboards</NavLink>
          {isAdmin && <NavLink href="/admin">Admin</NavLink>}
          {isSignedIn ? (
            <Link href="/profile" className="btn-primary py-2 text-base">
              Profile
            </Link>
          ) : (
            <Link href="/login" className="btn-primary py-2 text-base">
              Join the Hunt
            </Link>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:hidden">
          <MobileNavLink href="/bakeries">Cases</MobileNavLink>
          <MobileNavLink href="/map">Map</MobileNavLink>
          <MobileNavLink href="/leaderboards">Scores</MobileNavLink>
          {isAdmin && <MobileNavLink href="/admin">Admin</MobileNavLink>}
        </div>
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

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-full border-2 border-chocolate-brown bg-white px-3 py-1.5 font-comic text-xs font-black uppercase shadow-brutalist-sm"
    >
      {children}
    </Link>
  );
}
