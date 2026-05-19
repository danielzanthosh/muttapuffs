import { describe, expect, it } from "vitest";
import { getAuthCallbackUrl, getSafeAuthNextPath } from "../lib/auth-redirect";

describe("getAuthCallbackUrl", () => {
  it("builds a Supabase OAuth callback URL from the current origin", () => {
    expect(getAuthCallbackUrl("https://muttameter.vercel.app/login")).toBe(
      "https://muttameter.vercel.app/auth/callback"
    );
  });

  it("falls back to the configured site URL when the origin cannot be parsed", () => {
    expect(getAuthCallbackUrl("not-a-url", "https://preview.example")).toBe(
      "https://preview.example/auth/callback"
    );
  });
});

describe("getSafeAuthNextPath", () => {
  it("allows relative app paths", () => {
    expect(getSafeAuthNextPath("/bakeries/new")).toBe("/bakeries/new");
  });

  it("blocks external redirects", () => {
    expect(getSafeAuthNextPath("https://example.com/trap")).toBe("/profile");
    expect(getSafeAuthNextPath("//example.com/trap")).toBe("/profile");
  });
});
