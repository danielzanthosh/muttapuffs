"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { bakerySchema, slugify } from "@/lib/validation";

export function BakeryForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const supabase = hasSupabaseEnv ? createClient() : null;

  async function handleSubmit(formData: FormData) {
    setError(null);
    const parsed = bakerySchema.safeParse({
      name: formData.get("name"),
      city: formData.get("city"),
      district: formData.get("district"),
      description: formData.get("description"),
      address: formData.get("address"),
      phone: formData.get("phone"),
      latitude: formData.get("latitude") || null,
      longitude: formData.get("longitude") || null,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Check the bakery case file.");
      return;
    }

    const { name, city, district, description, address, phone, latitude, longitude } = parsed.data;
    const slug = slugify(name);

    startTransition(async () => {
      if (!hasSupabaseEnv) {
        const response = await fetch("/api/demo/bakeries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Could not add demo bakery.");
          return;
        }

        router.push("/bakeries");
        router.refresh();
        return;
      }

      const { data: { user } } = await supabase!.auth.getUser();
      if (!user) {
        setError("You must be logged in to add a bakery.");
        return;
      }

      const { error: insertError } = await supabase!
        .from("bakeries")
        .insert({
          name,
          slug,
          city,
          district,
          description,
          address,
          phone,
          latitude,
          longitude,
          created_by: user.id
        });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("A bakery with this name already exists.");
        } else {
          setError(insertError.message);
        }
        return;
      }

      router.push("/bakeries");
      router.refresh();
    });
  }

  return (
    <div className="brutalist-card p-8 bg-white max-w-3xl w-full mx-auto">
      <div className="comic-badge bg-warm-orange text-white mb-6">NEW INVESTIGATION SITE</div>
      <h2 className="text-3xl font-black mb-8 tracking-tighter">Register a New Bakery</h2>

      {error && (
        <div className="p-4 mb-6 bg-tomato-red text-white border-3 border-chocolate-brown rounded-brutalist font-bold">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-comic font-bold text-sm uppercase">Bakery Name</label>
            <input 
              name="name"
              type="text"
              required
              placeholder="Ann's Famous Bakery"
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            />
          </div>

          <div className="space-y-2">
            <label className="font-comic font-bold text-sm uppercase">City / Town</label>
            <input 
              name="city"
              type="text"
              required
              placeholder="Kochi"
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            />
          </div>

          <div className="space-y-2">
            <label className="font-comic font-bold text-sm uppercase">District</label>
            <select 
              name="district"
              required
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            >
              <option value="Ernakulam">Ernakulam</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram</option>
              <option value="Kozhikode">Kozhikode</option>
              <option value="Thrissur">Thrissur</option>
              <option value="Kollam">Kollam</option>
              <option value="Palakkad">Palakkad</option>
              <option value="Malappuram">Malappuram</option>
              <option value="Kannur">Kannur</option>
              <option value="Alappuzha">Alappuzha</option>
              <option value="Kottayam">Kottayam</option>
              <option value="Kasaragod">Kasaragod</option>
              <option value="Idukki">Idukki</option>
              <option value="Pathanamthitta">Pathanamthitta</option>
              <option value="Wayanad">Wayanad</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-comic font-bold text-sm uppercase">Phone (Optional)</label>
            <input 
              name="phone"
              type="text"
              placeholder="+91 98765 43210"
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-comic font-bold text-sm uppercase">Full Address</label>
          <input 
            name="address"
            type="text"
            placeholder="Opposite Civil Station, MG Road..."
            className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="font-comic font-bold text-sm uppercase">Latitude (Optional)</label>
            <input
              name="latitude"
              type="number"
              step="any"
              placeholder="9.9656"
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            />
          </div>

          <div className="space-y-2">
            <label className="font-comic font-bold text-sm uppercase">Longitude (Optional)</label>
            <input
              name="longitude"
              type="number"
              step="any"
              placeholder="76.2424"
              className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-comic font-bold text-sm uppercase">Investigation Notes (Description)</label>
          <textarea 
            name="description"
            rows={4}
            placeholder="What's the vibe? Any legendary items besides puffs?"
            className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            disabled={isPending}
            type="submit"
            className="btn-primary flex-grow text-xl py-4 disabled:opacity-50"
          >
            {isPending ? "REGISTERING..." : "DEPLOY RADAR"}
          </button>
          <button 
            type="button"
            onClick={() => router.back()}
            className="btn-secondary px-8 text-xl"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
