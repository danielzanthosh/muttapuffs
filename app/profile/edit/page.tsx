import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/profile-forms";

export default async function EditProfilePage() {
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
    return <div>Profile not found.</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper py-20 px-4">
        <EditProfileForm profile={profile} />
      </main>
      <Footer />
    </>
  );
}
