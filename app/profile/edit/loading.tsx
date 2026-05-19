import { Navbar } from "@/components/navbar";

export default function EditProfileLoading() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 py-20">
        <div className="mx-auto max-w-2xl border-4 border-chocolate-brown bg-white p-8 shadow-brutalist-lg">
          <div className="mb-6 h-8 w-40 animate-pulse bg-egg-yellow" />
          <div className="mb-8 h-10 w-3/4 animate-pulse bg-chocolate-brown/20" />
          <div className="space-y-5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse border-3 border-chocolate-brown bg-bakery-cream" />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
