import { Navbar } from "@/components/navbar";
import { SkeletonBadge, SkeletonBlock, SkeletonLine } from "@/components/skeletons";

export default function EditProfileLoading() {
  return (
    <>
      <Navbar />
      <main aria-busy="true" className="flex-grow bg-bakery-paper px-4 py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl rounded-brutalist border-4 border-chocolate-brown bg-white p-6 shadow-brutalist-lg md:p-8">
          <SkeletonBadge className="mb-6 w-40" />
          <SkeletonLine className="mb-8 h-10 w-3/4 bg-chocolate-brown/15" />
          <div className="space-y-6">
            <FormFieldSkeleton />
            <FormFieldSkeleton />
            <div>
              <SkeletonLine className="mb-3 h-4 w-28 border-2" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <SkeletonBlock className="h-24 w-24 bg-bakery-cream shadow-brutalist-sm" />
                <div className="flex-1">
                  <SkeletonBlock className="mb-3 h-12 w-44 bg-egg-yellow" />
                  <SkeletonLine className="w-56" />
                </div>
              </div>
              <SkeletonBlock className="mt-4 h-14 w-full" />
            </div>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <SkeletonBlock className="h-16 flex-1 bg-egg-yellow" />
              <SkeletonBlock className="h-16 flex-1 bg-white" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function FormFieldSkeleton() {
  return (
    <div>
      <SkeletonLine className="mb-2 h-4 w-36 border-2" />
      <SkeletonBlock className="mb-2 h-14 w-full" />
      <SkeletonLine className="h-3 w-52 border-2" />
    </div>
  );
}
