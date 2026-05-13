import { describe, expect, it, vi } from "vitest";

import { createReadSignPublishScheduler } from "./create-read-sign-publish-scheduler.service";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe("createReadSignPublishScheduler", () => {
  it("연속 schedule 시 flush가 끝날 때까지 최신 publish를 반영한다", async () => {
    let targetMessageId = 99;
    const published: number[] = [];

    const scheduler = createReadSignPublishScheduler(async () => {
      published.push(targetMessageId);
      await delay(20);
    });

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

    const scheduler = createReadSignPublishScheduler(async () => {
      published.push(targetMessageId);
      await delay(10);
    });

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

    const scheduler = createReadSignPublishScheduler(async () => {
      published.push(targetMessageId);
    });

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

    const scheduler = createReadSignPublishScheduler(flush);

    scheduler.schedule();
    await Promise.resolve();
    scheduler.schedule();
    await Promise.resolve();

    expect(flush).toHaveBeenCalledTimes(2);
  });
});
