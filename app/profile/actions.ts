"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formValue, normalizeUsername, profileSchema } from "@/lib/validation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const parsed = profileSchema.safeParse({
    username: formValue(formData, "username"),
    full_name: formValue(formData, "full_name"),
    avatar_url: formValue(formData, "avatar_url"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid profile details." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username: normalizeUsername(parsed.data.username),
      full_name: parsed.data.full_name,
      avatar_url: parsed.data.avatar_url,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/edit");
  return { success: true };
}
