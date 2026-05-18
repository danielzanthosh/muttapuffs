import { NextResponse } from "next/server";
import { addDemoReview } from "@/lib/demo-store";
import { reviewSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.bakery_id || typeof body.bakery_id !== "string") {
    return NextResponse.json({ error: "Missing bakery case file." }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid review details." }, { status: 400 });
  }

  const review = addDemoReview({
    bakery_id: body.bakery_id,
    ...parsed.data,
  });

  return NextResponse.json({ review });
}
