import { Navbar } from "@/components/navbar";
import { SkeletonBadge, SkeletonBlock, SkeletonLine } from "@/components/skeletons";

export default function MapLoading() {
  return (
    <>
      <Navbar />
      <main aria-busy="true" className="flex-grow bg-bakery-paper px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 rounded-brutalist border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md md:grid-cols-[1fr_320px] md:items-end md:p-6">
            <div>
              <SkeletonBadge className="mb-5" />
              <SkeletonLine className="mb-3 h-12 w-full max-w-3xl bg-chocolate-brown/15 md:h-16" />
              <SkeletonLine className="h-12 w-4/5 max-w-2xl bg-chocolate-brown/15 md:h-16" />
            </div>
            <div className="rounded-brutalist border-3 border-chocolate-brown bg-tomato-red p-4 shadow-brutalist-sm">
              <SkeletonLine className="mb-4 h-3 w-28 border-white/45 bg-white/40" />
              <SkeletonLine className="mb-3 h-12 w-20 border-white/45 bg-white/50" />
              <SkeletonLine className="h-4 w-full border-white/45 bg-white/40" />
            </div>
          </div>

          <div className="overflow-hidden rounded-brutalist border-4 border-chocolate-brown bg-white p-2 shadow-brutalist-lg">
            <div className="relative h-[62dvh] min-h-[430px] overflow-hidden rounded-[8px] border-2 border-chocolate-brown/30 bg-bakery-cream">
              <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(var(--chocolate-brown)_1px,transparent_1px),linear-gradient(90deg,var(--chocolate-brown)_1px,transparent_1px)] [background-size:72px_72px]" />
              <SkeletonBlock className="absolute left-[18%] top-[22%] h-10 w-16 rotate-[-5deg] bg-egg-yellow" />
              <SkeletonBlock className="absolute right-[20%] top-[34%] h-10 w-16 rotate-3 bg-warm-orange" />
              <SkeletonBlock className="absolute bottom-[22%] left-[44%] h-10 w-16 rotate-[-2deg] bg-tomato-red" />
              <div className="absolute bottom-4 left-4 right-4 rounded-brutalist border-3 border-chocolate-brown bg-white p-4 shadow-brutalist-sm md:left-auto md:w-72">
                <SkeletonLine className="mb-3 h-5 w-44 bg-chocolate-brown/15" />
                <SkeletonLine className="mb-2 w-full" />
                <SkeletonLine className="w-2/3" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
