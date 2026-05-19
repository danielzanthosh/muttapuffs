import { Navbar } from "@/components/navbar";

export default function MapLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="h-[620px] animate-pulse border-4 border-chocolate-brown bg-white shadow-brutalist-lg" />
        </div>
      </main>
    </>
  );
}
