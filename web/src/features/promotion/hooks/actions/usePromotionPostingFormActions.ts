"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

import type { Editor as EditorType } from "@toast-ui/react-editor";

import { Toast } from "@/shared";

import { usePublishPromotionForm } from "./usePublishPromotionForm";
import { useSavePromotionFormDraft } from "./useSavePromotionFormDraft";
import { buildPromotionSavePayload } from "../../services";
import type {
  PromotionFormDraft,
  PromotionPostingFormValues,
} from "../../types";

export function usePromotionPostingFormActions(
  formId: string | null,
  formDetail: PromotionFormDraft,
  descriptionEditorRef: React.RefObject<EditorType | null>
) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { getValues } = useFormContext<PromotionPostingFormValues>();

  const {
    handleSaveDraft: requestSaveDraft,
    isPending: isSaveDraftPending,
  } = useSavePromotionFormDraft();

  const { mutateAsync: publishMutateAsync, isPending: isPublishPending } =
    usePublishPromotionForm();

  const getExpectedVersion = useCallback(() => {
    if (!formId) return formDetail.version;
    const cached = queryClient.getQueryData<PromotionFormDraft>([
      "promotion",
      "formDraft",
      formId,
    ]);
    return cached?.version ?? formDetail.version;
  }, [formDetail.version, formId, queryClient]);

  const buildPayload = useCallback(() => {
    const editor = descriptionEditorRef.current?.getInstance();
    const markdown =
      editor != null ? editor.getMarkdown() : (getValues().descriptionSeed ?? "");
    return buildPromotionSavePayload({
      values: getValues(),
      expectedVersion: getExpectedVersion(),
      descriptionMarkdown: markdown,
    });
  }, [descriptionEditorRef, getExpectedVersion, getValues]);

  const handleSaveDraft = useCallback(() => {
    if (!formId) return;
    void requestSaveDraft({
      formId,
      form: buildPayload(),
    });
  }, [buildPayload, formId, requestSaveDraft]);

  const handlePublish = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formId) {
        console.error("Form ID is missing.");
        return;
      }

      try {
        const data = await publishMutateAsync({
          formId: Number(formId),
          form: buildPayload(),
        });
        Toast.show({
          message: "공연이 게시되었습니다!",
          type: "success",
          duration: 3000,
        });
        router.replace(`/board/promote/d/${data.publicKey}`);
      } catch {
        Toast.show({
          message: "게시에 실패했습니다.",
          type: "error",
          duration: 3000,
        });
      }
    },
    [buildPayload, formId, publishMutateAsync, router]
  );

  return {
    handleSaveDraft,
    handlePublish,
    isPending: isSaveDraftPending || isPublishPending,
  };
}
