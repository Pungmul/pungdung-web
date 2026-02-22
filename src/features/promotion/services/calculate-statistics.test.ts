import { describe, expect, it } from "vitest";

import { calculateStatistics } from "./calculate-statistics";
import type {
  PromotionApplicationDetail,
  PromotionPublishedQuestion,
} from "../types";

describe("calculateStatistics", () => {
  const textQ: PromotionPublishedQuestion = {
    id: 1,
    questionType: "TEXT",
    label: "이름",
    required: true,
    orderNo: 1,
    settingsJson: "{}",
    options: [],
  };

  const choiceQ: PromotionPublishedQuestion = {
    id: 2,
    questionType: "CHOICE",
    label: "색",
    required: false,
    orderNo: 2,
    settingsJson: "{}",
    options: [
      { id: 10, label: "빨강", orderNo: 1 },
      { id: 11, label: "파랑", orderNo: 2 },
    ],
  };

  it("aggregates TEXT answers excluding blanks", () => {
    const responses: PromotionApplicationDetail[] = [
      {
        responseId: 1,
        formId: 1,
        submitterUsername: "a@x.com",
        submitterNickname: "a",
        submittedAt: "2025-01-01T00:00:00Z",
        answerList: [
          {
            questionId: 1,
            answerText: "  hello ",
            selectedOptions: [],
          },
          {
            questionId: 1,
            answerText: "   ",
            selectedOptions: [],
          },
        ],
      },
    ];
    const stats = calculateStatistics(responses, [textQ]);
    expect(stats).toHaveLength(1);
    expect(stats[0]?.questionType).toBe("TEXT");
    expect(stats[0]?.textAnswers).toEqual(["  hello "]);
    expect(stats[0]?.totalResponses).toBe(2);
  });

  it("counts CHOICE option selections and percentage", () => {
    const responses: PromotionApplicationDetail[] = [
      {
        responseId: 1,
        formId: 1,
        submitterUsername: "a@x.com",
        submitterNickname: "a",
        submittedAt: "2025-01-01T00:00:00Z",
        answerList: [
          {
            questionId: 2,
            answerText: null,
            selectedOptions: [{ id: 10, label: "빨강", orderNo: 1 }],
          },
        ],
      },
      {
        responseId: 2,
        formId: 1,
        submitterUsername: "b@x.com",
        submitterNickname: "b",
        submittedAt: "2025-01-02T00:00:00Z",
        answerList: [
          {
            questionId: 2,
            answerText: null,
            selectedOptions: [{ id: 10, label: "빨강", orderNo: 1 }],
          },
        ],
      },
    ];
    const stats = calculateStatistics(responses, [choiceQ]);
    const row = stats[0];
    expect(row?.questionType).toBe("CHOICE");
    expect(row?.totalResponses).toBe(2);
    const red = row?.optionStatistics.find((o) => o.optionId === 10);
    const blue = row?.optionStatistics.find((o) => o.optionId === 11);
    expect(red?.count).toBe(2);
    expect(red?.percentage).toBe(100);
    expect(blue?.count).toBe(0);
    expect(blue?.percentage).toBe(0);
  });
});
