import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  CHAT_MESSAGE_ITEM_DATA_ATTR,
  ENTRY_SCROLL_SETTLE_TIMEOUT_MS,
} from "../../../constants/ui.constants";

import { useEntryUnreadScrollOnMount } from "./useEntryUnreadScrollOnMount";

describe("useEntryUnreadScrollOnMount", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    class MockResizeObserver {
      observe() {}
      disconnect() {}
    }

    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("미읽음이 없으면 스냅샷 확정 시 바로 settle한다", () => {
    const onEntryScrollSettled = vi.fn();
    const messageContainer = document.createElement("div");
    const messageContainerRef = { current: messageContainer };

    renderHook(() =>
      useEntryUnreadScrollOnMount({
        roomId: "room-a",
        messageContainerRef,
        hadUnreadOnEntry: false,
        hasNewMessagesDivider: false,
        isEntrySnapshotCaptured: true,
        canAttemptEntryUnreadScroll: true,
        scrollAboveLatestByMessageCount: vi.fn(() => true),
        scrollToNewMessagesDivider: vi.fn(() => true),
        onEntryScrollSettled,
      })
    );

    expect(onEntryScrollSettled).toHaveBeenCalledTimes(1);
  });

  it("DOM이 준비되면 divider 스크롤 후 settle한다", async () => {
    const onEntryScrollSettled = vi.fn();
    const scrollToNewMessagesDivider = vi.fn(() => true);
    const messageContainer = document.createElement("div");
    const item = document.createElement("li");
    item.setAttribute(CHAT_MESSAGE_ITEM_DATA_ATTR, "");
    messageContainer.append(item);
    const messageContainerRef = { current: messageContainer };

    renderHook(() =>
      useEntryUnreadScrollOnMount({
        roomId: "room-a",
        messageContainerRef,
        hadUnreadOnEntry: true,
        hasNewMessagesDivider: false,
        isEntrySnapshotCaptured: true,
        canAttemptEntryUnreadScroll: true,
        scrollAboveLatestByMessageCount: scrollToNewMessagesDivider,
        scrollToNewMessagesDivider: vi.fn(() => true),
        onEntryScrollSettled,
      })
    );

    await vi.runAllTimersAsync();

    expect(scrollToNewMessagesDivider).toHaveBeenCalled();
    expect(onEntryScrollSettled).toHaveBeenCalledTimes(1);
  });

  it("스크롤에 실패하면 timeout 후 settle한다", async () => {
    const onEntryScrollSettled = vi.fn();
    const messageContainer = document.createElement("div");
    const messageContainerRef = { current: messageContainer };

    renderHook(() =>
      useEntryUnreadScrollOnMount({
        roomId: "room-a",
        messageContainerRef,
        hadUnreadOnEntry: true,
        hasNewMessagesDivider: false,
        isEntrySnapshotCaptured: true,
        canAttemptEntryUnreadScroll: true,
        scrollAboveLatestByMessageCount: vi.fn(() => false),
        scrollToNewMessagesDivider: vi.fn(() => false),
        onEntryScrollSettled,
      })
    );

    vi.advanceTimersByTime(ENTRY_SCROLL_SETTLE_TIMEOUT_MS);
    await Promise.resolve();

    expect(onEntryScrollSettled).toHaveBeenCalledTimes(1);
  });
});
