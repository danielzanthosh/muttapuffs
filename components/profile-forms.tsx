"use client";

import { useTransition, useState } from "react";
import { updateProfile } from "@/app/profile/actions";
import { Profile } from "@/types/bakery";
import { Camera, Loader2 } from "lucide-react";
import { compressImageClient, uploadToCloudinary, validateImageFile } from "@/lib/cloudinary";

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarProgress, setAvatarProgress] = useState(0);
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

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setMessage({ type: "error", text: validation.error || "Invalid avatar image." });
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarProgress(0);

    try {
      const compressed = await compressImageClient(file);
      const result = await uploadToCloudinary(compressed, setAvatarProgress, "avatar");
      setAvatarUrl(result.secure_url);
      setMessage({ type: "success", text: "Avatar uploaded. Save identity to keep it." });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Avatar upload failed.",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
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

        <div className="space-y-3">
          <label className="font-comic font-bold text-sm uppercase">Avatar Image</label>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-brutalist border-4 border-chocolate-brown bg-bakery-cream shadow-brutalist-sm">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- Client-side preview supports uploaded and remote avatar URLs.
                <img src={avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <Camera size={32} />
              )}
            </div>
            <div className="flex-1 space-y-3">
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-brutalist border-3 border-chocolate-brown bg-egg-yellow px-4 py-3 font-comic text-sm font-black uppercase shadow-brutalist-sm transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none">
                {isUploadingAvatar ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
                {isUploadingAvatar ? `Uploading ${avatarProgress}%` : "Upload Avatar"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              <p className="text-xs font-bold opacity-60 italic">Upload JPEG, PNG, or WebP. Or paste a URL below.</p>
            </div>
          </div>
          <input 
            name="avatar_url"
            type="text"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
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
