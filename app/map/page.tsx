import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { BakeryMap } from "@/components/bakery-map";
import { getBakeryMapMarkers } from "@/lib/supabase/queries";

export default async function MapPage() {
  const markers = await getBakeryMapMarkers();

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 pb-20 pt-6 md:pt-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-6 border-4 border-chocolate-brown bg-white p-6 shadow-brutalist-md md:grid-cols-[1fr_320px] md:items-end">
            <div>
              <div className="comic-badge mb-4 bg-egg-yellow">BAKERY RADAR</div>
              <h1 className="max-w-4xl text-5xl font-black tracking-tighter md:text-7xl">
                Puff hotspots, pinned like evidence.
              </h1>
            </div>
            <div className="border-3 border-chocolate-brown bg-tomato-red p-4 text-white shadow-brutalist-sm">
              <div className="text-xs font-black uppercase opacity-80">Live Markers</div>
              <div className="text-5xl font-black">{markers.length}</div>
              <p className="text-sm font-bold">Only bakeries with coordinates appear on this radar.</p>
            </div>
          </div>

          <BakeryMap markers={markers} />
        </div>
      </main>
      <Footer />
    </>
  );
}
