import { describe, expect, it } from "vitest";
import {
  buildCloudinarySignaturePayload,
  getCloudinaryServerConfig,
} from "../lib/cloudinary-signature";

describe("buildCloudinarySignaturePayload", () => {
  it("signs the proof upload params with the server API secret", () => {
    const payload = buildCloudinarySignaturePayload(
      {
        cloudName: "demo-cloud",
        apiKey: "demo-key",
        apiSecret: "demo-secret",
      },
      1_716_000_000
    );

    expect(payload).toEqual({
      cloudName: "demo-cloud",
      apiKey: "demo-key",
      folder: "muttapuffs/proof",
      timestamp: 1_716_000_000,
      signature: "612fc8b0ab829b8143bac635882d6fa5bc424dbe",
    });
    expect(payload).not.toHaveProperty("uploadPreset");
  });

  it("can sign avatar uploads into the avatar folder", () => {
    const payload = buildCloudinarySignaturePayload(
      {
        cloudName: "demo-cloud",
        apiKey: "demo-key",
        apiSecret: "demo-secret",
      },
      1_716_000_000,
      "avatar"
    );

    expect(payload.folder).toBe("muttapuffs/avatars");
    expect(payload.signature).toBe("cbe97a0c12ebc5c4b8080a1911a130a9e55fee9a");
  });
});

describe("getCloudinaryServerConfig", () => {
  it("reports all missing Cloudinary server env vars", () => {
    const config = getCloudinaryServerConfig({});

    expect(config).toEqual({
      ok: false,
      missing: [
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
      ],
    });
  });
});
