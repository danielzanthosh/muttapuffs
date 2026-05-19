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
    <nav ref={navRef} className="sticky top-0 z-50 w-full px-3 py-3 pointer-events-none md:px-4 md:py-4">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 pointer-events-auto md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link
            href={isSignedIn ? "/bakeries" : "/"}
            className="font-comic text-2xl font-black tracking-tighter text-chocolate-brown transition-opacity hover:opacity-80"
          >
            Mutta<span className="text-warm-orange">Meter</span>
          </Link>

          <Link
            href={isSignedIn ? "/profile" : "/login"}
            className="font-comic text-sm font-black uppercase tracking-tight text-chocolate-brown md:hidden"
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

        <div className="flex gap-3 overflow-x-auto pb-1 md:hidden">
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
        "font-comic text-sm font-black uppercase tracking-tight text-chocolate-brown transition-opacity hover:opacity-80",
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
      className="shrink-0 font-comic text-xs font-black uppercase tracking-tight text-chocolate-brown transition-opacity hover:opacity-80"
    >
      {children}
    </Link>
  );
}
