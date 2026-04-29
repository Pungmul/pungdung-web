import { describe, expect, it } from "vitest";

import {
  buildCommandError,
  buildConnected,
  buildConnectionState,
  buildMessage,
  buildPong,
  buildPublished,
  buildPublishState,
  buildRetrying,
  buildSubscribed,
  buildSubscriptionState,
} from "./stomp-response-emitters";

describe("stomp-response-emitters", () => {
  it("should build CONNECTION_STATE with optional error", () => {
    expect(buildConnectionState("connected", true)).toEqual({
      type: "CONNECTION_STATE",
      data: {
        phase: "connected",
        isConnected: true,
      },
    });

    expect(buildConnectionState("failed", false, "boom")).toEqual({
      type: "CONNECTION_STATE",
      data: {
        phase: "failed",
        isConnected: false,
        error: "boom",
      },
    });
  });

  it("should build SUBSCRIPTION_STATE with optional commandId and error", () => {
    expect(buildSubscriptionState("/topic/a", "pending", "cmd-sub")).toEqual({
      type: "SUBSCRIPTION_STATE",
      commandId: "cmd-sub",
      data: {
        topic: "/topic/a",
        status: "pending",
      },
    });

    expect(
      buildSubscriptionState("/topic/a", "error", null, "subscribe-failed")
    ).toEqual({
      type: "SUBSCRIPTION_STATE",
      data: {
        topic: "/topic/a",
        status: "error",
        error: "subscribe-failed",
      },
    });
  });

  it("should build SUBSCRIBED with optional commandId", () => {
    expect(buildSubscribed("/topic/a", "cmd-sub")).toEqual({
      type: "SUBSCRIBED",
      commandId: "cmd-sub",
      data: { topic: "/topic/a" },
    });

    expect(buildSubscribed("/topic/a", null)).toEqual({
      type: "SUBSCRIBED",
      data: { topic: "/topic/a" },
    });
  });

  it("should build PUBLISHED and publish state", () => {
    expect(buildPublished("/topic/a", "cmd-pub")).toEqual({
      type: "PUBLISHED",
      commandId: "cmd-pub",
      data: {
        topic: "/topic/a",
        status: "published",
      },
    });

    expect(buildPublishState("/topic/a", "error", null, "publish-failed")).toEqual(
      {
        type: "PUBLISHED",
        data: {
          topic: "/topic/a",
          status: "error",
          error: "publish-failed",
        },
      }
    );
  });

  it("should build RETRYING with optional topic and commandId", () => {
    expect(buildRetrying("SUBSCRIBE", "/topic/a", "cmd-retry", "not-ready")).toEqual(
      {
        type: "RETRYING",
        commandId: "cmd-retry",
        data: {
          commandType: "SUBSCRIBE",
          topic: "/topic/a",
          reason: "not-ready",
        },
      }
    );

    expect(buildRetrying("CONNECT", null, null, "network-down")).toEqual({
      type: "RETRYING",
      data: {
        commandType: "CONNECT",
        reason: "network-down",
      },
    });
  });

  it("should build ERROR using formatted error text", () => {
    expect(buildCommandError("cmd-err", new Error("fatal-error"))).toEqual({
      type: "ERROR",
      commandId: "cmd-err",
      error: "fatal-error",
    });

    expect(buildCommandError(null, "raw-error")).toEqual({
      type: "ERROR",
      error: "raw-error",
    });
  });

  it("should build MESSAGE, CONNECTED, and PONG envelopes", () => {
    expect(buildMessage("/topic/a", { id: 1 })).toEqual({
      type: "MESSAGE",
      data: {
        topic: "/topic/a",
        message: { id: 1 },
      },
    });

    expect(buildConnected("cmd-connect")).toEqual({
      type: "CONNECTED",
      commandId: "cmd-connect",
    });

    expect(
      buildPong(
        {
          isStompConnected: true,
          phase: "connected",
          isWebSocketOpen: true,
          webSocketReadyState: 1,
          lastServerActivityAt: 1,
          serverActivityStaleThresholdMs: 20_000,
          isServerActivityStale: false,
        },
        "cmd-ping"
      )
    ).toEqual({
      type: "PONG",
      commandId: "cmd-ping",
      data: {
        isStompConnected: true,
        phase: "connected",
        isWebSocketOpen: true,
        webSocketReadyState: 1,
        lastServerActivityAt: 1,
        serverActivityStaleThresholdMs: 20_000,
        isServerActivityStale: false,
      },
    });

    expect(
      buildPong(
        {
          isStompConnected: false,
          phase: "failed",
          isWebSocketOpen: false,
          webSocketReadyState: 3,
          lastServerActivityAt: null,
          serverActivityStaleThresholdMs: 20_000,
          isServerActivityStale: false,
        },
        null
      )
    ).toEqual({
      type: "PONG",
      data: {
        isStompConnected: false,
        phase: "failed",
        isWebSocketOpen: false,
        webSocketReadyState: 3,
        lastServerActivityAt: null,
        serverActivityStaleThresholdMs: 20_000,
        isServerActivityStale: false,
      },
    });
  });
});
