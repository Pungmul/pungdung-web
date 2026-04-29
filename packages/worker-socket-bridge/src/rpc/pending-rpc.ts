export type PendingRpcEntry = {
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
  timeoutId: ReturnType<typeof setTimeout>;
};

export type PendingRpc = {
  register(
    commandId: string,
    handlers: Pick<PendingRpcEntry, "resolve" | "reject">,
    onTimeout: () => void
  ): void;
  resolve(commandId: string, value?: unknown): boolean;
  reject(commandId: string, reason: unknown): boolean;
  rejectAll(reason: unknown): void;
  has(commandId: string): boolean;
  size(): number;
};

export type CreatePendingRpcOptions = {
  timeoutMs: number;
};

export function createPendingRpc(options: CreatePendingRpcOptions): PendingRpc {
  const pending = new Map<string, PendingRpcEntry>();

  const deleteEntry = (commandId: string): PendingRpcEntry | undefined => {
    const entry = pending.get(commandId);
    if (!entry) {
      return undefined;
    }
    clearTimeout(entry.timeoutId);
    pending.delete(commandId);
    return entry;
  };

  return {
    register(commandId, handlers, onTimeout) {
      const timeoutId = setTimeout(() => {
        deleteEntry(commandId);
        onTimeout();
      }, options.timeoutMs);

      pending.set(commandId, {
        resolve: handlers.resolve,
        reject: handlers.reject,
        timeoutId,
      });
    },

    resolve(commandId, value) {
      const entry = deleteEntry(commandId);
      if (!entry) {
        return false;
      }
      entry.resolve(value);
      return true;
    },

    reject(commandId, reason) {
      const entry = deleteEntry(commandId);
      if (!entry) {
        return false;
      }
      entry.reject(reason);
      return true;
    },

    rejectAll(reason) {
      pending.forEach((entry) => {
        clearTimeout(entry.timeoutId);
        entry.reject(reason);
      });
      pending.clear();
    },

    has(commandId) {
      return pending.has(commandId);
    },

    size() {
      return pending.size;
    },
  };
}
