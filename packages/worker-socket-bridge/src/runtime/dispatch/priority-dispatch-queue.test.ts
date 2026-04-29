import { describe, expect, it, vi } from "vitest";

import { createPriorityDispatchQueue } from "./priority-dispatch-queue";

describe("createPriorityDispatchQueue", () => {
  it("UNSUBSCRIBE는 queue에 pending SUBSCRIBE를 cancel하고 sink로 보내지 않는다", () => {
    const sink = vi.fn();
    const queue = createPriorityDispatchQueue(sink);

    queue.setReady(false);
    queue.enqueue({
      type: "SUBSCRIBE",
      data: { topic: "/topic/a" },
      commandId: "sub-1",
    });

    const result = queue.enqueue({
      type: "UNSUBSCRIBE",
      data: { topic: "/topic/a" },
    });

    expect(result.cancelled).toEqual([
      {
        type: "SUBSCRIBE",
        data: { topic: "/topic/a" },
        commandId: "sub-1",
      },
    ]);
    expect(queue.size()).toBe(0);
    expect(sink).not.toHaveBeenCalled();
  });

  it("queue에 pending SEND_MESSAGE도 같은 topic UNSUBSCRIBE로 cancel한다", () => {
    const sink = vi.fn();
    const queue = createPriorityDispatchQueue(sink);

    queue.setReady(false);
    queue.enqueue({
      type: "SEND_MESSAGE",
      data: { topic: "/topic/a", message: { id: 1 } },
      commandId: "send-1",
    });

    const result = queue.enqueue({
      type: "UNSUBSCRIBE",
      data: { topic: "/topic/a" },
    });

    expect(result.cancelled).toHaveLength(1);
    expect(result.cancelled[0]?.type).toBe("SEND_MESSAGE");
    expect(sink).not.toHaveBeenCalled();
  });

  it("pending SUBSCRIBE가 없으면 UNSUBSCRIBE는 sink로 보낸다", () => {
    const sink = vi.fn();
    const queue = createPriorityDispatchQueue(sink);

    queue.enqueue({
      type: "UNSUBSCRIBE",
      data: { topic: "/topic/a" },
    });

    expect(sink).toHaveBeenCalledWith({
      type: "UNSUBSCRIBE",
      data: { topic: "/topic/a" },
    });
  });

  it("ready=false일 때 cancel되지 않은 UNSUBSCRIBE는 queue에 쌓인다", () => {
    const sink = vi.fn();
    const queue = createPriorityDispatchQueue(sink);

    queue.setReady(false);
    queue.enqueue({
      type: "UNSUBSCRIBE",
      data: { topic: "/topic/a" },
    });

    expect(queue.size()).toBe(1);
    expect(sink).not.toHaveBeenCalled();
  });
});
