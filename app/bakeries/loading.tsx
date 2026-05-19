import { Navbar } from "@/components/navbar";
import { BakeryCardSkeleton, SkeletonBadge, SkeletonBlock, SkeletonLine } from "@/components/skeletons";

export default function BakeriesLoading() {
  return (
    <>
      <Navbar />
      <main aria-busy="true" className="flex-grow bg-bakery-paper px-4 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <SkeletonBadge className="mb-5" />
              <SkeletonLine className="mb-3 h-12 w-full max-w-lg bg-chocolate-brown/15 md:h-16" />
              <SkeletonLine className="h-12 w-3/4 bg-chocolate-brown/15 md:h-16" />
            </div>
            <SkeletonBlock className="h-16 w-full bg-egg-yellow md:w-56" />
          </div>

          <div className="mb-8 rounded-brutalist border-4 border-chocolate-brown bg-white p-4 shadow-brutalist-md">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_220px]">
              <SkeletonBlock className="h-14" />
              <SkeletonBlock className="h-14" />
              <SkeletonBlock className="h-14 bg-egg-yellow" />
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <BakeryCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
