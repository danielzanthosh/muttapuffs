import { NextResponse } from "next/server";
import {
  buildCloudinarySignaturePayload,
  getCloudinaryServerConfig,
} from "@/lib/cloudinary-signature";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const config = getCloudinaryServerConfig();

  if (!config.ok) {
    return NextResponse.json(
      { error: `Missing Cloudinary env vars: ${config.missing.join(", ")}` },
      { status: 500 }
    );
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Sign in before uploading puff proof." }, { status: 401 });
    }
  }

  return NextResponse.json(buildCloudinarySignaturePayload(config.config));
}
