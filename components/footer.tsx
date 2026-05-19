"use client";

import Link from "next/link";

export function CTA() {
  return (
    <section className="py-24 px-4">
      <div 
        className="max-w-5xl mx-auto bg-warm-orange border-4 border-chocolate-brown rounded-brutalist p-12 text-center relative overflow-hidden shadow-brutalist-lg"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3E2723 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
        
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white drop-shadow-[4px_4px_0px_rgba(62,39,35,1)]">
            Ready to end the <br /> puff mystery?
          </h2>
          <p className="text-xl md:text-2xl font-bold mb-10 text-chocolate-brown max-w-2xl mx-auto">
            Join thousands of investigators mapping the best (and worst) bakeries in Kerala.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup" className="btn-primary px-12 py-5 text-xl sm:scale-110">
              Join the Community
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-4 flex-wrap">
            <span className="comic-badge bg-white">12,402 INVESTIGATIONS</span>
            <span className="comic-badge bg-egg-yellow">842 SCAMS REVEALED</span>
            <span className="comic-badge bg-white">100% MUTTA LOVERS</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-white border-t-4 border-chocolate-brown pt-16 pb-8 px-4 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="font-comic font-black text-3xl mb-6">
            Mutta<span className="text-warm-orange">Meter</span>
          </div>
          <p className="text-lg font-medium max-w-sm mb-6">
            The world&apos;s first community-powered investigation platform 
            dedicated to the art and science of the Kerala mutta puff.
          </p>
          <div className="flex gap-4">
            <SocialIcon label="TW" />
            <SocialIcon label="IG" />
            <SocialIcon label="FB" />
          </div>
        </div>
        
        <div>
          <h4 className="font-comic font-black text-xl mb-6 uppercase">Mission</h4>
          <ul className="space-y-3 font-bold opacity-80">
            <li><Link href="/map" className="hover:text-warm-orange">Bakery Map</Link></li>
            <li><Link href="/leaderboards" className="hover:text-warm-orange">The Mutta Score</Link></li>
            <li><Link href="/bakeries" className="hover:text-warm-orange">Report a Scam</Link></li>
            <li><Link href="/signup" className="hover:text-warm-orange">Community Hall</Link></li>
            <li><Link href="#" className="hover:text-warm-orange text-tomato-red italic underline underline-offset-4">Give Feedback</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-comic font-black text-xl mb-6 uppercase">Legal</h4>
          <ul className="space-y-3 font-bold opacity-80">
            <li><a href="#" className="hover:text-warm-orange">Terms of Service</a></li>
            <li><a href="#" className="hover:text-warm-orange">Puff Privacy</a></li>
            <li><a href="#" className="hover:text-warm-orange">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t-2 border-chocolate-brown/10 pt-8 text-center font-bold text-sm opacity-60">
        (C) 2026 MUTTAMETER. BUILT WITH MASALA AND LOVE IN KERALA.
      </div>
    </footer>
  );
}

function SocialIcon({ label }: { label: string }) {
  return (
    <div className="w-10 h-10 bg-white border-3 border-chocolate-brown rounded-brutalist flex items-center justify-center font-comic font-black text-xs shadow-brutalist-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer">
      {label}
    </div>
  );
}
