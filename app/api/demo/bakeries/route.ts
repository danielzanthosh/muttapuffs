import { NextResponse } from "next/server";
import { addDemoBakery } from "@/lib/demo-store";
import { bakerySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = bakerySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid bakery details." }, { status: 400 });
  }

  const bakery = addDemoBakery(parsed.data);
  return NextResponse.json({ bakery });
}
