"use client";

import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

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
  const { getValues } = useFormContext<PromotionPostingFormValues>();

  const {
    handleSaveDraft: requestSaveDraft,
    isPending: isSaveDraftPending,
  } = useSavePromotionFormDraft();

  const { mutateAsync: publishMutateAsync, isPending: isPublishPending } =
    usePublishPromotionForm();

  // 편집 중인 값이 기반한 버전
  // 재조회된 캐시 버전을 쓰면 다른 기기 저장을 덮어쓸 수 있음
  const baseVersionRef = useRef(formDetail.version);

  const buildPayload = useCallback(() => {
    const editor = descriptionEditorRef.current?.getInstance();
    const markdown =
      editor != null ? editor.getMarkdown() : (getValues().descriptionSeed ?? "");
    return buildPromotionSavePayload({
      values: getValues(),
      expectedVersion: baseVersionRef.current,
      descriptionMarkdown: markdown,
    });
  }, [descriptionEditorRef, getValues]);

  const handleSaveDraft = useCallback(() => {
    if (!formId) return;
    void requestSaveDraft({
      formId,
      form: buildPayload(),
      onSuccess: (ack) => {
        baseVersionRef.current = ack.version;
      },
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
