"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { formValue } from "@/lib/validation";

export async function deleteBakery(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formValue(formData, "id");

  if (!id) return;

  const { error } = await supabase.from("bakeries").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/bakeries");
}

export async function deleteReview(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formValue(formData, "id");

  if (!id) return;

  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/bakeries");
}

export async function deletePhoto(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = formValue(formData, "id");

  if (!id) return;

  const { error } = await supabase.from("review_photos").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}

export async function setProfileAdmin(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const id = formValue(formData, "id");
  const isAdmin = formData.get("is_admin") === "true";

  if (!id) return;
  if (id === user.id && !isAdmin) return;

  const { error } = await supabase.from("profiles").update({ is_admin: isAdmin }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}
