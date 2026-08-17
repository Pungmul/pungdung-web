import { FormProvider, useForm } from "react-hook-form";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { ToastHost } from "@/shared/components";
import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";
import { toastStore } from "@/shared/store";

import {
  POST_EDITOR_MAX_IMAGE_COUNT,
  POST_EDITOR_MAX_SINGLE_IMAGE_BYTES,
} from "../../constants/post-image-upload-limits";
import {
  emptyPostEditorFormValues,
  type PostEditorFormValues,
} from "../../types/schemas";
import { PostFooter } from "./PostFooter";

function PostFooterHarness({
  imageFiles = [],
}: {
  imageFiles?: PostEditorFormValues["imageFiles"];
}) {
  const form = useForm<PostEditorFormValues>({
    defaultValues: {
      ...emptyPostEditorFormValues,
      imageFiles,
    },
  });

  return (
    <ViewStoreProvider initialView="mobile">
      <FormProvider {...form}>
        <ToastHost />
        <PostFooter />
      </FormProvider>
    </ViewStoreProvider>
  );
}

function makeImageFile(name: string, size: number) {
  return new File([new Uint8Array(size)], name, { type: "image/png" });
}

describe("BOARD-107 | 게시글 작성 - 이미지 용량/장수", () => {
  beforeEach(() => {
    toastStore.getState().hide();
  });

  afterEach(() => {
    toastStore.getState().hide();
    cleanup();
  });

  it("10MB를 넘는 사진을 첨부", async () => {
    // 1. 게시글 작성 화면 사진 첨부
    // 2. 용량 초과 blob mock 파일 선택
    const user = userEvent.setup({ delay: null });
    render(<PostFooterHarness />);

    await user.upload(
      screen.getByLabelText("사진 첨부"),
      makeImageFile("big.png", POST_EDITOR_MAX_SINGLE_IMAGE_BYTES + 1)
    );

    expect(
      await screen.findByText("각 사진은 10MB 이하만 첨부할 수 있어요.")
    ).toBeVisible();
  });

  it("최대 장수를 넘는 사진을 첨부", async () => {
    // 3. 이미 10장이 있는 상태에서 한 장 더 선택
    const user = userEvent.setup({ delay: null });
    const existing = Array.from({ length: POST_EDITOR_MAX_IMAGE_COUNT }, (_, i) => ({
      id: -1 as const,
      blob: makeImageFile(`keep-${i}.png`, 8),
    }));
    render(<PostFooterHarness imageFiles={existing} />);

    await user.upload(
      screen.getByLabelText("사진 첨부"),
      makeImageFile("extra.png", 8)
    );

    expect(
      await screen.findByText(
        `사진은 최대 ${POST_EDITOR_MAX_IMAGE_COUNT}장까지 첨부할 수 있어요.`
      )
    ).toBeVisible();
  });
});
