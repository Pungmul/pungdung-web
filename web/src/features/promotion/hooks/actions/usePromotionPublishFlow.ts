"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Toast } from "@/shared";

import { usePublishPromotionForm } from "./usePublishPromotionForm";
import { useSavePromotionFormDraft } from "./useSavePromotionFormDraft";
import { formatPromotionActionError } from "../../lib/promotion-action-error-message";
import type { PromotionPublishValidation } from "../../services";
import type { PromotionFormSaveAck, PromotionFormSavePayload } from "../../types";

// 검증 후 저장, 저장 후 게시
// 게시가 실패해도 저장 결과 버전은 onSaved로 편집 세션에 반영
export function usePromotionPublishFlow({
  formId,
  validate,
  buildPayload,
  onSaved,
}: {
  formId: string | null;
  validate: () => PromotionPublishValidation;
  buildPayload: () => PromotionFormSavePayload;
  onSaved: (version: number) => void;
}) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const { mutateAsync: saveAsync } = useSavePromotionFormDraft();
  const { mutateAsync: publishAsync } = usePublishPromotionForm();

  const showErrorToast = useCallback((title: string, error: unknown) => {
    Toast.show({
      message: formatPromotionActionError(title, error),
      type: "error",
    });
  }, []);

  const handlePublish = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formId) return;
      const id = Number(formId);
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error(`프로모션 formId가 올바르지 않음: ${formId}`);
      }

      const validation = validate();
      if (!validation.ok) {
        Toast.show({ message: validation.message, type: "error" });
        return;
      }

      setIsPublishing(true);
      let ack: PromotionFormSaveAck;
      try {
        ack = await saveAsync({ formId: id, form: buildPayload() });
      } catch (error) {
        setIsPublishing(false);
        showErrorToast("임시 저장에 실패해 게시하지 못했어요.", error);
        return;
      }
      onSaved(ack.version);

      try {
        const data = await publishAsync({
          formId: id,
          expectedVersion: ack.version,
        });
        Toast.show({ message: "공연이 게시되었습니다!", type: "success" });
        // 이동 중 버튼이 다시 활성화되면 이미 게시된 폼을 또 제출할 수 있음
        // 화면을 떠나며 사라질 상태라 성공 시 isPublishing을 되돌리지 않음
        router.replace(`/board/promote/d/${data.publicKey}`);
      } catch (error) {
        setIsPublishing(false);
        showErrorToast("임시 저장은 완료됐지만 게시하지 못했어요.", error);
      }
    },
    [buildPayload, formId, onSaved, publishAsync, router, saveAsync, showErrorToast, validate]
  );

  return { handlePublish, isPublishing };
}
