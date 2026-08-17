import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { server } from "@/test/msw-server";

import { AUTH_DOMAIN_MESSAGE } from "../../constants";
import { useChangePasswordAction } from "../../hooks/actions";
import { useChangePasswordForm } from "../../hooks/form";
import { ChangePasswordForm } from "./ChangePasswordForm";

function ChangePasswordFormHarness() {
  const form = useChangePasswordForm({ requiresCurrentPassword: true });
  const action = useChangePasswordAction();
  return (
    <ChangePasswordForm
      {...form}
      {...action}
      requiresCurrentPassword
    />
  );
}

function renderChangePasswordForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ChangePasswordFormHarness />
    </QueryClientProvider>
  );
}

describe("AUTH-011 | 비밀번호 변경 - 현재 비밀번호 오류", () => {
  let changePasswordCount = 0;

  beforeEach(() => {
    changePasswordCount = 0;
    server.use(
      http.post(
        ({ request }) =>
          new URL(request.url).pathname === "/api/auth/change-password",
        () => {
          changePasswordCount += 1;
          return HttpResponse.json(
            {
              code: "PASSWORD_MISMATCH",
              message: "현재 비밀번호가 일치하지 않습니다.",
              response: null,
              isSuccess: false,
            },
            { status: 400 }
          );
        }
      )
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("틀린 현재 비밀번호로 변경을 제출", async () => {
    // 1. 비밀번호 변경 화면 진입
    // 2. 현재 비밀번호를 틀리게 입력하고 새 비밀번호를 채움
    // 3. [비밀번호 변경] 클릭
    const user = userEvent.setup({ delay: null });
    renderChangePasswordForm();

    await user.type(screen.getByLabelText("현재 비밀번호"), "Password12");
    await user.type(screen.getByLabelText("신규 비밀번호"), "Password13");
    await user.type(screen.getByLabelText("비밀번호 확인"), "Password13");
    await user.tab();

    await user.click(screen.getByRole("button", { name: "비밀번호 변경" }));

    expect(
      await screen.findByText(
        `${AUTH_DOMAIN_MESSAGE.CHANGE_PASSWORD.FAILURE_PREFIX}현재 비밀번호가 일치하지 않습니다.`
      )
    ).toBeVisible();
    expect(changePasswordCount).toBe(1);
  });
});
