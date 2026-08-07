import { vi } from "vitest";

export const lastScope = {
  tags: {} as Record<string, string>,
  extras: {} as Record<string, unknown>,
};

export const captureException = vi.fn();

export function withScope(
  callback: (scope: {
    setTag: (key: string, value: string) => void;
    setExtra: (key: string, value: unknown) => void;
    setFingerprint: (value: string[]) => void;
  }) => void
) {
  lastScope.tags = {};
  lastScope.extras = {};
  callback({
    setTag: (key, value) => {
      lastScope.tags[key] = value;
    },
    setExtra: (key, value) => {
      lastScope.extras[key] = value;
    },
    setFingerprint: vi.fn(),
  });
}

export function resetSentryMock() {
  captureException.mockClear();
  lastScope.tags = {};
  lastScope.extras = {};
}
