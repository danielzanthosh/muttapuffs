"use client";

import { useTransition, useState } from "react";
import { updateProfile } from "@/app/profile/actions";
import { Profile } from "@/types/bakery";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Profile identity updated!" });
      }
    });
  }

  return (
    <div className="brutalist-card p-8 bg-white max-w-2xl w-full mx-auto">
      <div className="comic-badge bg-egg-yellow mb-6">MODIFY IDENTITY</div>
      <h2 className="text-3xl font-black mb-8 tracking-tighter">Update Your Bakery Identity</h2>

      {message && (
        <div className={`p-4 mb-6 border-3 border-chocolate-brown rounded-brutalist font-bold ${
          message.type === "success" ? "bg-green-100 text-green-800" : "bg-tomato-red text-white"
        }`}>
          {message.text}
        </div>
      )}
      
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-comic font-bold text-sm uppercase">Detective Username</label>
          <input 
            name="username"
            type="text"
            required
            defaultValue={profile.username}
            placeholder="puff_finder_99"
            className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
          <p className="text-xs font-bold opacity-60 italic">Must be URL safe (lowercase, no spaces).</p>
        </div>

        <div className="space-y-2">
          <label className="font-comic font-bold text-sm uppercase">Full Name</label>
          <input 
            name="full_name"
            type="text"
            defaultValue={profile.full_name || ""}
            placeholder="Inspector Puffs"
            className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
        </div>

        <div className="space-y-2">
          <label className="font-comic font-bold text-sm uppercase">Avatar Image URL</label>
          <input 
            name="avatar_url"
            type="text"
            defaultValue={profile.avatar_url || ""}
            placeholder="https://example.com/avatar.jpg"
            className="w-full bg-bakery-cream border-3 border-chocolate-brown p-3 rounded-brutalist font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            disabled={isPending}
            type="submit"
            className="btn-primary flex-grow text-xl py-4 disabled:opacity-50"
          >
            {isPending ? "SAVING CHANGES..." : "SAVE IDENTITY"}
          </button>
          <a 
            href="/profile"
            className="btn-secondary flex-grow text-center text-xl py-4"
          >
            CANCEL
          </a>
        </div>
      </form>
    </div>
  );
}
