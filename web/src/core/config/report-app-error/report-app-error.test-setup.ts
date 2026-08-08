import { vi } from "vitest";

export const lastScope = {
  level: undefined as string | undefined,
  tags: {} as Record<string, string>,
  extras: {} as Record<string, unknown>,
};

export const captureException = vi.fn();

export function withScope(
  callback: (scope: {
    setLevel: (value: string) => void;
    setTag: (key: string, value: string) => void;
    setExtra: (key: string, value: unknown) => void;
    setFingerprint: (value: string[]) => void;
  }) => void
) {
  lastScope.level = undefined;
  lastScope.tags = {};
  lastScope.extras = {};
  callback({
    setLevel: (value) => {
      lastScope.level = value;
    },
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
  lastScope.level = undefined;
  lastScope.tags = {};
  lastScope.extras = {};
}
