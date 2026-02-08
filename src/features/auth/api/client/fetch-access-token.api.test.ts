import { beforeEach, describe, expect, it, vi } from "vitest";

import { fetchAccessToken } from "./fetch-access-token.api";

import { authTokenHandlers } from "@/app/api/auth/token/__mock__/handlers";
import { server } from "@/test/msw-server";

describe("fetchAccessToken", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_LOCAL_URL", "http://localhost");
    server.resetHandlers();
    server.use(...authTokenHandlers);
  });

  it("parses accessToken from GET /api/auth/token", async () => {
    const token = await fetchAccessToken();
    expect(token).toBe("mock-access-from-msw");
  });
});
