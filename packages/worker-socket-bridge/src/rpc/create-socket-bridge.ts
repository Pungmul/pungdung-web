import type {
  CommandEnvelope,
  PostCommandType,
  ResponseEnvelope,
  RpcCommandType,
} from "../protocol";
import type { DispatchResult } from "../runtime/dispatch";

import { createPendingRpc, type PendingRpc } from "./pending-rpc";
import { settleRpcFromResponse } from "./settle-rpc-from-response";

export type SocketBridgeDispatch = (
  envelope: CommandEnvelope
) => DispatchResult | void;

export type CreateSocketBridgeOptions = {
  dispatch: SocketBridgeDispatch;
  onPush?: (response: ResponseEnvelope) => void;
  commandTimeoutMs?: number;
  createCommandId?: () => string;
};

export type SocketBridge = {
  invoke(type: RpcCommandType, data?: unknown): Promise<unknown>;
  post(type: PostCommandType, data?: unknown): void;
  handleResponse(response: ResponseEnvelope): void;
  rejectAll(reason: unknown): void;
  dispose(): void;
  readonly pending: PendingRpc;
};

const DEFAULT_COMMAND_TIMEOUT_MS = 30_000;

function rejectCancelledCommands(
  pending: PendingRpc,
  cancelled: CommandEnvelope[] | undefined
): void {
  if (!cancelled?.length) {
    return;
  }

  for (const envelope of cancelled) {
    if (!envelope.commandId) {
      continue;
    }
    pending.reject(
      envelope.commandId,
      new Error(`Command cancelled before dispatch: ${envelope.type}`)
    );
  }
}

export function createSocketBridge(
  options: CreateSocketBridgeOptions
): SocketBridge {
  const {
    dispatch,
    onPush,
    commandTimeoutMs = DEFAULT_COMMAND_TIMEOUT_MS,
    createCommandId = () => crypto.randomUUID(),
  } = options;

  const pending = createPendingRpc({ timeoutMs: commandTimeoutMs });
  let disposed = false;

  const assertActive = () => {
    if (disposed) {
      throw new Error("Socket bridge is disposed");
    }
  };

  return {
    pending,

    invoke(type, data) {
      assertActive();

      return new Promise((resolve, reject) => {
        const commandId = createCommandId();

        pending.register(
          commandId,
          { resolve, reject },
          () => {
            reject(new Error(`Command timeout: ${type} (${commandId})`));
          }
        );

        dispatch({
          type,
          data,
          commandId,
        });
      });
    },

    post(type, data) {
      assertActive();
      const result = dispatch({ type, data });
      rejectCancelledCommands(pending, result?.cancelled);
    },

    handleResponse(response) {
      if (disposed) {
        return;
      }

      settleRpcFromResponse(pending, response);
      onPush?.(response);
    },

    rejectAll(reason) {
      pending.rejectAll(reason);
    },

    dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      pending.rejectAll(new Error("Socket bridge disposed"));
    },
  };
}
