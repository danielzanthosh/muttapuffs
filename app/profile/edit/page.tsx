import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/profile-forms";
import { buildOAuthProfileDraft } from "@/lib/oauth-profile";

export default async function EditProfilePage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  let profile = existingProfile;

  if (!profile) {
    const { data: createdProfile } = await supabase
      .from("profiles")
      .insert(
        buildOAuthProfileDraft({
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        })
      )
      .select("*")
      .single();

    profile = createdProfile;
  }

  if (!profile) {
    redirect("/profile");
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper px-4 pb-20 pt-6 md:pt-8">
        <EditProfileForm profile={profile} />
      </main>
      <Footer />
    </>
  );
}
