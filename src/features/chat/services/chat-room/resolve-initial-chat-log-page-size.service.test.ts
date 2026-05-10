import { describe, expect, it } from "vitest";

import { CHAT_LOG_PAGE_SIZE } from "../../constants";

import {
  MAX_INITIAL_CHAT_LOG_PAGE_SIZE,
  resolveInitialChatLogPageSize,
} from "./resolve-initial-chat-log-page-size.service";

describe("resolveInitialChatLogPageSize", () => {
  it("unread가 없으면 기본 페이지 크기를 반환한다", () => {
    expect(resolveInitialChatLogPageSize(null)).toBe(CHAT_LOG_PAGE_SIZE);
    expect(resolveInitialChatLogPageSize(0)).toBe(CHAT_LOG_PAGE_SIZE);
  });

  it("unread가 기본 페이지보다 크면 unread를 size로 쓴다", () => {
    expect(resolveInitialChatLogPageSize(25)).toBe(25);
  });

  it("unread가 기본 페이지보다 작아도 최소 기본 페이지 크기를 유지한다", () => {
    expect(resolveInitialChatLogPageSize(3)).toBe(CHAT_LOG_PAGE_SIZE);
  });

  it("상한을 넘지 않는다", () => {
    expect(resolveInitialChatLogPageSize(500)).toBe(
      MAX_INITIAL_CHAT_LOG_PAGE_SIZE
    );
  });
});
