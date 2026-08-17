import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { wrapLightningBuildStep } from "./lightning-build-test-harness";
import { SelectTimeAndPersonnelStep } from "./SelectTimeAndPersonnelStep";

describe("LGT-018 / LGT-058 | 번개 생성 인원 - 최소/최대 인원 검증", () => {
  afterEach(() => {
    cleanup();
  });

  it("최소 인원을 허용 하한보다 낮게 조작", async () => {
    // 1. 인원 설정 단계 진입
    // 2. 최소 인원을 허용 하한보다 낮게 조작
    const user = userEvent.setup({ delay: null });
    render(wrapLightningBuildStep(<SelectTimeAndPersonnelStep />));

    const decrementMin = screen.getByRole("button", {
      name: "최소 인원 줄이기",
    });
    expect(decrementMin).toBeDisabled();
    await user.click(decrementMin);
    expect(screen.getByRole("spinbutton", { name: "최소 인원" })).toHaveValue(
      4
    );
  });

  it("최소 인원을 최대 인원보다 크게 설정 시도", async () => {
    // 4. 최소 인원을 최대 인원보다 크게 설정 시도
    // 6. +/- 버튼을 연속 입력하며 경계 확인
    // 제품은 교차 상태를 버튼 disable로 막음
    const user = userEvent.setup({ delay: null });
    render(wrapLightningBuildStep(<SelectTimeAndPersonnelStep />));

    const incrementMin = screen.getByRole("button", {
      name: "최소 인원 늘리기",
    });
    await user.click(incrementMin);
    expect(incrementMin).toBeDisabled();
    expect(screen.getByRole("spinbutton", { name: "최소 인원" })).toHaveValue(
      5
    );
    expect(screen.getByRole("spinbutton", { name: "최대 인원" })).toHaveValue(
      6
    );
  });
});
