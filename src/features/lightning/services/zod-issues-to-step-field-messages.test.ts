import { describe, expect, it } from "vitest";
import { ZodError, ZodIssueCode, z } from "zod";

import { zodIssuesToStepFieldMessages } from "./zod-issues-to-step-field-messages";

describe("zodIssuesToStepFieldMessages", () => {
  it("스텝 필드 키에 해당하는 필드만 첫 에러 메시지를 담는다", () => {
    const schema = z.object({
      name: z.string().min(1, "이름 필요"),
      age: z.number().positive(),
    });
    const parsed = schema.safeParse({ name: "", age: -1 });
    expect(parsed.success).toBe(false);
    if (parsed.success) throw new Error("expected failure");

    const ageMessage = parsed.error.issues.find(
      (issue) => issue.path[0] === "age"
    )?.message;
    expect(ageMessage).toBeDefined();

    expect(zodIssuesToStepFieldMessages(parsed.error, ["name", "age"])).toEqual(
      {
        name: "이름 필요",
        age: ageMessage,
      }
    );
  });

  it("stepFieldKeys에 없는 필드는 결과에서 빠진다", () => {
    const schema = z.object({
      kept: z.string().min(1),
      dropped: z.string().min(1),
    });
    const parsed = schema.safeParse({ kept: "", dropped: "" });
    expect(parsed.success).toBe(false);
    if (parsed.success) throw new Error("expected failure");

    expect(zodIssuesToStepFieldMessages(parsed.error, ["kept"])).toEqual({
      kept: expect.any(String),
    });
    expect(
      zodIssuesToStepFieldMessages(parsed.error, ["kept"]).dropped
    ).toBeUndefined();
  });

  it("같은 필드에 여러 issue가 있으면 첫 메시지만 유지한다", () => {
    const error = new ZodError([
      {
        code: ZodIssueCode.custom,
        message: "먼저",
        path: ["field"],
      },
      {
        code: ZodIssueCode.custom,
        message: "나중",
        path: ["field"],
      },
    ]);

    expect(zodIssuesToStepFieldMessages(error, ["field"])).toEqual({
      field: "먼저",
    });
  });

  it("path[0]이 문자열이 아니면 해당 issue는 무시한다", () => {
    const schema = z.array(z.string());
    const parsed = schema.safeParse([1]);
    expect(parsed.success).toBe(false);
    if (parsed.success) throw new Error("expected failure");

    expect(zodIssuesToStepFieldMessages(parsed.error, ["0"])).toEqual({});
  });
});
