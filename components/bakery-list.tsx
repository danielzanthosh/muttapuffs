"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import gsap from "gsap";
import { BakeryWithStats } from "@/types/bakery";
import { BakeryCard } from "./bakery-card";
import { BakeryFilters } from "./bakery-filters";
import { BadgeChip, ScamLevelBadge } from "./ui-primitives";
import { AlertTriangle, CalendarCheck, FileText, MapPin, MessageCircle, Plus, ReceiptText, Tag, X } from "lucide-react";

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
      className="fixed inset-0 z-[100] flex bg-bakery-paper overflow-y-auto"
      role="presentation"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bakery-detail-title"
        className="min-h-screen w-full p-6 sm:p-12 relative"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <div className="comic-badge mb-4 bg-egg-yellow text-chocolate-brown px-4 py-1 text-sm">{flavor.caseFile}</div>
              <h2 id="bakery-detail-title" className="text-5xl font-black tracking-tighter sm:text-7xl lg:text-8xl">
                {bakery.name}
              </h2>
              <div className="mt-4 flex items-center gap-3 text-lg font-black opacity-70">
                <MapPin size={24} className="text-tomato-red" />
                {location || "Kerala location pending"}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close bakery case file"
              className="sticky top-6 grid h-14 w-14 shrink-0 place-items-center rounded-brutalist border-4 border-chocolate-brown bg-white shadow-brutalist transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-brutalist-sm"
            >
              <X size={32} />
            </button>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-10">
              <div className="border-4 border-chocolate-brown bg-white p-8 sm:p-12 shadow-brutalist">
                <div className="mb-8 flex items-center gap-3 font-comic text-sm font-black uppercase tracking-widest text-tomato-red">
                  <FileText size={24} />
                  Official Investigation Notes
                </div>
                <p className="text-2xl sm:text-3xl font-bold leading-relaxed">{notes}</p>
              </div>

              <div className="grid gap-8 sm:grid-cols-2">
                <EvidencePanel
                  title="Bakery Evidence"
                  icon={<ReceiptText size={24} />}
                  lines={[
                    flavor.receipt,
                    `${bakery.stats.reviewCount} community report${bakery.stats.reviewCount === 1 ? "" : "s"} filed.`,
                    `Scam reading: ${flavor.statusLabel.toLowerCase()}.`,
                  ]}
                />
                <EvidencePanel
                  title="Field Log"
                  icon={<CalendarCheck size={24} />}
                  lines={[
                    `Last checked: ${lastChecked}`,
                    bakery.address ? `Address: ${bakery.address}` : "Address evidence not filed yet.",
                    bakery.phone ? `Phone: ${bakery.phone}` : "Phone contact not filed yet.",
                  ]}
                />
              </div>

              {/* Interaction Section */}
              <div className="border-4 border-chocolate-brown bg-white p-8 shadow-brutalist space-y-6">
                <div className="font-comic text-sm font-black uppercase tracking-widest border-b-4 border-chocolate-brown pb-4 mb-4">Case Interaction</div>
                <p className="font-bold opacity-70 italic">Witnessed something? Add your testimony to the official record or flag deceptive puffs.</p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link 
                    href={`/bakeries/${bakery.slug}/review`}
                    className="btn-primary flex-1 flex items-center justify-center gap-3 py-6 text-2xl"
                  >
                    <Plus size={28} />
                    GIVE REMARKS
                  </Link>
                  <Link 
                    href={`/bakeries/${bakery.slug}/review`}
                    className="border-4 border-chocolate-brown bg-tomato-red text-white font-black px-10 py-6 text-2xl shadow-brutalist hover:translate-x-1 hover:translate-y-1 hover:shadow-brutalist-sm transition-all flex items-center justify-center gap-3"
                  >
                    <AlertTriangle size={28} />
                    REPORT SCAM
                  </Link>
                </div>
              </div>
            </div>

            <aside className="space-y-10">
              <div className="border-4 border-chocolate-brown bg-egg-yellow p-10 shadow-brutalist">
                <div className="mb-8 font-comic text-sm font-black uppercase tracking-widest border-b-2 border-chocolate-brown pb-2">Live Receipt</div>
                <ScoreRow label="Puff score" value={`${bakery.stats.avgOverall.toFixed(1)}/10`} />
                <ScoreRow label="Mutta score" value={`${bakery.stats.avgEgg.toFixed(1)}/10`} />
                <ScoreRow label="Taste" value={`${(bakery.stats.avgTaste ?? bakery.stats.avgOverall).toFixed(1)}/10`} />
                <ScoreRow label="Freshness" value={`${(bakery.stats.avgFreshness ?? bakery.stats.avgOverall).toFixed(1)}/10`} />
                <ScoreRow label="Price" value={`${(bakery.stats.avgPrice ?? bakery.stats.avgOverall).toFixed(1)}/10`} />
              </div>

              <div className="border-4 border-chocolate-brown bg-white p-10 shadow-brutalist">
                <div className="mb-8 flex items-center justify-between gap-6">
                  <ScamLevelBadge level={bakery.stats.avgScam} />
                  <div className={`border-3 border-chocolate-brown px-6 py-3 font-comic text-sm font-black uppercase text-white ${flavor.statusColor} shadow-brutalist-sm rotate-1`}>
                    {flavor.statusLabel}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col items-center border-4 border-chocolate-brown p-6 bg-bakery-paper shadow-brutalist-sm">
                    <span className="text-[12px] font-black uppercase mb-2">PUFF</span>
                    <span className="text-5xl font-black">{bakery.stats.avgOverall.toFixed(1)}</span>
                  </div>
                  <div className="flex flex-col items-center border-4 border-chocolate-brown p-6 bg-egg-yellow shadow-brutalist-sm">
                    <span className="text-[12px] font-black uppercase mb-2">MUTTA</span>
                    <span className="text-5xl font-black">{bakery.stats.avgEgg.toFixed(1)}</span>
                  </div>
                </div>
                <div className="mt-10 flex items-center gap-4 border-t-4 border-dashed border-chocolate-brown/20 pt-8 text-sm font-black uppercase opacity-70">
                  <MessageCircle size={24} />
                  {bakery.stats.reviewCount} total report{bakery.stats.reviewCount === 1 ? "" : "s"} filed
                </div>
              </div>

              <div className="border-4 border-chocolate-brown bg-white p-8 shadow-brutalist">
                <div className="mb-6 flex items-center gap-3 font-comic text-sm font-black uppercase tracking-widest">
                  <Tag size={24} />
                  Case Tags
                </div>
                <div className="flex flex-wrap gap-3">
                  {bakery.bakery_badges.length ? (
                    bakery.bakery_badges.map((badge) => (
                      <BadgeChip key={badge.id} type={badge.badge_type} label={badge.label} className="text-xs py-1 px-3" />
                    ))
                  ) : (
                    <span className="comic-badge bg-bakery-paper text-chocolate-brown">NO BADGES FILED</span>
                  )}
                  <span className={`comic-badge text-white ${flavor.statusColor} rotate-0`}>{flavor.evidenceLabel}</span>
                </div>
              </div>

              <div className="flex justify-center pt-10 pb-20 lg:pb-0">
                <button 
                  onClick={onClose}
                  className="btn-secondary w-full py-6 text-2xl shadow-brutalist-lg active:shadow-none translate-x-[-4px] translate-y-[-4px] active:translate-x-0 active:translate-y-0"
                >
                  CLOSE CASE FILE
                </button>
              </div>
            </aside>
          </div>
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
