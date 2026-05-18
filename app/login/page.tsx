import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth-forms";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";

export default async function LoginPage() {
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
        <div className="absolute top-10 right-[10%] comic-badge bg-warm-orange rotate-[5deg] opacity-20 hidden md:block">PUFF RADAR</div>
        <div className="absolute bottom-10 left-[10%] comic-badge bg-egg-yellow rotate-[-10deg] opacity-20 hidden md:block">LEGENDARY BITES</div>
        
        <LoginForm />
      </main>
      <Footer />
    </>
  );
}
