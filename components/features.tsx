"use client";

import { useRef, useEffect } from "react";
import { 
  BarChart3, 
  Camera, 
  AlertTriangle, 
  MapPin, 
  MessageSquare, 
  Trophy 
} from "lucide-react";
import gsap from "gsap";

const features = [
  {
    title: "Mutta Score",
    description: "Real-time egg-to-masala ratio analysis for every puff in the city.",
    icon: BarChart3,
    color: "bg-egg-yellow",
  },
  {
    title: "Puff Proof Photos",
    description: "User-submitted evidence of puff interiors. No more mystery bites.",
    icon: Camera,
    color: "bg-white",
  },
  {
    title: "Scam Alerts",
    description: "Warning sirens for bakeries serving empty puffs or 'masala-only' disappointments.",
    icon: AlertTriangle,
    color: "bg-tomato-red",
  },
  {
    title: "Bakery Radar",
    description: "Hyperlocal map finding the freshest puffs nearest to your current coordinates.",
    icon: MapPin,
    color: "bg-warm-orange",
  },
  {
    title: "Funny Reviews",
    description: "Legendary commentary from the community. 'Egg smell only' is just the beginning.",
    icon: MessageSquare,
    color: "bg-white",
  },
  {
    title: "Leaderboards",
    description: "Compete for the title of 'Ultimate Puff Investigator' in your neighborhood.",
    icon: Trophy,
    color: "bg-egg-yellow",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    const cards = grid?.children;
    if (!grid || !cards || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      gsap.fromTo(cards, 
        { y: 28 },
        {
          y: 0,
          duration: 0.55,
          stagger: 0.06,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    }, {
      rootMargin: "0px 0px -15% 0px",
      threshold: 0.15,
    });

    observer.observe(grid);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-4 bg-bakery-paper border-y-4 border-chocolate-brown"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="comic-badge bg-white mb-4">THE TOOLKIT</div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
            Built for the serious <br /> puff investigator.
          </h2>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <div 
              key={i} 
              className="brutalist-card p-8 group"
            >
              <div className={`w-14 h-14 ${feature.color} border-3 border-chocolate-brown rounded-brutalist flex items-center justify-center mb-6 shadow-brutalist-sm group-hover:-rotate-6 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
              <p className="font-medium opacity-80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
