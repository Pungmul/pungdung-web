"use client";

import { useCallback, useRef } from "react";

import { useFormContext } from "react-hook-form";

import type { Editor as EditorType } from "@toast-ui/react-editor";

import { usePromotionPublishFlow } from "./usePromotionPublishFlow";
import { useSavePromotionFormDraft } from "./useSavePromotionFormDraft";
import {
  buildPromotionSavePayload,
  validatePromotionPublish,
} from "../../services";
import { usePromotionQuestionDraftStore } from "../../store";
import type {
  PromotionFormDraft,
  PromotionPostingFormValues,
} from "../../types";

export function usePromotionPostingFormActions(
  formId: string | null,
  formDetail: PromotionFormDraft,
  descriptionEditorRef: React.RefObject<EditorType | null>
) {
  const { getValues } = useFormContext<PromotionPostingFormValues>();

  const {
    handleSaveDraft: requestSaveDraft,
    isPending: isSaveDraftPending,
  } = useSavePromotionFormDraft();

  // 편집 중인 값이 기반한 버전
  // 재조회된 캐시 버전을 쓰면 다른 기기 저장을 덮어쓸 수 있음
  const baseVersionRef = useRef(formDetail.version);

  const getDescriptionMarkdown = useCallback(() => {
    const editor = descriptionEditorRef.current?.getInstance();
    return editor != null
      ? editor.getMarkdown()
      : (getValues().descriptionSeed ?? "");
  }, [descriptionEditorRef, getValues]);

  const buildPayload = useCallback(
    () =>
      buildPromotionSavePayload({
        values: getValues(),
        expectedVersion: baseVersionRef.current,
        descriptionMarkdown: getDescriptionMarkdown(),
      }),
    [getDescriptionMarkdown, getValues]
  );

  const validate = useCallback(
    () =>
      validatePromotionPublish({
        values: getValues(),
        descriptionMarkdown: getDescriptionMarkdown(),
        hasQuestionDraft:
          usePromotionQuestionDraftStore.getState().questionDraft !== null,
      }),
    [getDescriptionMarkdown, getValues]
  );

  const commitSavedVersion = useCallback((version: number) => {
    baseVersionRef.current = version;
  }, []);

  const handleSaveDraft = useCallback(() => {
    if (!formId) return;
    void requestSaveDraft({
      formId,
      form: buildPayload(),
      onSuccess: (ack) => commitSavedVersion(ack.version),
    });
  }, [buildPayload, commitSavedVersion, formId, requestSaveDraft]);

  const { handlePublish, isPublishing } = usePromotionPublishFlow({
    formId,
    validate,
    buildPayload,
    onSaved: commitSavedVersion,
  });

  return {
    handleSaveDraft,
    handlePublish,
    isPending: isSaveDraftPending || isPublishing,
  };
}
