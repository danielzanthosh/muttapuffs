import { NextResponse, type NextRequest } from "next/server";
import { getSafeAuthNextPath } from "@/lib/auth-redirect";
import { buildOAuthProfileDraft } from "@/lib/oauth-profile";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeAuthNextPath(requestUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.exchangeCodeForSession(code);

    if (user) {
      await supabase.from("profiles").upsert(
        buildOAuthProfileDraft({
          id: user.id,
          email: user.email,
          metadata: user.user_metadata,
        }),
        { onConflict: "id", ignoreDuplicates: true }
      );
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
