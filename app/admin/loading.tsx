import { Navbar } from "@/components/navbar";

export default function AdminLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 py-16">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-12 w-64 animate-pulse border-4 border-chocolate-brown bg-egg-yellow" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse border-4 border-chocolate-brown bg-white shadow-brutalist-sm" />
            ))}
          </div>
          <div className="h-80 animate-pulse border-4 border-chocolate-brown bg-white shadow-brutalist-md" />
        </div>
      </main>
    </>
  );
}
