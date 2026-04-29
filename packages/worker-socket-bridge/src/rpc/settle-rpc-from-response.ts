import type {
  ConnectionStatePayload,
  PublishedPayload,
  ResponseEnvelope,
  SubscriptionStatePayload,
} from "../protocol";

import type { PendingRpc } from "./pending-rpc";

export type RpcSettlement =
  | { kind: "resolved"; commandId: string; value?: unknown }
  | { kind: "rejected"; commandId: string; reason: unknown }
  | { kind: "none" };

function toError(error: unknown, fallback: string): Error {
  if (error instanceof Error) {
    return error;
  }
  if (error !== undefined && error !== null) {
    return new Error(String(error));
  }
  return new Error(fallback);
}

/**
 * Response envelope 기준으로 pending RPC settle 여부만 판단한다.
 * push 이벤트 처리는 bridge의 onPush에 위임한다.
 */
export function settleRpcFromResponse(
  pending: PendingRpc,
  response: ResponseEnvelope
): RpcSettlement {
  const { type, data, error, commandId } = response;

  if (!commandId) {
    return { kind: "none" };
  }

  switch (type) {
    case "CONNECTED":
      pending.resolve(commandId, undefined);
      return { kind: "resolved", commandId };

    case "PONG":
      pending.resolve(commandId, data);
      return { kind: "resolved", commandId, value: data };

    case "CONNECTION_STATE": {
      const payload = data as ConnectionStatePayload | undefined;
      if (!payload?.isConnected) {
        return { kind: "none" };
      }
      pending.resolve(commandId, data);
      return { kind: "resolved", commandId, value: data };
    }

    case "SUBSCRIBED":
      pending.resolve(commandId, data);
      return { kind: "resolved", commandId, value: data };

    case "SUBSCRIPTION_STATE": {
      const payload = data as SubscriptionStatePayload | undefined;
      if (!payload) {
        return { kind: "none" };
      }
      if (payload.status === "subscribed") {
        pending.resolve(commandId, data);
        return { kind: "resolved", commandId, value: data };
      }
      if (payload.status === "error") {
        const reason = toError(error, payload.error ?? "Subscription failed");
        pending.reject(commandId, reason);
        return { kind: "rejected", commandId, reason };
      }
      return { kind: "none" };
    }

    case "PUBLISHED": {
      const payload = data as PublishedPayload | undefined;
      if (!payload) {
        return { kind: "none" };
      }
      if (payload.status === "published") {
        pending.resolve(commandId, data);
        return { kind: "resolved", commandId, value: data };
      }
      const reason = toError(error, payload.error ?? "Publish failed");
      pending.reject(commandId, reason);
      return { kind: "rejected", commandId, reason };
    }

    case "ERROR": {
      const reason = toError(error, "Unknown error");
      pending.reject(commandId, reason);
      return { kind: "rejected", commandId, reason };
    }

    case "MESSAGE":
    case "RETRYING":
    default:
      return { kind: "none" };
  }
}
