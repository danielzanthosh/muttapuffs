"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthCallbackUrl } from "@/lib/auth-redirect";
import { createClient } from "@/lib/supabase/server";
import { authSchema, formValue, normalizeUsername, signupSchema } from "@/lib/validation";

export async function login(formData: FormData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Supabase environment variables are required for authentication." };
  }

  const supabase = await createClient();

  const parsed = authSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid login details." };
  }

  const { email, password } = parsed.data;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function signup(formData: FormData) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Supabase environment variables are required for signup." };
  }

  const supabase = await createClient();

  const parsed = signupSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    username: formValue(formData, "username"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid signup details." };
  }

  const { email, password, username } = parsed.data;
  const normalizedUsername = normalizeUsername(username);

  // 1. Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: normalizedUsername,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  // 2. Create the profile row (if it doesn't already exist via trigger)
  // Our schema init.sql didn't include a trigger for profile creation,
  // so we do it manually here.
  if (authData.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{
        id: authData.user.id,
        username: normalizedUsername,
      }]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
      // We don't necessarily want to fail signup if profile creation fails,
      // but in this app it's core data.
      return { error: "Auth succeeded but profile creation failed. Please try logging in." };
    }
  }

  revalidatePath("/", "layout");
  redirect("/profile");
}

export async function logout() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    redirect("/");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signInWithGoogle() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: "Supabase environment variables are required for Google sign-in." };
  }

  const supabase = await createClient();
  const headerStore = await headers();
  const origin =
    headerStore.get("origin") ||
    `${headerStore.get("x-forwarded-proto") || "http"}://${headerStore.get("host")}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: getAuthCallbackUrl(origin),
      queryParams: {
        prompt: "select_account",
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.url) {
    redirect(data.url);
  }

  return { error: "Google sign-in did not return a redirect URL." };
}
