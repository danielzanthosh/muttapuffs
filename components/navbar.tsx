import { createClient } from "@/lib/supabase/server";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  let isSignedIn = false;
  let isAdmin = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    isSignedIn = Boolean(user);

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      isAdmin = Boolean(profile?.is_admin);
    }
  }

  return <NavbarClient isAdmin={isAdmin} isSignedIn={isSignedIn} />;
}
