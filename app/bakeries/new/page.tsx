import { createClient } from "@/lib/supabase/server";
import { BakeryForm } from "@/components/bakery-form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { redirect } from "next/navigation";

export default async function NewBakeryPage() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/login?next=/bakeries/new");
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-bakery-paper py-20 px-4">
        <BakeryForm />
      </main>
      <Footer />
    </>
  );
}
