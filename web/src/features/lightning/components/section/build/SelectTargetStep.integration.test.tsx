import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { wrapLightningBuildStep } from "./lightning-build-test-harness";
import { SelectTargetStep } from "./SelectTargetStep";

describe("LGT-063 | 번개 생성 대상 - 공개 범위 선택", () => {
  afterEach(() => {
    cleanup();
  });

  it("[전체] 선택 후 [우리 학교]로 변경", async () => {
    // 1. 대상 선택 단계 진입
    // 2. 공개 범위 미선택 상태 확인
    // 제품 기본값은 전체라 미선택 단계는 없음
    // 3. [전체] 선택 후 상태 확인
    // 4. [우리 학교만]으로 변경
    const user = userEvent.setup({ delay: null });
    const onBuildStepChange = vi.fn();
    render(
      wrapLightningBuildStep(<SelectTargetStep />, { onBuildStepChange })
    );

    const allScope = screen.getByRole("button", { name: "전체" });
    const schoolScope = screen.getByRole("button", { name: "우리 학교만" });
    expect(allScope).toHaveClass("bg-grey-700");
    expect(schoolScope).not.toHaveClass("bg-grey-700");

    await user.click(schoolScope);
    expect(schoolScope).toHaveClass("bg-grey-700");
    expect(allScope).not.toHaveClass("bg-grey-700");

    await user.click(screen.getByRole("button", { name: "다음" }));
    expect(onBuildStepChange).toHaveBeenCalledWith("Summary");
  });
});
