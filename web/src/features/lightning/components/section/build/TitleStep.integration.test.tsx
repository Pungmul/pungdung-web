import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  LIGHTNING_BUILD_READY_VALUES,
  wrapLightningBuildStep,
} from "./lightning-build-test-harness";
import { TitleStep } from "./TitleStep";

describe("LGT-067 | 번개 생성 제목 - 입력값 검증", () => {
  afterEach(() => {
    cleanup();
  });

  it("제목을 비운 상태", async () => {
    // 1. 제목 입력 단계 진입
    // 2. 제목을 비운 상태 확인
    // 제품은 빈 제목을 기본 제목으로 정규화함
    const user = userEvent.setup({ delay: null });
    const onBuildStepChange = vi.fn();
    render(
      wrapLightningBuildStep(<TitleStep />, {
        defaults: LIGHTNING_BUILD_READY_VALUES,
        onBuildStepChange,
      })
    );

    expect(screen.getByPlaceholderText("어흥님의 모임")).toHaveValue("");
    await user.click(screen.getByRole("button", { name: "번개 생성" }));
    expect(onBuildStepChange).toHaveBeenCalledWith("Complete");
  });

  it("공백만 입력", async () => {
    // 3. 공백만 입력
    const user = userEvent.setup({ delay: null });
    const onBuildStepChange = vi.fn();
    render(
      wrapLightningBuildStep(<TitleStep />, {
        defaults: LIGHTNING_BUILD_READY_VALUES,
        onBuildStepChange,
      })
    );

    await user.type(screen.getByPlaceholderText("어흥님의 모임"), "   ");
    await user.click(screen.getByRole("button", { name: "번개 생성" }));
    expect(onBuildStepChange).toHaveBeenCalledWith("Complete");
  });
});
