/**
 * 회원가입 단계 인디케이터(번호 원) 배경용 Tailwind 클래스.
 * `stepOrder` 기준으로 `currentStep`보다 앞이면 완료, 같으면 현재, 뒤면 미완료.
 */
export function getSignUpStepCircleBgClass<T extends string>(
  stepOrder: readonly T[],
  stepIndex: number,
  currentStep: T
): string {
  const currentIndex = stepOrder.indexOf(currentStep);
  const idx = currentIndex === -1 ? 0 : currentIndex;
  if (stepIndex < idx) return "bg-red-300";
  if (stepIndex === idx) return "bg-red-500";
  return "bg-grey-300";
}
