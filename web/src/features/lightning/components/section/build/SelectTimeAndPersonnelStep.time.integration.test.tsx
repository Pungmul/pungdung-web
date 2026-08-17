import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { wrapLightningBuildStep } from "./lightning-build-test-harness";
import { SelectTimeAndPersonnelStep } from "./SelectTimeAndPersonnelStep";

describe("LGT-015 / LGT-055 | 번개 생성 모집 시간 - 입력값 검증", () => {
  afterEach(() => {
    cleanup();
  });

  it("모집 종료 시간을 비운 상태", async () => {
    // 1. 모집 시간 단계 진입
    // 2. 모집 종료 시간을 비운 상태 확인
    // 3. [다음] 선택
    const user = userEvent.setup({ delay: null });
    render(wrapLightningBuildStep(<SelectTimeAndPersonnelStep />));

    await user.click(screen.getByRole("button", { name: "다음" }));

    expect(
      await screen.findByText("모집 종료 시간을 선택해주세요")
    ).toBeVisible();
    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
  });
});
