import { describe, expect, it } from "vitest";

import { validateUpstreamJsonResponse } from "./upstream-envelope";

describe("validateUpstreamJsonResponse", () => {
  it("외부 서버 응답이 JSON이 아니면 502를 반환한다", async () => {
    const response = new Response("not-json", { status: 200 });
    const parsed = await validateUpstreamJsonResponse(response);

    expect(parsed.ok).toBe(false);
    if (parsed.ok) {
      return;
    }

    expect(parsed.error.status).toBe(502);
    expect(parsed.error.body.code).toBe("UPSTREAM_INVALID_JSON");
  });

  it("외부 서버 JSON이 공통 응답 형식과 다르면 502를 반환한다", async () => {
    const response = new Response(JSON.stringify({ message: "nope" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
    const parsed = await validateUpstreamJsonResponse(response);

    expect(parsed.ok).toBe(false);
    if (parsed.ok) {
      return;
    }

    expect(parsed.error.status).toBe(502);
    expect(parsed.error.body.code).toBe("UPSTREAM_INVALID_RESPONSE");
  });
});
