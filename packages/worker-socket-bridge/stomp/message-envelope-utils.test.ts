import { describe, expect, it } from "vitest";

import type { ResponseEnvelope } from "../src/protocol";
import {
  formatWorkerError,
  safeParseMessageBody,
  withOptionalCommandId,
} from "./message-envelope-utils";

describe("message-envelope-utils", () => {
  describe("withOptionalCommandId", () => {
    it("should return same message when commandId is null", () => {
      const message: ResponseEnvelope = {
        type: "PONG",
        data: {
          phase: "idle",
          isStompConnected: false,
          isWebSocketOpen: false,
          webSocketReadyState: null,
          lastServerActivityAt: null,
          serverActivityStaleThresholdMs: null,
          isServerActivityStale: false,
        },
      };

      expect(withOptionalCommandId(message, null)).toBe(message);
    });

    it("should append commandId when provided", () => {
      const message: ResponseEnvelope = {
        type: "CONNECTED",
      };

      expect(withOptionalCommandId(message, "cmd-1")).toEqual({
        type: "CONNECTED",
        commandId: "cmd-1",
      });
    });
  });

  describe("safeParseMessageBody", () => {
    it("should parse valid JSON", () => {
      expect(safeParseMessageBody('{"a":1,"b":"x"}')).toEqual({
        a: 1,
        b: "x",
      });
    });

    it("should return raw body when JSON parse fails", () => {
      expect(safeParseMessageBody("{not-json}")).toBe("{not-json}");
    });
  });

  describe("formatWorkerError", () => {
    it("should return message for Error instance", () => {
      expect(formatWorkerError(new Error("worker-failed"))).toBe("worker-failed");
    });

    it("should stringify non-Error values", () => {
      expect(formatWorkerError(404)).toBe("404");
      expect(formatWorkerError({ code: "E_FAIL" })).toBe("[object Object]");
    });
  });
});
