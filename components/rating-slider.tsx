import { cn } from "@/lib/utils";

interface RatingSliderProps {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  description?: string;
}

export function RatingSlider({ label, name, value, onChange, description }: RatingSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <div>
          <label className="font-comic font-black text-sm uppercase block tracking-tight">{label}</label>
          {description && <p className="text-[10px] font-bold opacity-50 italic">{description}</p>}
        </div>
        <div className="bg-white border-3 border-chocolate-brown px-3 py-1 rounded-brutalist font-black text-xl shadow-brutalist-sm">
          {value}
        </div>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        name={name}
        aria-label={label}
        step="1"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={cn(
          "w-full h-4 rounded-full border-3 border-chocolate-brown appearance-none cursor-pointer accent-chocolate-brown",
          "hover:shadow-brutalist-sm transition-shadow bg-bakery-paper"
        )}
        style={{
          background: `linear-gradient(to right, var(--egg-yellow) ${value * 10}%, #F5F0E6 ${value * 10}%)`
        }}
      />
    </div>
  );
}
