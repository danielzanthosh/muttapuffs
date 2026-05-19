import { cn } from "@/lib/utils";
import { BadgeType } from "@/types/bakery";

export function BadgeChip({ type, label, className }: { type: BadgeType | string; label: string; className?: string }) {
  const getColors = () => {
    switch (type) {
      case "scam_alert": return "bg-tomato-red text-white";
      case "certified_mutta": return "bg-egg-yellow text-chocolate-brown";
      case "legendary": return "bg-warm-orange text-white shadow-brutalist-sm";
      case "fresh_batch": return "bg-green-500 text-white";
      default: return "bg-white text-chocolate-brown";
    }
  };

  return (
    <span className={cn(
      "comic-badge text-[10px] py-0.5 px-2 rotate-0",
      getColors(),
      className
    )}>
      {label}
    </span>
  );
}

export function RatingPill({ value, label, max = 10 }: { value: number; label?: string; max?: number }) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-[10px] font-black uppercase opacity-60 font-comic">{label}</span>}
      <div
        aria-label={`${label || "Rating"} ${value.toFixed(1)} out of ${max}`}
        className="bg-white border-2 border-chocolate-brown px-2 py-0.5 rounded-full font-black text-xs shadow-brutalist-sm min-w-[32px] text-center"
      >
        {value.toFixed(1)}
      </div>
    </div>
  );
}

export function ScamLevelBadge({ level }: { level: number }) {
  const getStatus = () => {
    if (level > 7) return { label: "HIGH ALERT", color: "bg-tomato-red" };
    if (level > 4) return { label: "SUSPICIOUS", color: "bg-warm-orange" };
    return { label: "CLEAN", color: "bg-green-500" };
  };

  const status = getStatus();

  return (
    <div className={cn("inline-flex items-center gap-1 p-1 pr-3 rounded-full border-2 border-chocolate-brown font-comic font-black text-[10px] text-white", status.color)}>
      <div className="bg-white text-chocolate-brown rounded-full w-4 h-4 flex items-center justify-center text-[8px]">!</div>
      {status.label}
    </div>
  );
}
