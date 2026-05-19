import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-brutalist border-3 border-chocolate-brown/80 bg-bakery-cream",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.2s_ease-in-out_infinite]",
        "before:bg-gradient-to-r before:from-transparent before:via-white/65 before:to-transparent",
        className
      )}
    />
  );
}

export function SkeletonBadge({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("h-9 w-36 rotate-[-2deg] rounded-full bg-egg-yellow", className)} />;
}

export function SkeletonLine({ className }: { className?: string }) {
  return <SkeletonBlock className={cn("h-4 border-2", className)} />;
}

export function BakeryCardSkeleton() {
  return (
    <div className="rounded-brutalist border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
      <div className="mb-5 flex items-start justify-between gap-3">
        <SkeletonBadge className="h-8 w-28" />
        <SkeletonBlock className="h-12 w-12 rotate-3 bg-egg-yellow" />
      </div>
      <div className="space-y-3">
        <SkeletonLine className="h-8 w-4/5 bg-chocolate-brown/15" />
        <SkeletonLine className="w-2/3" />
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <SkeletonBlock className="h-20 bg-bakery-paper" />
        <SkeletonBlock className="h-20 bg-bakery-paper" />
        <SkeletonBlock className="h-20 bg-bakery-paper" />
      </div>
      <SkeletonBlock className="mt-6 h-12 w-full bg-egg-yellow" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="rounded-brutalist border-3 border-chocolate-brown bg-bakery-paper p-4 shadow-brutalist-sm">
      <SkeletonLine className="mb-3 h-3 w-24 border-2" />
      <SkeletonLine className="h-8 w-20 bg-chocolate-brown/15" />
    </div>
  );
}
