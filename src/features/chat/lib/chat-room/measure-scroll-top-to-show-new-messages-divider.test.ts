import { describe, expect, it } from "vitest";

import { NEW_MESSAGES_DIVIDER_DATA_ATTR } from "../../constants/ui.constants";

import { measureScrollTopToShowNewMessagesDivider } from "./measure-scroll-top-to-show-new-messages-divider";

describe("measureScrollTopToShowNewMessagesDivider", () => {
  it("구분선이 없으면 null", () => {
    const scrollContainer = document.createElement("div");
    const messageContainer = document.createElement("div");

    expect(
      measureScrollTopToShowNewMessagesDivider(scrollContainer, messageContainer)
    ).toBeNull();
  });

  it("구분선이 있으면 scrollTop을 계산한다", () => {
    const scrollContainer = document.createElement("div");
    const messageContainer = document.createElement("div");
    const divider = document.createElement("li");
    divider.setAttribute(NEW_MESSAGES_DIVIDER_DATA_ATTR, "");
    messageContainer.append(divider);

    scrollContainer.getBoundingClientRect = () =>
      ({ top: 100, height: 500 }) as DOMRect;
    divider.getBoundingClientRect = () =>
      ({ top: 250, height: 32 }) as DOMRect;
    Object.defineProperty(scrollContainer, "scrollTop", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(scrollContainer, "clientHeight", { value: 500 });

    expect(
      measureScrollTopToShowNewMessagesDivider(scrollContainer, messageContainer)
    ).toBe(-84);
  });
});
