import { describe, expect, it } from "vitest";

import {
  closePromotionFormResponseSchema,
  deletePromotionFormResponseSchema,
  promotionDetailSchema,
  promotionPerformanceListResponseSchema,
} from "./dto.schema";

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

describe("promotionDetailSchema", () => {
  it("joinedFriendList를 포함한 공연 상세 응답을 검증한다", () => {
    const parsed = promotionDetailSchema.safeParse({
      performanceId: 9,
      title: "점검용",
      description: "공연 소개",
      limitNum: null,
      startAt: "2026-09-23T20:50:00",
      closeAt: "2026-09-22T00:00:00",
      status: "OPEN",
      publicKey: "performance-key",
      performanceImageInfoList: [],
      address: null,
      questions: [],
      joinedFriendList: [
        {
          userId: 3,
          username: "friend@example.com",
          name: "강윤호",
          clubName: "풍덩대",
          profileImage: {
            id: 2,
            originalFilename: "profile.png",
            convertedFileName: "user/3/profile.png",
            fullFilePath: "https://example.com/profile.png",
            fileType: "image/png",
            fileSize: 10,
            createdAt: "2026-05-10T19:11:22",
          },
        },
      ],
    });

    expect(parsed.success).toBe(true);
  });
});

describe("closePromotionFormResponseSchema", () => {
  it("payload 내용과 관계없이 undefined로 버린다", () => {
    for (const payload of [null, "ok", { message: "ok" }]) {
      const parsed = closePromotionFormResponseSchema.safeParse(payload);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data).toBeUndefined();
      }
    }
  });
});

describe("deletePromotionFormResponseSchema", () => {
  it("null payload를 undefined로 변환한다", () => {
    const parsed = deletePromotionFormResponseSchema.safeParse(null);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toBeUndefined();
    }
  });
});
