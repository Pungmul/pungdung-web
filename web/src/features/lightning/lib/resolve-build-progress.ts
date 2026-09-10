import { BUILD_STEPS } from "../constants";

import type { BuildStep } from "../types";

// Summary가 마지막 입력 단계
// Complete는 생성 이후라 막대는 그대로 100
const FINAL_INPUT_STEP: BuildStep = "Summary";

export function resolveBuildProgressPercent(buildStep: BuildStep): number {
  const finalIndex = BUILD_STEPS.indexOf(FINAL_INPUT_STEP);
  const currentIndex = BUILD_STEPS.indexOf(buildStep);

  if (currentIndex >= finalIndex) {
    return 100;
  }

  return ((currentIndex + 1) / (finalIndex + 1)) * 100;
}
