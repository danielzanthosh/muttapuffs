/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BakeryList } from "../components/bakery-list";
import type { BakeryWithStats } from "../types/bakery";

vi.mock("gsap", () => ({
  default: {
    from: vi.fn(),
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/bakeries",
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const sampleBakery: BakeryWithStats = {
  id: "bakery-best-bakers",
  name: "Best Bakers",
  slug: "best-bakers",
  description: "",
  address: "Central Junction",
  city: "Karukachal",
  district: "Kottayam",
  latitude: null,
  longitude: null,
  phone: null,
  created_by: null,
  created_at: "2026-05-01T00:00:00.000Z",
  updated_at: "2026-05-12T00:00:00.000Z",
  bakery_badges: [
    {
      id: "badge-clean",
      bakery_id: "bakery-best-bakers",
      badge_type: "community_favorite",
      label: "Clean Watch",
      created_at: "2026-05-01T00:00:00.000Z",
    },
  ],
  stats: {
    avgOverall: 8.3,
    avgEgg: 7.5,
    avgScam: 1.2,
    avgTaste: 8.8,
    avgFreshness: 8.1,
    avgPrice: 7.2,
    reviewCount: 4,
  },
};

describe("BakeryList detail modal", () => {
  afterEach(() => {
    cleanup();
    document.body.style.overflow = "";
  });

  beforeEach(() => {
    window.history.replaceState({}, "", "/bakeries");
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("opens bakery details without navigating to a slug route", () => {
    render(<BakeryList bakeries={[sampleBakery]} />);

    fireEvent.click(screen.getByRole("button", { name: /best bakers/i }));

    expect(window.location.pathname).toBe("/bakeries");
    expect(screen.getByRole("dialog", { name: /best bakers/i })).toBeTruthy();
    expect(screen.getByText("No investigation notes available yet.")).toBeTruthy();
    expect(screen.getAllByText(/CASE FILE/i).length).toBeGreaterThan(1);
    expect(screen.getByText(/4 community reports filed/i)).toBeTruthy();
  });

  it("switches to review form view and back", () => {
    render(<BakeryList bakeries={[sampleBakery]} />);

    fireEvent.click(screen.getByRole("button", { name: /best bakers/i }));
    fireEvent.click(screen.getByRole("button", { name: /give remarks/i }));

    expect(screen.getByText(/File a Field Investigation/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /file investigation/i })).toBeTruthy();

    // Go back
    fireEvent.click(screen.getByRole("button", { name: "" })); // The back button with ArrowLeft icon
    expect(screen.queryByText(/File a Field Investigation/i)).toBeNull();
  });

  it("closes bakery details with Escape", () => {
    render(<BakeryList bakeries={[sampleBakery]} />);

    fireEvent.click(screen.getByRole("button", { name: /best bakers/i }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: /best bakers/i })).toBeNull();
    expect(window.location.pathname).toBe("/bakeries");
  });
});
