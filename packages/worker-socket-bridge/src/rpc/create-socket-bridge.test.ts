import { describe, expect, it, vi } from "vitest";

import type { CommandEnvelope } from "../protocol";
import type { DispatchResult } from "../runtime/dispatch";
import { createSocketBridge } from "./create-socket-bridge";
import { createPendingRpc } from "./pending-rpc";
import { settleRpcFromResponse } from "./settle-rpc-from-response";

describe("createPendingRpc", () => {
  it("register 후 resolve하면 pending에서 제거된다", () => {
    const pending = createPendingRpc({ timeoutMs: 1_000 });
    const resolve = vi.fn();
    const reject = vi.fn();

    pending.register("cmd-1", { resolve, reject }, () => undefined);

    expect(pending.has("cmd-1")).toBe(true);
    pending.resolve("cmd-1", { ok: true });

    expect(resolve).toHaveBeenCalledWith({ ok: true });
    expect(pending.has("cmd-1")).toBe(false);
  });

  it("rejectAll은 모든 pending을 reject한다", () => {
    const pending = createPendingRpc({ timeoutMs: 1_000 });
    const rejectA = vi.fn();
    const rejectB = vi.fn();

    pending.register("a", { resolve: vi.fn(), reject: rejectA }, () => undefined);
    pending.register("b", { resolve: vi.fn(), reject: rejectB }, () => undefined);

    pending.rejectAll(new Error("disconnected"));

    expect(rejectA).toHaveBeenCalled();
    expect(rejectB).toHaveBeenCalled();
    expect(pending.size()).toBe(0);
  });
});

describe("settleRpcFromResponse", () => {
  it("PONG 응답으로 invoke Promise를 resolve한다", () => {
    const pending = createPendingRpc({ timeoutMs: 1_000 });
    const resolve = vi.fn();

    pending.register("cmd-ping", { resolve, reject: vi.fn() }, () => undefined);

    const settlement = settleRpcFromResponse(pending, {
      type: "PONG",
      commandId: "cmd-ping",
    });

    expect(settlement.kind).toBe("resolved");
    expect(resolve).toHaveBeenCalledWith(undefined);
  });

  it("SUBSCRIBED 응답으로 invoke Promise를 resolve한다", () => {
    const pending = createPendingRpc({ timeoutMs: 1_000 });
    const resolve = vi.fn();

    pending.register("cmd-sub", { resolve, reject: vi.fn() }, () => undefined);

    const settlement = settleRpcFromResponse(pending, {
      type: "SUBSCRIBED",
      commandId: "cmd-sub",
      data: { topic: "/topic/a" },
    });

    expect(settlement.kind).toBe("resolved");
    expect(resolve).toHaveBeenCalledWith({ topic: "/topic/a" });
  });

  it("SUBSCRIPTION_STATE error는 reject한다", () => {
    const pending = createPendingRpc({ timeoutMs: 1_000 });
    const reject = vi.fn();

    pending.register("cmd-sub", { resolve: vi.fn(), reject }, () => undefined);

    settleRpcFromResponse(pending, {
      type: "SUBSCRIPTION_STATE",
      commandId: "cmd-sub",
      data: { topic: "/topic/a", status: "error", error: "failed" },
    });

    expect(reject).toHaveBeenCalled();
  });

  it("MESSAGE는 RPC settle하지 않는다", () => {
    const pending = createPendingRpc({ timeoutMs: 1_000 });

    pending.register("cmd-msg", { resolve: vi.fn(), reject: vi.fn() }, () => undefined);

    const settlement = settleRpcFromResponse(pending, {
      type: "MESSAGE",
      commandId: "cmd-msg",
      data: { topic: "/topic/a", message: { id: 1 } },
    });

    expect(settlement.kind).toBe("none");
    expect(pending.has("cmd-msg")).toBe(true);
  });
});

describe("createSocketBridge", () => {
  it("invoke PING은 commandId를 포함해 dispatch하고 PONG으로 settle한다", async () => {
    const dispatch = vi.fn();
    let commandId = "";

    const bridge = createSocketBridge({
      dispatch,
      createCommandId: () => {
        commandId = "ping-command-id";
        return commandId;
      },
    });

    const invokePromise = bridge.invoke("PING");

    expect(dispatch).toHaveBeenCalledWith({
      type: "PING",
      commandId: "ping-command-id",
    });

    bridge.handleResponse({
      type: "PONG",
      commandId,
    });

    await expect(invokePromise).resolves.toBeUndefined();
  });

  it("invoke는 commandId를 포함해 dispatch하고 응답으로 settle한다", async () => {
    const dispatch = vi.fn();
    let commandId = "";

    const bridge = createSocketBridge({
      dispatch,
      createCommandId: () => {
        commandId = "fixed-command-id";
        return commandId;
      },
    });

    const invokePromise = bridge.invoke("SUBSCRIBE", { topic: "/topic/a" });

    expect(dispatch).toHaveBeenCalledWith({
      type: "SUBSCRIBE",
      data: { topic: "/topic/a" },
      commandId: "fixed-command-id",
    });

    bridge.handleResponse({
      type: "SUBSCRIBED",
      commandId,
      data: { topic: "/topic/a" },
    });

    await expect(invokePromise).resolves.toEqual({ topic: "/topic/a" });
  });

  it("post는 commandId 없이 dispatch한다", () => {
    const dispatch = vi.fn();
    const bridge = createSocketBridge({ dispatch });

    bridge.post("UNSUBSCRIBE", { topic: "/topic/a" });

    expect(dispatch).toHaveBeenCalledWith({
      type: "UNSUBSCRIBE",
      data: { topic: "/topic/a" },
    });
  });

  it("post UNSUBSCRIBE는 dispatch cancelled를 pending RPC reject로 settle한다", async () => {
    const dispatch = vi.fn(
      (envelope: CommandEnvelope): DispatchResult | void => {
        if (envelope.type === "UNSUBSCRIBE") {
          return {
            cancelled: [
              {
                type: "SUBSCRIBE",
                data: { topic: "/topic/a" },
                commandId: "sub-1",
              },
            ],
          };
        }
      }
    );

    const bridge = createSocketBridge({
      dispatch,
      createCommandId: () => "sub-1",
    });

    const invokePromise = bridge.invoke("SUBSCRIBE", { topic: "/topic/a" });
    bridge.post("UNSUBSCRIBE", { topic: "/topic/a" });

    await expect(invokePromise).rejects.toThrow(
      "Command cancelled before dispatch: SUBSCRIBE"
    );
    expect(bridge.pending.has("sub-1")).toBe(false);
  });

  it("handleResponse는 settle 후 onPush를 호출한다", () => {
    const onPush = vi.fn();
    const bridge = createSocketBridge({ dispatch: vi.fn(), onPush });

    const response = {
      type: "MESSAGE" as const,
      data: { topic: "/topic/a", message: { id: 1 } },
    };

    bridge.handleResponse(response);

    expect(onPush).toHaveBeenCalledWith(response);
  });
});
