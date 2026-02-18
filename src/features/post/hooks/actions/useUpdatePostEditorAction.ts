"use client";

import { useCallback, useRef, useState } from "react";
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
  const uploadStartedAtRef = useRef(0);
  const lastEtaSecondsRef = useRef<number | null>(null);

  const { mutateAsync: updatePost, isPending: isSubmittingPostUpdate } =
    useMutation(postMutationOptions.update());

  const submitPostUpdate = useCallback(
    async ({
      postId,
      formData,
      hasImageUpload,
    }: SubmitUpdatePostArgs) => {
      uploadStartedAtRef.current = Date.now();
      lastEtaSecondsRef.current = null;

      if (hasImageUpload) {
        setSubmitUploadUi({
          phase: "uploading",
          indeterminate: true,
        });
      } else {
        setSubmitUploadUi({ phase: "idle" });
      }

      try {
        const payload: UpdatePostParams = hasImageUpload
          ? {
              postId,
              formData,
              onUploadProgress: (e) => {
                if (!e.lengthComputable || e.total <= 0) {
                  setSubmitUploadUi({
                    phase: "uploading",
                    indeterminate: true,
                    remainingSeconds: null,
                  });
                  return;
                }

                const percent = Math.min(
                  99,
                  Math.floor((100 * e.loaded) / e.total)
                );

                const elapsed = Math.max(
                  1,
                  Date.now() - uploadStartedAtRef.current
                );
                let remainingSeconds: number | null = null;

                if (e.loaded > 0 && e.loaded < e.total) {
                  const rate = e.loaded / elapsed;
                  const remainingMs = (e.total - e.loaded) / rate;
                  const sec = Math.max(1, Math.round(remainingMs / 1000));
                  if (
                    lastEtaSecondsRef.current === null ||
                    Math.abs(lastEtaSecondsRef.current - sec) > 1
                  ) {
                    lastEtaSecondsRef.current = sec;
                  }
                  remainingSeconds = lastEtaSecondsRef.current;
                }

                setSubmitUploadUi({
                  phase: "uploading",
                  indeterminate: false,
                  percent,
                  remainingSeconds,
                });
              },
              onUploadFinished: () => setSubmitUploadUi({ phase: "saving" }),
            }
          : { postId, formData };

        const data = await updatePost(payload);

        await queryClient.invalidateQueries({
          queryKey: postQueries.lists(),
        });
        await queryClient.invalidateQueries({
          queryKey: boardQueries.all(),
        });
        await queryClient.invalidateQueries({
          queryKey: postQueries.detailKey(data.postId),
        });

        setSubmitUploadUi({ phase: "idle" });
        reset();
        router.back();
      } catch {
        setSubmitUploadUi({ phase: "idle" });
        alert("게시물 수정에 실패했습니다.");
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
