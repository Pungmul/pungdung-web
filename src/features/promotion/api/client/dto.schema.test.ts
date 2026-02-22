import { describe, expect, it } from "vitest";

import { promotionPerformanceListResponseSchema } from "./dto.schema";

describe("promotionPerformanceListResponseSchema", () => {
  it("accepts valid performanceList payload", () => {
    const parsed = promotionPerformanceListResponseSchema.safeParse({
      performanceList: [
        {
          id: 1,
          ownerId: 2,
          title: "t",
          description: "d",
          publicKey: "pk",
          status: "OPEN",
          formType: "PERFORMANCE",
          performanceImageInfoList: [{ id: 1, imageUrl: "https://x" }],
          startAt: "2025-01-01",
          limitNum: 10,
          address: null,
          createdAt: "2025-01-01",
          updatedAt: "2025-01-01",
        },
      ],
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects when performanceList is missing", () => {
    const parsed = promotionPerformanceListResponseSchema.safeParse({});
    expect(parsed.success).toBe(false);
  });
});
