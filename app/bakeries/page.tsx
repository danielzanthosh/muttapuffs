import { getFilteredBakeries } from "@/lib/supabase/queries";
import { BakeryList } from "@/components/bakery-list";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { BakeryFilters as BakeryFiltersType } from "@/lib/supabase/queries";
import { Suspense } from "react";

export default async function BakeriesPage({
  searchParams,
}: {
  searchParams: BakeryFiltersType;
}) {
  const bakeries = await getFilteredBakeries({
    search: searchParams.search,
    city: searchParams.city,
    district: searchParams.district,
    sort: searchParams.sort || "newest",
  });

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="comic-badge bg-egg-yellow mb-4 uppercase">PUFF DIRECTORY</div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
                Explore The <br /> Bakery Map.
              </h1>
            </div>
            
            <Link 
              href="/bakeries/new"
              className="btn-primary py-4 px-8 text-xl"
            >
              REGISTER BAKERY
            </Link>
          </div>

          <Suspense fallback={<div className="border-4 border-chocolate-brown bg-white p-6 font-black shadow-brutalist-md">Loading bakery controls...</div>}>
            <BakeryList bakeries={bakeries} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
