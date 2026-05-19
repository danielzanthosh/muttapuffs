export function getAuthCallbackUrl(requestUrl: string, fallbackSiteUrl?: string) {
  try {
    return new URL("/auth/callback", new URL(requestUrl).origin).toString();
  } catch {
    const baseUrl = fallbackSiteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://muttapuffs.vercel.app";
    return new URL("/auth/callback", baseUrl).toString();
  }
}

export function getSafeAuthNextPath(nextPath: string | null, fallback = "/profile") {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return fallback;
  }

  return nextPath;
}
