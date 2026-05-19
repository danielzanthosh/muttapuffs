import { Navbar } from "@/components/navbar";

export default function ProfileLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="overflow-hidden border-4 border-chocolate-brown bg-white shadow-brutalist-lg">
            <div className="h-32 animate-pulse border-b-3 border-chocolate-brown bg-egg-yellow" />
            <div className="space-y-8 p-8 pt-16">
              <div className="h-10 w-2/3 animate-pulse bg-chocolate-brown/20" />
              <div className="grid gap-6 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse border-3 border-chocolate-brown bg-bakery-paper" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
