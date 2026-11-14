import { afterEach, describe, expect, it, vi } from "vitest";

const { SocketManagerMock, isE2ERuntimeMock } = vi.hoisted(() => ({
  SocketManagerMock: vi.fn(),
  isE2ERuntimeMock: vi.fn(() => false),
}));

vi.mock("@pungdung/worker-socket-bridge", () => ({ SocketManager: SocketManagerMock }));
vi.mock("./e2eRuntime", () => ({ isE2ERuntime: isE2ERuntimeMock }));

import { makeSocketManager } from "./socketManager";

describe("makeSocketManager", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    isE2ERuntimeMock.mockReturnValue(false);
  });

  it("uses a dedicated worker in standalone mode", () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) });
    vi.stubGlobal("Worker", class {});
    makeSocketManager();
    expect(SocketManagerMock).toHaveBeenCalledWith(expect.objectContaining({ fallbackChain: ["dedicated", "main-thread"] }));
  });

  it("falls back to the main thread when workers are unavailable", () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) });
    vi.stubGlobal("Worker", undefined);
    makeSocketManager();
    expect(SocketManagerMock).toHaveBeenCalledWith(expect.objectContaining({ fallbackChain: ["main-thread"] }));
  });

  it("keeps the default runtime selection in browser mode", () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: false }) });
    makeSocketManager();
    expect(SocketManagerMock.mock.calls[0]?.[0]).not.toHaveProperty("fallbackChain");
  });

  it("keeps the main thread override for E2E", () => {
    vi.stubGlobal("window", { matchMedia: () => ({ matches: true }) });
    isE2ERuntimeMock.mockReturnValue(true);
    makeSocketManager();
    expect(SocketManagerMock).toHaveBeenCalledWith(expect.objectContaining({ fallbackChain: ["main-thread"] }));
  });
});
