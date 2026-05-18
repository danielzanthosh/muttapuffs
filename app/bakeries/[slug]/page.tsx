import { getBakeryBySlug, getBakeryStats, getBakeryReviews, getBakeryPhotos } from "@/lib/supabase/queries";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { RatingPill, ScamLevelBadge, BadgeChip } from "@/components/ui-primitives";
import { ReviewList } from "@/components/review-list";
import { PuffProofGallery } from "@/components/puff-proof-gallery";
import { MapPin, Phone, MessageSquare, Camera, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BakeryBadge, ReviewPhoto, ReviewWithProfile } from "@/types/bakery";

export default async function BakeryProfilePage({ params }: { params: { slug: string } }) {
  const bakery = await getBakeryBySlug(params.slug);

  if (!bakery) {
    notFound();
  }

  const stats = await getBakeryStats(bakery.id);
  const reviews = await getBakeryReviews(bakery.id) as unknown as ReviewWithProfile[];
  const photos = (await getBakeryPhotos(bakery.id)) as ReviewPhoto[];

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper">
        {/* Profile Header */}
        <section className="bg-white border-b-4 border-chocolate-brown pt-20 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
              <div className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {bakery.bakery_badges.map((badge: BakeryBadge) => (
                    <BadgeChip key={badge.id} type={badge.badge_type} label={badge.label} className="text-xs" />
                  ))}
                  <ScamLevelBadge level={stats?.avgScam || 0} />
                </div>
                
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4">{bakery.name}</h1>
                
                <div className="flex flex-col gap-2 opacity-70">
                  <div className="flex items-center gap-2 font-bold">
                    <MapPin size={18} />
                    {bakery.address ? `${bakery.address}, ` : ""}{bakery.city}, {bakery.district}
                  </div>
                  {bakery.phone && (
                    <div className="flex items-center gap-2 font-bold">
                      <Phone size={18} />
                      {bakery.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto">
                <div className="brutalist-card bg-egg-yellow p-6 text-center rotate-[2deg]">
                  <div className="text-xs font-black uppercase opacity-60 mb-1">PUFF SCORE</div>
                  <div className="text-6xl font-black">{(stats?.avgOverall || 0).toFixed(1)}</div>
                  <div className="text-xs font-black uppercase mt-1">/ 10.0</div>
                </div>
                <Link 
                  href={`/bakeries/${bakery.slug}/review`}
                  className="btn-primary flex items-center justify-center gap-2 text-xl py-4"
                >
                  <Plus size={24} /> WRITE REPORT
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="py-12 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatsMiniCard label="MUTTA LEVEL" value={stats?.avgEgg || 0} />
            <StatsMiniCard label="TASTE" value={stats?.avgTaste || 0} />
            <StatsMiniCard label="FRESHNESS" value={stats?.avgFreshness || 0} />
            <StatsMiniCard label="PRICE FAIRNESS" value={stats?.avgPrice || 0} />
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Reviews Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-2">
                  <MessageSquare /> PUFF REPORTS ({stats?.count || 0})
                </h2>
              </div>

              <ReviewList reviews={reviews} />
            </div>

            {/* Sidebar / Media */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight mb-6 flex items-center gap-2">
                  <Camera /> PUFF PROOF
                </h2>
                <PuffProofGallery photos={photos} />
              </div>

              <div className="brutalist-card p-6 bg-bakery-paper">
                <h3 className="font-black text-xl mb-2 italic">"Egg smell only."</h3>
                <p className="text-sm font-medium opacity-60">
                  - Local Legend @investigator_x
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function StatsMiniCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border-3 border-chocolate-brown p-4 rounded-brutalist shadow-brutalist-sm text-center">
      <div className="text-[10px] font-black uppercase opacity-60 mb-1">{label}</div>
      <div className="text-3xl font-black">{value.toFixed(1)}</div>
    </div>
  );
}
