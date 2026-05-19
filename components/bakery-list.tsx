"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { BakeryWithStats } from "@/types/bakery";
import { BakeryCard } from "./bakery-card";
import { BakeryFilters } from "./bakery-filters";
import { BadgeChip, RatingPill, ScamLevelBadge } from "./ui-primitives";
import { CalendarCheck, FileText, MapPin, MessageCircle, ReceiptText, Tag, X } from "lucide-react";

export function BakeryList({ bakeries }: { bakeries: BakeryWithStats[] }) {
  const [selectedBakery, setSelectedBakery] = useState<BakeryWithStats | null>(null);

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

  useEffect(() => {
    if (!selectedBakery) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedBakery(null);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedBakery]);

  return (
    <div>
      <BakeryFilters />

      {bakeries.length === 0 ? (
        <div className="brutalist-card p-10 md:p-20 bg-white text-center">
          <div className="mx-auto mb-6 h-16 w-16 rotate-[-4deg] border-4 border-dashed border-chocolate-brown bg-egg-yellow shadow-brutalist-md" />
          <h3 className="text-3xl font-black mb-2">Zero Mutta Detected.</h3>
          <p className="font-bold opacity-60">Try adjusting your filters or register a new bakery.</p>
          <Link href="/bakeries/new" className="btn-primary mt-6 inline-block">
            Register Bakery
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {bakeries.map((bakery) => (
            <div key={bakery.id} className="bakery-card-anim">
              <BakeryCard bakery={bakery} onSelect={() => setSelectedBakery(bakery)} />
            </div>
          ))}
        </div>
      )}

      {selectedBakery && (
        <BakeryDetailDialog bakery={selectedBakery} onClose={() => setSelectedBakery(null)} />
      )}
    </div>
  );
}

