import { createHash } from "crypto";

const CLOUDINARY_PROOF_FOLDER = "muttameter/proof";

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
  timestamp = Math.round(Date.now() / 1000)
): CloudinarySignaturePayload {
  const paramsToSign = `folder=${CLOUDINARY_PROOF_FOLDER}&timestamp=${timestamp}${config.apiSecret}`;
  const signature = createHash("sha1").update(paramsToSign).digest("hex");

  return {
    cloudName: config.cloudName,
    apiKey: config.apiKey,
    folder: CLOUDINARY_PROOF_FOLDER,
    timestamp,
    signature,
  };
}
