import { Navbar } from "@/components/navbar";
import { SkeletonBadge, SkeletonBlock, SkeletonLine, StatSkeleton } from "@/components/skeletons";

export default function ProfileLoading() {
  return (
    <>
      <Navbar />
      <main aria-busy="true" className="flex-grow bg-bakery-paper px-4 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden rounded-brutalist border-4 border-chocolate-brown bg-white shadow-brutalist-lg">
            <div className="relative h-32 border-b-3 border-chocolate-brown bg-egg-yellow">
              <SkeletonBlock className="absolute -bottom-12 left-8 h-24 w-24 bg-bakery-cream shadow-brutalist-md" />
            </div>
            <div className="p-6 pt-16 md:p-8 md:pt-16">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <SkeletonBadge className="mb-4 h-8 w-40 bg-warm-orange" />
                  <SkeletonLine className="mb-3 h-10 w-56 bg-chocolate-brown/15" />
                  <SkeletonLine className="h-6 w-44" />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <SkeletonBlock className="h-12 w-full bg-white sm:w-40" />
                  <SkeletonBlock className="h-12 w-full bg-tomato-red sm:w-32" />
                </div>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <StatSkeleton key={index} />
                ))}
              </div>
              <div className="mt-12 rounded-brutalist border-3 border-dashed border-chocolate-brown/30 bg-bakery-cream p-8">
                <SkeletonLine className="mx-auto mb-3 h-6 w-full max-w-md" />
                <SkeletonLine className="mx-auto mb-6 h-6 w-3/4 max-w-sm" />
                <SkeletonBlock className="mx-auto h-12 w-44 bg-egg-yellow" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
