import { Navbar } from "@/components/navbar";

export default function BakeriesLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 py-20">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="h-20 w-full max-w-xl animate-pulse bg-chocolate-brown/20" />
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse border-4 border-chocolate-brown bg-white shadow-brutalist-md" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
