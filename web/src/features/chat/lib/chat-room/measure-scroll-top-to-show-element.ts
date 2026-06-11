type MeasureScrollTopToShowElementOptions = {
  align?: "center" | "start";
};

/**
 * flex-col-reverse 타임라인 scroll container에서 target이 보이도록 할 scrollTop.
 * 현재 scrollTop + viewport 기준 위치 차이로 계산해 부호 문제를 피한다.
 */
export function measureScrollTopToShowElement(
  scrollContainer: HTMLElement,
  targetElement: HTMLElement,
  options?: MeasureScrollTopToShowElementOptions
): number {
  const containerRect = scrollContainer.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();
  const offsetFromViewportTop = targetRect.top - containerRect.top;

  let nextScrollTop = scrollContainer.scrollTop + offsetFromViewportTop;

  if (options?.align === "center") {
    nextScrollTop -= (scrollContainer.clientHeight - targetRect.height) / 2;
  }

  return nextScrollTop;
}
