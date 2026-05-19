import { Navbar } from "@/components/navbar";
import { SkeletonBadge, SkeletonBlock, SkeletonLine } from "@/components/skeletons";

export default function AdminLoading() {
  return (
    <>
      <Navbar />
      <main aria-busy="true" className="flex-grow bg-bakery-paper px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <SkeletonBadge className="mb-5 w-36 bg-tomato-red" />
            <SkeletonLine className="h-12 w-full max-w-md bg-chocolate-brown/15 md:h-16" />
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-brutalist border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-sm">
                <SkeletonLine className="mb-4 h-3 w-20 border-2" />
                <SkeletonLine className="h-10 w-12 bg-chocolate-brown/15" />
              </div>
            ))}
          </div>
          {["Profiles", "Bakeries", "Reviews"].map((section) => (
            <section key={section} className="rounded-brutalist border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
              <SkeletonLine className="mb-5 h-8 w-36 bg-chocolate-brown/15" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="grid gap-3 border-b-2 border-dashed border-chocolate-brown/20 pb-4 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <SkeletonLine className="mb-2 h-5 w-48 bg-chocolate-brown/15" />
                      <SkeletonLine className="h-4 w-64 max-w-full" />
                    </div>
                    <SkeletonBlock className="h-11 w-full bg-tomato-red md:w-28" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
