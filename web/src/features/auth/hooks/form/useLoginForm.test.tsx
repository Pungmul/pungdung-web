import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { act, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useLoginForm } from "./useLoginForm";
import { server } from "@/test/msw-server";
import { useLoginStore } from "../../store";

import { authLoginHandlers } from "@/app/api/auth/login/__mock__/handlers";

const { routerReplace } = vi.hoisted(() => ({
  routerReplace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: routerReplace,
  }),
}));

describe("useLoginForm", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    server.resetHandlers();
    server.use(...authLoginHandlers);
    useLoginStore.setState({
      isLoggedIn: false,
      lastLoginTime: null,
      loginMethod: null,
    });
  });

  it("calls setLogin and router.replace on successful login", async () => {
    const { result } = renderHook(() => useLoginForm(), { wrapper });

    await act(async () => {
      result.current.onSubmit({
        loginId: "user@test.com",
        password: "Password12",
      });
    });

    await waitFor(() => {
      expect(routerReplace).toHaveBeenCalledWith("/home");
    });

    expect(useLoginStore.getState().isLoggedIn).toBe(true);
    expect(useLoginStore.getState().loginMethod).toBe("email");
  });
});
