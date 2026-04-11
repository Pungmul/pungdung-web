export const getElementTranslateY = (element: HTMLElement | null): number => {
  if (!element) return 0;

  const transform = window.getComputedStyle(element).transform;
  if (transform === "none") return 0;

  return new DOMMatrix(transform).m42;
};
