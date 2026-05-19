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
      <main className="flex-grow bg-bakery-paper px-4 pb-20 pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="comic-badge mb-4 bg-egg-yellow uppercase">PUFF DIRECTORY</div>
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
