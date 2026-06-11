function getScrollableParent(el: HTMLElement | null): HTMLElement | null {
    while (el) {
      const style = getComputedStyle(el);
      const overflowY = style.overflowY;
      if (overflowY === "auto" || overflowY === "scroll") return el;
      el = el.parentElement;
    }
    return null;
  }

export default getScrollableParent;