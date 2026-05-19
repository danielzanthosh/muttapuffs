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
      folder: "muttameter/proof",
      timestamp: 1_716_000_000,
      signature: "1505a9548bd7d07a93536805705bd5cff874cc18",
    });
    expect(payload).not.toHaveProperty("uploadPreset");
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