function BakeryDetailDialog({ bakery, onClose }: { bakery: BakeryWithStats; onClose: () => void }) {
  const flavor = useMemo(() => getBakeryFlavor(bakery), [bakery]);
  const location = [bakery.city, bakery.district].filter(Boolean).join(", ");
  const notes = bakery.description?.trim() || "No investigation notes available yet.";
  const lastChecked = formatDate(bakery.updated_at || bakery.created_at);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end bg-chocolate-brown/45 p-0 sm:items-center sm:p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bakery-detail-title"
        className="max-h-[92dvh] w-full overflow-y-auto border-4 border-chocolate-brown bg-bakery-paper p-4 shadow-brutalist-lg sm:mx-auto sm:max-w-5xl sm:p-6"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="comic-badge mb-3 bg-egg-yellow text-chocolate-brown">{flavor.caseFile}</div>
            <h2 id="bakery-detail-title" className="text-4xl font-black tracking-tighter sm:text-6xl">
              {bakery.name}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm font-black opacity-70">
              <MapPin size={16} />
              {location || "Kerala location pending"}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close bakery case file"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-brutalist border-3 border-chocolate-brown bg-white shadow-brutalist-sm transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
              <div className="mb-3 flex items-center gap-2 font-comic text-xs font-black uppercase tracking-wide text-tomato-red">
                <FileText size={16} />
                Investigation Notes
              </div>
              <p className="text-lg font-bold leading-relaxed">{notes}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EvidencePanel
                title="Bakery Evidence"
                icon={<ReceiptText size={16} />}
                lines={[
                  flavor.receipt,
                  `${bakery.stats.reviewCount} community report${bakery.stats.reviewCount === 1 ? "" : "s"} filed.`,
                  `Scam reading: ${flavor.statusLabel.toLowerCase()}.`,
                ]}
              />
              <EvidencePanel
                title="Field Log"
                icon={<CalendarCheck size={16} />}
                lines={[
                  `Last checked: ${lastChecked}`,
                  bakery.address ? `Address: ${bakery.address}` : "Address evidence not filed yet.",
                  bakery.phone ? `Phone: ${bakery.phone}` : "Phone contact not filed yet.",
                ]}
              />
            </div>
          </div>

          <aside className="space-y-5">
            <div className="border-4 border-chocolate-brown bg-egg-yellow p-5 shadow-brutalist-md">
              <div className="mb-4 font-comic text-xs font-black uppercase tracking-wide">Live Receipt</div>
              <ScoreRow label="Puff score" value={`${bakery.stats.avgOverall.toFixed(1)}/10`} />
              <ScoreRow label="Mutta score" value={`${bakery.stats.avgEgg.toFixed(1)}/10`} />
              <ScoreRow label="Taste" value={`${(bakery.stats.avgTaste ?? bakery.stats.avgOverall).toFixed(1)}/10`} />
              <ScoreRow label="Freshness" value={`${(bakery.stats.avgFreshness ?? bakery.stats.avgOverall).toFixed(1)}/10`} />
              <ScoreRow label="Price" value={`${(bakery.stats.avgPrice ?? bakery.stats.avgOverall).toFixed(1)}/10`} />
            </div>

            <div className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
              <div className="mb-4 flex items-center justify-between gap-3">
                <ScamLevelBadge level={bakery.stats.avgScam} />
                <div className={`border-3 border-chocolate-brown px-3 py-1 font-comic text-xs font-black uppercase text-white ${flavor.statusColor}`}>
                  {flavor.statusLabel}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <RatingPill value={bakery.stats.avgOverall} label="PUFF" />
                <RatingPill value={bakery.stats.avgEgg} label="MUTTA" />
              </div>
              <div className="mt-5 flex items-center gap-2 border-t-2 border-dashed border-chocolate-brown/20 pt-4 text-xs font-black uppercase opacity-70">
                <MessageCircle size={15} />
                {bakery.stats.reviewCount} report{bakery.stats.reviewCount === 1 ? "" : "s"}
              </div>
            </div>

            <div className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
              <div className="mb-3 flex items-center gap-2 font-comic text-xs font-black uppercase tracking-wide">
                <Tag size={16} />
                Case Tags
              </div>
              <div className="flex flex-wrap gap-2">
                {bakery.bakery_badges.length ? (
                  bakery.bakery_badges.map((badge) => (
                    <BadgeChip key={badge.id} type={badge.badge_type} label={badge.label} />
                  ))
                ) : (
                  <span className="comic-badge bg-bakery-paper text-chocolate-brown">NO BADGES FILED</span>
                )}
                <span className={`comic-badge text-white ${flavor.statusColor}`}>{flavor.evidenceLabel}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function EvidencePanel({ title, icon, lines }: { title: string; icon: ReactNode; lines: string[] }) {
  return (
    <div className="border-4 border-chocolate-brown bg-white p-4 shadow-brutalist-sm">
      <div className="mb-3 flex items-center gap-2 font-comic text-xs font-black uppercase tracking-wide text-warm-orange">
        {icon}
        {title}
      </div>
      <ul className="space-y-2 text-sm font-bold leading-snug">
        {lines.map((line) => (
          <li key={line} className="border-b-2 border-dashed border-chocolate-brown/10 pb-2 last:border-b-0 last:pb-0">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-dashed border-chocolate-brown py-2 last:border-b-0">
      <span className="font-black uppercase tracking-wide">{label}</span>
      <span className="font-comic text-2xl font-black tabular-nums">{value}</span>
    </div>
  );
}

function getBakeryFlavor(bakery: BakeryWithStats) {
  const seed = Array.from(bakery.id || bakery.slug || bakery.name).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const caseNumber = (seed % 900) + 100;
  const scam = bakery.stats.avgScam;
  const status =
    scam > 7
      ? { statusLabel: "Scam Watch", statusColor: "bg-tomato-red", evidenceLabel: "Egg audit needed" }
      : scam > 4
        ? { statusLabel: "Suspicious", statusColor: "bg-warm-orange", evidenceLabel: "Mixed testimony" }
        : { statusLabel: "Clean File", statusColor: "bg-green-500", evidenceLabel: "Community cleared" };
  const receipts = [
    "Puff shell evidence logged with community witness notes.",
    "Receipt trail says this bakery deserves a closer look.",
    "Local snack board has enough clues for a proper field visit.",
    "Case file assembled from ratings, tags, and fresh-batch gossip.",
  ];

  return {
    caseFile: `CASE FILE ${caseNumber}`,
    receipt: receipts[seed % receipts.length],
    ...status,
  };
}

function formatDate(value?: string | null) {
  if (!value) return "Not checked yet";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not checked yet";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}
