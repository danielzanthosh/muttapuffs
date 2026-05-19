import { describe, expect, it } from "vitest";
import { buildOAuthProfileDraft } from "../lib/oauth-profile";

describe("buildOAuthProfileDraft", () => {
  it("creates a valid profile draft from Google metadata", () => {
    expect(
      buildOAuthProfileDraft({
        id: "12345678-aaaa-bbbb-cccc-123456789abc",
        email: "daniel@example.com",
        metadata: {
          name: "Daniel Z!",
          avatar_url: "https://example.com/avatar.png",
        },
      })
    ).toEqual({
      id: "12345678-aaaa-bbbb-cccc-123456789abc",
      username: "daniel_z_12345678",
      full_name: "Daniel Z!",
      avatar_url: "https://example.com/avatar.png",
    });
  });

  it("falls back to the email name when Google metadata is sparse", () => {
    expect(
      buildOAuthProfileDraft({
        id: "abcdef12-aaaa-bbbb-cccc-123456789abc",
        email: "puff.detective@example.com",
        metadata: {},
      }).username
    ).toBe("puff_detective_abcdef12");
  });
});
