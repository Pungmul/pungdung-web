import { describe, expect, it } from "vitest";

import {
  CHAT_MESSAGE_ITEM_DATA_ATTR,
  MESSAGE_LIST_GAP_PX,
} from "../constants/ui.constants";

import { measureScrollOffsetAboveLatestMessages } from "./measure-scroll-offset-above-latest-messages";

describe("measureScrollOffsetAboveLatestMessages", () => {
  it("최신 메시지 N개 높이와 gap을 합산한다", () => {
    const container = document.createElement("div");
    const first = document.createElement("li");
    const second = document.createElement("li");
    const third = document.createElement("li");

    first.setAttribute(CHAT_MESSAGE_ITEM_DATA_ATTR, "");
    second.setAttribute(CHAT_MESSAGE_ITEM_DATA_ATTR, "");
    third.setAttribute(CHAT_MESSAGE_ITEM_DATA_ATTR, "");

    Object.defineProperty(first, "offsetHeight", { value: 40 });
    Object.defineProperty(second, "offsetHeight", { value: 50 });
    Object.defineProperty(third, "offsetHeight", { value: 60 });

    container.append(first, second, third);

    expect(measureScrollOffsetAboveLatestMessages(container, 2)).toBe(
      50 + 60 + MESSAGE_LIST_GAP_PX
    );
  });

  it("메시지가 없으면 0을 반환한다", () => {
    const container = document.createElement("div");

    expect(measureScrollOffsetAboveLatestMessages(container, 2)).toBe(0);
  });
});
