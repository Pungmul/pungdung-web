import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { server } from "@/test/msw-server";

import { AUTH_VALIDATION } from "../../constants";
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

describe("AUTH-014 | 이메일 로그인 - 입력값 검증", () => {
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
          return HttpResponse.json({
            code: "SUCCESS",
            message: "로그인 성공",
            response: "로그인이 정상적으로 완료됐습니다.",
            isSuccess: true,
          });
        }
      )
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("이메일을 비운 채 비밀번호만 입력", async () => {
    // 1. 이메일 로그인 화면 진입
    // 2. 이메일을 비운 채 비밀번호만 입력
    const user = userEvent.setup({ delay: null });
    renderLoginForm();

    await user.type(screen.getByLabelText("비밀번호"), "Password12");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      screen.getByText(AUTH_VALIDATION.EMAIL.INVALID_FORMAT)
    ).toBeVisible();
    expect(loginRequestCount).toBe(0);
  });

  it("이메일만 입력하고 비밀번호를 비움", async () => {
    // 3. 이메일만 입력하고 비밀번호를 비움
    const user = userEvent.setup({ delay: null });
    renderLoginForm();

    await user.type(screen.getByLabelText("이메일"), "user@test.com");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      screen.getByText(AUTH_VALIDATION.PASSWORD.LENGTH_8_TO_12)
    ).toBeVisible();
    expect(loginRequestCount).toBe(0);
  });

  it("올바르지 않은 이메일 형식과 비밀번호 입력", async () => {
    // 4. 올바르지 않은 이메일 형식과 비밀번호 입력
    // 5. 각 상태에서 로그인 버튼 및 인풋 상태 확인
    const user = userEvent.setup({ delay: null });
    renderLoginForm();

    await user.type(screen.getByLabelText("이메일"), "not-an-email");
    await user.type(screen.getByLabelText("비밀번호"), "Password12");
    await user.click(screen.getByRole("button", { name: "로그인" }));

    expect(
      screen.getByText(AUTH_VALIDATION.EMAIL.INVALID_FORMAT)
    ).toBeVisible();
    expect(loginRequestCount).toBe(0);
  });
});
