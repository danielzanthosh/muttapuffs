import { normalizeUsername } from "./validation";

interface OAuthProfileInput {
  id: string;
  email?: string | null;
  metadata: Record<string, unknown>;
}

export function buildOAuthProfileDraft({ id, email, metadata }: OAuthProfileInput) {
  const metadataUsername =
    typeof metadata.user_name === "string"
      ? metadata.user_name
      : typeof metadata.name === "string"
        ? metadata.name
        : "";
  const emailName = email?.split("@")[0] || "puff_detective";
  const rawUsername = metadataUsername || emailName;
  const username = normalizeUsername(rawUsername)
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return {
    id,
    username: `${username || "puff_detective"}_${id.slice(0, 8)}`,
    full_name: typeof metadata.full_name === "string" ? metadata.full_name : metadata.name || null,
    avatar_url: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    is_admin: false,
  };
}
