import { describe, expect, it, vi } from "vitest";

import { READ_SIGN_PUBLISH_NO_DEBOUNCE_MS } from "../../constants/read-sign.constants";
import { createReadSignPublishScheduler } from "./create-read-sign-publish-scheduler.service";

const TEST_STABILIZE_MS = 100;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("createReadSignPublishScheduler", () => {
  it("연속 schedule 시 flush가 끝날 때까지 최신 publish를 반영한다", async () => {
    let targetMessageId = 99;
    const published: number[] = [];

    const scheduler = createReadSignPublishScheduler(
      async () => {
        published.push(targetMessageId);
        await delay(20);
      },
      READ_SIGN_PUBLISH_NO_DEBOUNCE_MS
    );

    scheduler.schedule();

    await delay(5);
    targetMessageId = 100;
    scheduler.schedule();

    await delay(50);

    expect(published).toEqual([99, 100]);
  });

  it("publish 도중 target이 올라가면 flush를 한 번 더 실행한다", async () => {
    let targetMessageId = 99;
    const published: number[] = [];

    const scheduler = createReadSignPublishScheduler(
      async () => {
        published.push(targetMessageId);
        await delay(10);
      },
      READ_SIGN_PUBLISH_NO_DEBOUNCE_MS
    );

    scheduler.schedule();
    await delay(2);
    targetMessageId = 101;
    scheduler.schedule();

    await delay(30);

    expect(published).toEqual([99, 101]);
  });

  it("schedule 전에 target이 이미 올라갔으면 최신 id로 1회만 publish한다", async () => {
    let targetMessageId = 99;
    const published: number[] = [];

    const scheduler = createReadSignPublishScheduler(
      async () => {
        published.push(targetMessageId);
      },
      READ_SIGN_PUBLISH_NO_DEBOUNCE_MS
    );

    targetMessageId = 101;
    scheduler.schedule();

    await Promise.resolve();

    expect(published).toEqual([101]);
  });

  it("flush 실패 후에도 다음 schedule을 처리한다", async () => {
    const flush = vi
      .fn<() => Promise<void>>()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValue(undefined);

    const scheduler = createReadSignPublishScheduler(
      flush,
      READ_SIGN_PUBLISH_NO_DEBOUNCE_MS
    );

    scheduler.schedule();
    await Promise.resolve();
    scheduler.schedule();
    await Promise.resolve();

    expect(flush).toHaveBeenCalledTimes(2);
  });

  it("stabilizeMs 동안 연속 schedule 시 flush는 1회만 실행된다", async () => {
    vi.useFakeTimers();
    const flush = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const scheduler = createReadSignPublishScheduler(
      flush,
      TEST_STABILIZE_MS
    );

    scheduler.schedule();
    scheduler.schedule();
    scheduler.schedule();

    expect(flush).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(TEST_STABILIZE_MS);

    expect(flush).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("flushNow는 stabilize 대기 없이 즉시 flush한다", async () => {
    vi.useFakeTimers();
    const flush = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const scheduler = createReadSignPublishScheduler(
      flush,
      TEST_STABILIZE_MS
    );

    scheduler.schedule();
    scheduler.flushNow();

    await Promise.resolve();

    expect(flush).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("cancel은 대기 중인 schedule을 취소한다", async () => {
    vi.useFakeTimers();
    const flush = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
    const scheduler = createReadSignPublishScheduler(
      flush,
      TEST_STABILIZE_MS
    );

    scheduler.schedule();
    scheduler.cancel();

    await vi.advanceTimersByTimeAsync(TEST_STABILIZE_MS);

    expect(flush).not.toHaveBeenCalled();

    vi.useRealTimers();
  });
});
