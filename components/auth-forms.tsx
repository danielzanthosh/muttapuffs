"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { login, signInWithGoogle, signup } from "@/app/auth/actions";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  function handleGoogleSignIn() {
    setError(null);
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="brutalist-card w-full max-w-md bg-white p-6 sm:rotate-[1deg] sm:p-8">
      <div className="comic-badge mb-6 bg-egg-yellow">WELCOME BACK</div>
      <h2 className="mb-6 text-2xl font-black tracking-tighter sm:text-3xl">Enter the Bakery Board</h2>

      {error && (
        <div className="mb-4 border-3 border-chocolate-brown bg-tomato-red p-3 text-sm font-black text-white">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-comic text-sm font-bold uppercase">Email Address</label>
          <input
            name="email"
            type="email"
            required
            placeholder="detective@muttapuffs.com"
            className="w-full rounded-brutalist border-3 border-chocolate-brown bg-bakery-cream p-3 font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
        </div>

        <div className="space-y-2">
          <label className="font-comic text-sm font-bold uppercase">Secret Password</label>
          <input
            name="password"
            type="password"
            required
            placeholder="password"
            className="w-full rounded-brutalist border-3 border-chocolate-brown bg-bakery-cream p-3 font-bold focus:outline-none focus:ring-2 focus:ring-warm-orange"
          />
        </div>

        <button disabled={isPending} className="btn-primary w-full py-4 text-xl disabled:opacity-50">
          {isPending ? "SEARCHING FILES..." : "LOGIN TO HUNT"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-0.5 flex-1 bg-chocolate-brown/20" />
        <span className="text-[10px] font-black uppercase opacity-60">or</span>
        <div className="h-0.5 flex-1 bg-chocolate-brown/20" />
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-3 rounded-brutalist border-3 border-chocolate-brown bg-white px-4 py-4 text-sm font-black uppercase shadow-brutalist-sm transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
      >
        <div className="grid size-6 place-items-center rounded-full border-2 border-chocolate-brown bg-white p-0.5">
          <Image src="/google.svg" alt="Google Logo" width={16} height={16} />
        </div>
        Sign in with Google
      </button>

      <p className="mt-6 text-center text-sm font-bold">
        New to the investigation?{" "}
        <Link href="/signup" className="text-warm-orange underline decoration-2">
          Create an ID
        </Link>
      </p>
    </div>
  );
}

export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) setError(result.error);
    });
  }

  function handleGoogleSignIn() {
    setError(null);
    startTransition(async () => {
      const result = await signInWithGoogle();
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="brutalist-card w-full max-w-md bg-white p-6 sm:rotate-[-1deg] sm:p-8">
      <div className="comic-badge mb-6 bg-warm-orange text-white">ENLIST NOW</div>
      <h2 className="mb-6 text-2xl font-black tracking-tighter sm:text-3xl">Join the Puff Hunt</h2>

      {error && (
        <div className="mb-4 border-3 border-chocolate-brown bg-tomato-red p-3 text-sm font-black text-white">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-comic text-sm font-bold uppercase">Detective Username</label>
          <input
            name="username"
            type="text"
            required
            placeholder="puff_finder_99"
            className="w-full rounded-brutalist border-3 border-chocolate-brown bg-bakery-cream p-3 font-bold focus:outline-none focus:ring-2 focus:ring-egg-yellow"
          />
        </div>

        <div className="space-y-2">
          <label className="font-comic text-sm font-bold uppercase">Email Address</label>
          <input
            name="email"
            type="email"
            required
            placeholder="detective@muttapuffs.com"
            className="w-full rounded-brutalist border-3 border-chocolate-brown bg-bakery-cream p-3 font-bold focus:outline-none focus:ring-2 focus:ring-egg-yellow"
          />
        </div>

        <div className="space-y-2">
          <label className="font-comic text-sm font-bold uppercase">Secure Password</label>
          <input
            name="password"
            type="password"
            required
            placeholder="password"
            className="w-full rounded-brutalist border-3 border-chocolate-brown bg-bakery-cream p-3 font-bold focus:outline-none focus:ring-2 focus:ring-egg-yellow"
          />
        </div>

        <button disabled={isPending} className="btn-primary w-full py-4 text-xl disabled:opacity-50">
          {isPending ? "PROCESSING..." : "REGISTER FOR DUTY"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-0.5 flex-1 bg-chocolate-brown/20" />
        <span className="text-[10px] font-black uppercase opacity-60">or</span>
        <div className="h-0.5 flex-1 bg-chocolate-brown/20" />
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={handleGoogleSignIn}
        className="flex w-full items-center justify-center gap-3 rounded-brutalist border-3 border-chocolate-brown bg-white px-4 py-4 text-sm font-black uppercase shadow-brutalist-sm transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
      >
        <div className="grid size-6 place-items-center rounded-full border-2 border-chocolate-brown bg-white p-0.5">
          <Image src="/google.svg" alt="Google Logo" width={16} height={16} />
        </div>
        Sign up with Google
      </button>

      <p className="mt-6 text-center text-sm font-bold">
        Already a detective?{" "}
        <Link href="/login" className="text-warm-orange underline decoration-2">
          Login here
        </Link>
      </p>
    </div>
  );
}
