import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";

import { server } from "@/test/msw-server";

import { CommentComposer } from "./index";

describe("BOARD-017 | 댓글 작성 - 빈 댓글 차단", () => {
  afterEach(() => {
    cleanup();
  });

  it("댓글 입력란 비워둠", async () => {
    // 2. 댓글 입력란 비워둠 또는 공백만 입력
    // 3. [등록] 버튼 클릭
    let commentRequestCount = 0;
    server.use(
      http.post(
        ({ request }) => new URL(request.url).pathname.includes("/comment"),
        () => {
          commentRequestCount += 1;
          return HttpResponse.json({
            code: "SUCCESS",
            message: "ok",
            response: null,
            isSuccess: true,
          });
        }
      )
    );

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CommentComposer
          postId={1}
          replyTarget={null}
          setReplyTarget={() => undefined}
          commentAnchorElementsRef={{ current: {} }}
          composerTextareaRef={createRef<HTMLTextAreaElement>()}
        />
      </QueryClientProvider>
    );

    const form = container.querySelector("form");
    expect(form).not.toBeNull();
    fireEvent.submit(form!);

    expect(commentRequestCount).toBe(0);
    expect(screen.getByPlaceholderText("댓글을 입력하세요...")).toHaveValue("");
  });
});
