import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import { logout } from "@/app/auth/actions";
import Link from "next/link";

export default async function ProfilePage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    // This shouldn't happen if signup action worked, but good to handle
    return <div>Profile not found. Please contact support.</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="brutalist-card bg-white overflow-hidden">
            {/* Header / Banner */}
            <div className="h-32 bg-egg-yellow border-b-3 border-chocolate-brown relative">
              <div className="absolute -bottom-12 left-8">
                <div className="w-24 h-24 bg-bakery-cream border-4 border-chocolate-brown rounded-brutalist shadow-brutalist-md overflow-hidden flex items-center justify-center">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black">ID</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-16 pb-8 px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <div className="comic-badge bg-warm-orange text-white mb-2 uppercase">PUFF DETECTIVE</div>
                  <h1 className="text-4xl font-black tracking-tighter mb-1">@{profile.username}</h1>
                  <p className="text-xl font-bold opacity-70">{profile.full_name || "Anonymous Investigator"}</p>
                </div>

                <div className="flex gap-4">
                  <Link 
                    href="/profile/edit"
                    className="btn-secondary py-2 px-6"
                  >
                    EDIT IDENTITY
                  </Link>
                  <form action={logout}>
                    <button className="btn-secondary bg-tomato-red text-white py-2 px-6 border-chocolate-brown">
                      LOGOUT
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="INVESTIGATIONS" value="0" />
                <StatCard label="SCAMS REVEALED" value="0" />
                <StatCard label="JOINED" value={new Date(profile.created_at).toLocaleDateString()} />
              </div>

              <div className="mt-12 p-8 border-3 border-dashed border-chocolate-brown/30 rounded-brutalist bg-bakery-cream text-center">
                <p className="font-comic font-bold text-xl opacity-40">
                  No investigations recorded yet. <br /> Get out there and find some puffs!
                </p>
                <Link href="/map" className="btn-primary mt-6 inline-block">
                  START PUFF HUNT
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bakery-paper border-3 border-chocolate-brown p-4 rounded-brutalist shadow-brutalist-sm">
      <div className="text-xs font-black uppercase opacity-60 mb-1 font-comic">{label}</div>
      <div className="text-2xl font-black tracking-tight">{value}</div>
    </div>
  );
}
