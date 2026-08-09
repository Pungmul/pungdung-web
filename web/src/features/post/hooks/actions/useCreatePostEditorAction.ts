"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { boardQueries } from "@/features/board";

import type { CreatePostParams } from "../../api/client";
import { postMutationOptions, postQueries } from "../../queries";
import type { PostEditorSubmitUploadUi } from "../../types/post-editor-submit.types";

export type SubmitCreatePostArgs = Pick<
  CreatePostParams,
  "boardId" | "formData"
> & {
  hasImageUpload: boolean;
};

export function useCreatePostEditorAction({ reset }: { reset: () => void }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [submitUploadUi, setSubmitUploadUi] = useState<PostEditorSubmitUploadUi>(
    {
      phase: "idle",
    }
  );

  const { mutateAsync: createPost, isPending: isSubmittingPost } = useMutation(
    postMutationOptions.create()
  );

  const submitPost = useCallback(
    async ({
      boardId,
      formData,
      hasImageUpload,
    }: SubmitCreatePostArgs) => {
      setSubmitUploadUi({
        phase: hasImageUpload ? "uploading" : "idle",
      });

      try {
        const data = await createPost({ boardId, formData });

        await queryClient.resetQueries({
          queryKey: postQueries.lists(),
          type: "all",
        });
        await queryClient.resetQueries({
          queryKey: boardQueries.all(),
          type: "all",
        });
        await queryClient.invalidateQueries({
          queryKey: postQueries.detailKey(data.postId),
        });

        reset();
        router.replace(`/board/d/${data.postId}`);
      } catch {
        alert("게시물 작성에 실패했습니다.");
      } finally {
        setSubmitUploadUi({ phase: "idle" });
      }
    },
    [createPost, queryClient, reset, router]
  );

  return { submitPost, isSubmittingPost, submitUploadUi, setSubmitUploadUi };
}
