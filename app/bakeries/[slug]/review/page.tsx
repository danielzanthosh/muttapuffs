import { getBakeryBySlug } from "@/lib/supabase/queries";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ReviewForm } from "@/components/review-form";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";

export default async function CreateReviewPage({ params }: { params: { slug: string } }) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect(`/login?next=/bakeries/${params.slug}/review`);
    }
  }

  const bakery = await getBakeryBySlug(params.slug);

  if (!bakery) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="comic-badge bg-white mb-4 uppercase">INVESTIGATION IN PROGRESS</div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Reporting on <span className="text-warm-orange">{bakery.name}</span>
            </h1>
          </div>

          <ReviewForm bakeryId={bakery.id} bakerySlug={bakery.slug} />
        </div>
      </main>
      <Footer />
    </>
  );
}
