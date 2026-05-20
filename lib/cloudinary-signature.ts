import { createHash } from "crypto";

const CLOUDINARY_FOLDERS = {
  avatar: "muttapuffs/avatars",
  proof: "muttapuffs/proof",
} as const;

export type CloudinaryUploadKind = keyof typeof CLOUDINARY_FOLDERS;

export interface CloudinaryServerConfig {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface CloudinarySignaturePayload {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
}

export function getCloudinaryServerConfig(
  env: NodeJS.ProcessEnv = process.env
): { ok: true; config: CloudinaryServerConfig } | { ok: false; missing: string[] } {
  const required = {
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: env.CLOUDINARY_API_SECRET,
  };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    return { ok: false, missing };
  }

  return {
    ok: true,
    config: {
      cloudName: required.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
      apiKey: required.CLOUDINARY_API_KEY!,
      apiSecret: required.CLOUDINARY_API_SECRET!,
    },
  };
}

export function buildCloudinarySignaturePayload(
  config: CloudinaryServerConfig,
  timestamp = Math.round(Date.now() / 1000),
  kind: CloudinaryUploadKind = "proof"
): CloudinarySignaturePayload {
  const folder = CLOUDINARY_FOLDERS[kind];
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}${config.apiSecret}`;
  const signature = createHash("sha1").update(paramsToSign).digest("hex");

  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder,
    timestamp,
    signature,
  };
}

export function parseCloudinaryUploadKind(value: unknown): CloudinaryUploadKind {
  return value === "avatar" ? "avatar" : "proof";
}
