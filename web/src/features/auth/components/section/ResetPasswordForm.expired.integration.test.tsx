import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_DOMAIN_MESSAGE, AUTH_UI_MESSAGE } from "../../constants";
import { useResetPasswordForm } from "../../hooks/form";
import { ResetPasswordForm } from "./ResetPasswordForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

function ResetPasswordFormHarness() {
  const form = useResetPasswordForm("");
  return <ResetPasswordForm {...form} />;
}

describe("AUTH-023 | 비밀번호 재설정 - 만료 링크", () => {
  afterEach(() => {
    cleanup();
  });

  it("토큰이 없는 재설정 링크로 진입", async () => {
    // 1. 재설정 화면 진입
    // 제품 invalidToken은 빈 토큰만 본다. 만료 4xx 전용 화면은 없음
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <ResetPasswordFormHarness />
      </QueryClientProvider>
    );

    expect(
      screen.getByText(AUTH_DOMAIN_MESSAGE.RESET_PASSWORD.TOKEN_INVALID)
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: AUTH_UI_MESSAGE.GO_TO_LOGIN_PAGE })
    ).toBeVisible();
    expect(screen.queryByLabelText("새 비밀번호")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "비밀번호 재설정" })
    ).not.toBeInTheDocument();
  });
});
