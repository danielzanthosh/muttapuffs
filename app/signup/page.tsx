import { createClient } from "@/lib/supabase/server";
import { SignupForm } from "@/components/auth-forms";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const hasSupabaseEnv = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (hasSupabaseEnv) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      redirect("/profile");
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-20 bg-bakery-paper relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 left-[10%] comic-badge bg-tomato-red rotate-[-5deg] opacity-20 hidden md:block">SCAM ALERT</div>
        <div className="absolute bottom-20 right-[10%] comic-badge bg-egg-yellow rotate-[10deg] opacity-20 hidden md:block">MUTTA LOVER</div>

        <SignupForm />
      </main>
      <Footer />
    </>
  );
}
