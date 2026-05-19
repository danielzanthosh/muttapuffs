import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getFilteredBakeries } from "@/lib/supabase/queries";
import { BakeryWithStats } from "@/types/bakery";

export default async function LeaderboardsPage() {
  const bakeries = await getFilteredBakeries({ sort: "top-rated" });
  const topRated = [...bakeries].sort((a, b) => b.stats.avgOverall - a.stats.avgOverall).slice(0, 5);
  const lowestScam = [...bakeries].sort((a, b) => a.stats.avgScam - b.stats.avgScam).slice(0, 5);
  const mostReviewed = [...bakeries].sort((a, b) => b.stats.reviewCount - a.stats.reviewCount).slice(0, 5);

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 py-20">
        <div className="mx-auto max-w-7xl">
          <section className="mb-10 border-4 border-chocolate-brown bg-white p-6 shadow-brutalist-lg">
            <div className="comic-badge mb-4 bg-warm-orange text-white">LOCAL LEGENDS</div>
            <h1 className="max-w-4xl text-5xl font-black tracking-tighter md:text-7xl">
              The public record of puff greatness.
            </h1>
          </section>

          <div className="grid gap-8 lg:grid-cols-3">
            <Leaderboard title="Top Puff Score" label="CERTIFIED MUTTA" bakeries={topRated} metric="avgOverall" />
            <Leaderboard title="Lowest Scam Level" label="CLEAN CASES" bakeries={lowestScam} metric="avgScam" inverse />
            <Leaderboard title="Most Reported" label="COMMUNITY FAVORITES" bakeries={mostReviewed} metric="reviewCount" />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Leaderboard({
  title,
  label,
  bakeries,
  metric,
  inverse = false,
}: {
  title: string;
  label: string;
  bakeries: BakeryWithStats[];
  metric: "avgOverall" | "avgScam" | "reviewCount";
  inverse?: boolean;
}) {
  return (
    <section className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
      <div className="mb-5 flex items-start justify-between gap-4 border-b-2 border-dashed border-chocolate-brown/20 pb-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-wide text-tomato-red">{label}</div>
          <h2 className="text-2xl font-black">{title}</h2>
        </div>
        <div className="h-10 w-10 rotate-[-4deg] border-3 border-chocolate-brown bg-egg-yellow shadow-brutalist-sm" />
      </div>

      {bakeries.length === 0 ? (
        <p className="font-bold opacity-60">No reports filed yet.</p>
      ) : (
        <ol className="space-y-3">
          {bakeries.map((bakery, index) => {
            const value = bakery.stats[metric];
            return (
              <li key={bakery.id}>
                <div className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-3 border-chocolate-brown bg-bakery-cream p-3 font-bold">
                  <span className="text-2xl font-black tabular-nums">{index + 1}</span>
                  <span>
                    <span className="block leading-tight">{bakery.name}</span>
                    <span className="text-xs opacity-60">{bakery.city}</span>
                  </span>
                  <span className="border-2 border-chocolate-brown bg-white px-2 py-1 text-sm font-black tabular-nums">
                    {metric === "reviewCount" ? value : inverse ? value.toFixed(1) : value.toFixed(1)}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
