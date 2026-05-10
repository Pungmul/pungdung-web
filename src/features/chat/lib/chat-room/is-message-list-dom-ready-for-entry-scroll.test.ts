import { describe, expect, it } from "vitest";

import {
  CHAT_MESSAGE_ITEM_DATA_ATTR,
  NEW_MESSAGES_DIVIDER_DATA_ATTR,
} from "../../constants/ui.constants";

import { isMessageListDomReadyForEntryScroll } from "./is-message-list-dom-ready-for-entry-scroll";

describe("isMessageListDomReadyForEntryScroll", () => {
  it("메시지 row가 없으면 false", () => {
    const container = document.createElement("div");

    expect(
      isMessageListDomReadyForEntryScroll(container, {
        hasNewMessagesDivider: false,
      })
    ).toBe(false);
  });

  it("구분선이 필요할 때 divider marker가 없으면 false", () => {
    const container = document.createElement("div");
    const item = document.createElement("li");
    item.setAttribute(CHAT_MESSAGE_ITEM_DATA_ATTR, "");
    container.append(item);

    expect(
      isMessageListDomReadyForEntryScroll(container, {
        hasNewMessagesDivider: true,
      })
    ).toBe(false);
  });

  it("메시지 row와 divider가 있으면 true", () => {
    const container = document.createElement("div");
    const divider = document.createElement("li");
    const item = document.createElement("li");
    divider.setAttribute(NEW_MESSAGES_DIVIDER_DATA_ATTR, "");
    item.setAttribute(CHAT_MESSAGE_ITEM_DATA_ATTR, "");
    container.append(divider, item);

    expect(
      isMessageListDomReadyForEntryScroll(container, {
        hasNewMessagesDivider: true,
      })
    ).toBe(true);
  });
});
