export const COMMENT_SCROLL_VISIBLE_PADDING_PX = 8;

export const VISUAL_VIEWPORT_KEYBOARD_THRESHOLD_PX = 80;

export type ScrollCommentIntoVisibleViewportParams = {
  scrollRoot: HTMLElement;
  target: HTMLElement;
  composerEl: HTMLElement;
  headerEl?: HTMLElement | null;
  padding?: number;
  /** moveToHash 등: scrollTop에 더할 추가 delta (예: -target.offsetHeight) */
  extraScrollTopDelta?: number;
};

export type ScrollCommentIntoVisibleViewportResult = {
  scrolled: boolean;
  delta: number;
};

export function getVisualViewportKeyboardHeight(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  const visualViewport = window.visualViewport;

  if (!visualViewport) {
    return 0;
  }

  return window.innerHeight - visualViewport.height;
}

export function resolvePostDetailHeader(
  scrollRoot: HTMLElement
): HTMLElement | null {
  const shell = scrollRoot.parentElement;

  if (!shell || shell.id !== "post-detail-main") {
    return null;
  }

  const firstChild = shell.firstElementChild;

  return firstChild instanceof HTMLElement ? firstChild : null;
}

/**
 * 축소된 visual viewport와 고정 composer를 기준으로 댓글 앵커를 scroll root 안에 맞춘다.
 */
export function scrollCommentIntoVisibleViewport({
  scrollRoot,
  target,
  composerEl,
  headerEl = null,
  padding = COMMENT_SCROLL_VISIBLE_PADDING_PX,
  extraScrollTopDelta = 0,
}: ScrollCommentIntoVisibleViewportParams): ScrollCommentIntoVisibleViewportResult {
  const visualViewport = window.visualViewport;
  const visibleTop = visualViewport?.offsetTop ?? 0;
  const visibleBottom =
    visibleTop + (visualViewport?.height ?? window.innerHeight);

  const headerRect = headerEl?.getBoundingClientRect();
  const composerRect = composerEl.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const safeTop =
    Math.max(visibleTop, headerRect?.bottom ?? visibleTop) + padding;
  const safeBottom = Math.min(visibleBottom, composerRect.top) - padding;

  if (safeBottom <= safeTop) {
    return { scrolled: false, delta: 0 };
  }

  let delta = 0;

  if (targetRect.top < safeTop) {
    delta = targetRect.top - safeTop;
  } else if (targetRect.bottom > safeBottom) {
    delta = targetRect.bottom - safeBottom;
  }

  delta += extraScrollTopDelta;

  if (Math.abs(delta) < 1) {
    return { scrolled: false, delta: 0 };
  }

  const behavior: ScrollBehavior = Math.abs(delta) < 400 ? "smooth" : "auto";

  scrollRoot.scrollTo({
    top: scrollRoot.scrollTop + delta,
    behavior,
  });

  return { scrolled: true, delta };
}
