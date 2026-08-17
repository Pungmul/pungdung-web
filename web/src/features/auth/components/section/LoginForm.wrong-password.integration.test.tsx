import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "@/test/msw-server";

import { AUTH_DOMAIN_MESSAGE } from "../../constants";
import { useLoginForm } from "../../hooks/form";
import { useLoginStore } from "../../store";
import { LoginForm } from "./LoginForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

function LoginFormHarness() {
  const loginForm = useLoginForm();
  return <LoginForm {...loginForm} />;
}

function renderLoginForm() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <LoginFormHarness />
    </QueryClientProvider>
  );
}

describe("AUTH-002 | 이메일 로그인 - 잘못된 비밀번호", () => {
  let loginRequestCount = 0;

  beforeEach(() => {
    loginRequestCount = 0;
    useLoginStore.setState({
      isLoggedIn: false,
      lastLoginTime: null,
      loginMethod: null,
    });
    server.use(
      http.post(
        ({ request }) => new URL(request.url).pathname === "/api/auth/login",
        () => {
          loginRequestCount += 1;
          return HttpResponse.json(
            {
              code: "LOGIN_FAILED",
              message: "비밀번호가 일치하지 않습니다.",
              response: null,
              isSuccess: false,
            },
            { status: 401 }
          );
        }
      )
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("올바른 형식의 이메일과 틀린 비밀번호로 로그인", async () => {
    // 1. 이메일 로그인 화면 진입
    // 2. 올바른 형식의 이메일과 틀린 비밀번호 입력
    // 3. [로그인] 클릭
    // 세션/라우팅은 보지 않는다
    const user = userEvent.setup({ delay: null });
    renderLoginForm();

    await user.type(screen.getByLabelText("이메일"), "user@test.com");
    await user.type(screen.getByLabelText("비밀번호"), "Password12");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      await screen.findByText("비밀번호가 일치하지 않습니다.")
    ).toBeVisible();
    expect(
      screen.queryByText(AUTH_DOMAIN_MESSAGE.LOGIN.GENERIC_FAILURE)
    ).not.toBeInTheDocument();
    expect(loginRequestCount).toBe(1);
    expect(useLoginStore.getState().isLoggedIn).toBe(false);
  });
});
