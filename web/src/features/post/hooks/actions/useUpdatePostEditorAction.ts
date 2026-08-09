"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { boardQueries } from "@/features/board";

import type { UpdatePostParams } from "../../api/client";
import { postMutationOptions, postQueries } from "../../queries";
import type { PostEditorSubmitUploadUi } from "../../types/post-editor-submit.types";

export type SubmitUpdatePostArgs = Pick<
  UpdatePostParams,
  "postId" | "formData"
> & {
  hasImageUpload: boolean;
};

export function useUpdatePostEditorAction({ reset }: { reset: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [submitUploadUi, setSubmitUploadUi] = useState<PostEditorSubmitUploadUi>(
    {
      phase: "idle",
    }
  );

  const { mutateAsync: updatePost, isPending: isSubmittingPostUpdate } =
    useMutation(postMutationOptions.update());

  const submitPostUpdate = useCallback(
    async ({
      postId,
      formData,
      hasImageUpload,
    }: SubmitUpdatePostArgs) => {
      setSubmitUploadUi({
        phase: hasImageUpload ? "uploading" : "idle",
      });

      try {
        const data = await updatePost({ postId, formData });

        await queryClient.invalidateQueries({
          queryKey: postQueries.lists(),
        });
        await queryClient.invalidateQueries({
          queryKey: boardQueries.all(),
        });
        await queryClient.invalidateQueries({
          queryKey: postQueries.detailKey(data.postId),
        });

        reset();
        router.back();
      } catch {
        alert("게시물 수정에 실패했습니다.");
      } finally {
        setSubmitUploadUi({ phase: "idle" });
      }
    },
    [queryClient, reset, router, updatePost]
  );

  return {
    submitPostUpdate,
    isSubmittingPostUpdate,
    submitUploadUi,
    setSubmitUploadUi,
  };
}
