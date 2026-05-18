"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, SortDesc } from "lucide-react";

export function BakeryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [city, setCity] = useState(searchParams.get("city") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const currentParams = useMemo(() => new URLSearchParams(searchParams.toString()), [searchParams]);

  const handleChange = (newFilters: { search?: string; city?: string; sort?: string }) => {
    const next = { search, city, sort, ...newFilters };
    const params = new URLSearchParams(currentParams);

    Object.entries(next).forEach(([key, value]) => {
      if (!value || value === "all" || (key === "sort" && value === "newest")) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  };

  return (
    <div className="mb-8 border-4 border-chocolate-brown bg-white p-4 shadow-brutalist-md">
      <div className="mb-3 flex items-center justify-between gap-3 border-b-2 border-dashed border-chocolate-brown/20 pb-3">
        <span className="font-comic text-xs font-black uppercase tracking-wide">Bakery Radar Controls</span>
        {isPending && <span className="text-[10px] font-black uppercase text-tomato-red">Scanning</span>}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
          <input
            type="search"
            placeholder="Search bakery case files..."
            className="w-full border-3 border-chocolate-brown bg-bakery-cream py-3 pl-10 pr-4 font-bold outline-none focus:ring-2 focus:ring-warm-orange"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              handleChange({ search: event.target.value });
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:w-[420px]">
          <label className="relative">
            <span className="sr-only">Filter by city</span>
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={16} />
            <select
              className="w-full appearance-none border-3 border-chocolate-brown bg-bakery-cream py-3 pl-10 pr-8 font-bold outline-none focus:ring-2 focus:ring-warm-orange"
              value={city}
              onChange={(event) => {
                setCity(event.target.value);
                handleChange({ city: event.target.value });
              }}
            >
              <option value="all">All Cities</option>
              <option value="Kochi">Kochi</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram</option>
              <option value="Kozhikode">Kozhikode</option>
              <option value="Thrissur">Thrissur</option>
            </select>
          </label>

          <label className="relative">
            <span className="sr-only">Sort bakeries</span>
            <SortDesc className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={16} />
            <select
              className="w-full appearance-none border-3 border-chocolate-brown bg-bakery-cream py-3 pl-10 pr-8 font-bold outline-none focus:ring-2 focus:ring-warm-orange"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                handleChange({ sort: event.target.value });
              }}
            >
              <option value="newest">Newest</option>
              <option value="top-rated">Top Rated</option>
              <option value="most-reviewed">Most Reported</option>
              <option value="lowest-scam">Lowest Scam</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
