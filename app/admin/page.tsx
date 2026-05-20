import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { deleteBakery, deletePhoto, deleteReview, setProfileAdmin } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";

export default async function AdminPage() {
  const { supabase } = await requireAdmin();
  const [profilesResult, bakeriesResult, reviewsResult, photosResult] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(25),
    supabase.from("bakeries").select("id, name, city, district, created_at").order("created_at", { ascending: false }).limit(25),
    supabase
      .from("reviews")
      .select("id, title, review_text, created_at, profiles(username), bakeries(name)")
      .order("created_at", { ascending: false })
      .limit(25),
    supabase.from("review_photos").select("id, cloudinary_url, created_at, profiles(username)").order("created_at", { ascending: false }).limit(25),
  ]);

  const profiles = profilesResult.data || [];
  const bakeries = bakeriesResult.data || [];
  const reviews = reviewsResult.data || [];
  const photos = photosResult.data || [];

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 pb-20 pt-6 md:pt-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <div className="comic-badge mb-4 bg-tomato-red text-white">ADMIN BOARD</div>
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl">Manage MuttaPuffs</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <AdminStat label="Profiles" value={profiles.length} />
            <AdminStat label="Bakeries" value={bakeries.length} />
            <AdminStat label="Reviews" value={reviews.length} />
            <AdminStat label="Photos" value={photos.length} />
          </div>

          <AdminSection title="Profiles">
            {profiles.map((profile) => (
              <div key={profile.id} className="grid gap-3 border-b-2 border-dashed border-chocolate-brown/20 py-3 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="font-black">@{profile.username}</div>
                  <div className="text-sm font-bold opacity-60">{profile.full_name || "No name"} {profile.is_admin ? " / Admin" : ""}</div>
                </div>
                <form action={setProfileAdmin}>
                  <input type="hidden" name="id" value={profile.id} />
                  <input type="hidden" name="is_admin" value={String(!profile.is_admin)} />
                  <button className="btn-secondary px-4 py-2 text-sm">
                    {profile.is_admin ? "Remove Admin" : "Make Admin"}
                  </button>
                </form>
              </div>
            ))}
          </AdminSection>

          <AdminSection title="Bakeries">
            {bakeries.map((bakery) => (
              <AdminRow key={bakery.id} title={bakery.name} meta={`${bakery.city}, ${bakery.district || "Kerala"}`} action={deleteBakery} id={bakery.id} />
            ))}
          </AdminSection>

          <AdminSection title="Reviews">
            {reviews.map((review) => (
              <AdminRow
                key={review.id}
                title={review.title || review.review_text.slice(0, 70)}
                meta={`${readJoinedValue(review.profiles, "username") || "Unknown"} at ${readJoinedValue(review.bakeries, "name") || "Unknown bakery"}`}
                action={deleteReview}
                id={review.id}
              />
            ))}
          </AdminSection>

          <AdminSection title="Photos">
            {photos.map((photo) => (
              <AdminRow
                key={photo.id}
                title={photo.cloudinary_url}
                meta={`Uploaded by ${readJoinedValue(photo.profiles, "username") || "Unknown"}`}
                action={deletePhoto}
                id={photo.id}
              />
            ))}
          </AdminSection>
        </div>
      </main>
      <Footer />
    </>
  );
}

function readJoinedValue<T extends string>(value: unknown, key: T) {
  const record = Array.isArray(value) ? value[0] : value;
  if (record && typeof record === "object" && key in record) {
    const field = (record as Record<T, unknown>)[key];
    return typeof field === "string" ? field : null;
  }

  return null;
}

function AdminStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-sm">
      <div className="font-comic text-xs font-black uppercase opacity-60">{label}</div>
      <div className="text-4xl font-black">{value}</div>
    </div>
  );
}

function AdminSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-4 border-chocolate-brown bg-white p-5 shadow-brutalist-md">
      <h2 className="mb-4 text-2xl font-black tracking-tight">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

function AdminRow({
  action,
  id,
  meta,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  meta: string;
  title: string;
}) {
  return (
    <div className="grid gap-3 border-b-2 border-dashed border-chocolate-brown/20 py-3 md:grid-cols-[1fr_auto] md:items-center">
      <div className="min-w-0">
        <div className="truncate font-black">{title}</div>
        <div className="text-sm font-bold opacity-60">{meta}</div>
      </div>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <button className="rounded-brutalist border-3 border-chocolate-brown bg-tomato-red px-4 py-2 text-sm font-black uppercase text-white shadow-brutalist-sm">
          Delete
        </button>
      </form>
    </div>
  );
}
