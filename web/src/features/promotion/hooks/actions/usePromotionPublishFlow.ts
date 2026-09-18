"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Alert, Toast } from "@/shared";

import { usePublishPromotionForm } from "./usePublishPromotionForm";
import { useSavePromotionFormDraft } from "./useSavePromotionFormDraft";
import {
  type PromotionActionErrorPhase,
  resolvePromotionActionError,
} from "../../lib/promotion-action-error-message";
import type { PromotionPublishValidation } from "../../services";
import type { PromotionFormSaveAck, PromotionFormSavePayload } from "../../types";

// 검증, 포스터 확인 후 저장, 저장 후 게시
// 게시가 실패해도 저장 결과 버전은 onSaved로 편집 세션에 반영
export function usePromotionPublishFlow({
  formId,
  validate,
  hasPoster,
  buildPayload,
  onSaved,
}: {
  formId: string | null;
  validate: () => PromotionPublishValidation;
  hasPoster: () => boolean;
  buildPayload: () => PromotionFormSavePayload;
  onSaved: (version: number) => void;
}) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const { mutateAsync: saveAsync } = useSavePromotionFormDraft();
  const { mutateAsync: publishAsync } = usePublishPromotionForm();

  const reportActionError = useCallback(
    (phase: PromotionActionErrorPhase, error: unknown) => {
      const copy = resolvePromotionActionError(error, phase);
      Toast.show({ message: copy.message, type: "error" });
    },
    []
  );

  const saveAndPublish = useCallback(
    async (id: number) => {
      setIsPublishing(true);
      let ack: PromotionFormSaveAck;
      try {
        ack = await saveAsync({ formId: id, form: buildPayload() });
      } catch (error) {
        setIsPublishing(false);
        reportActionError("save", error);
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
        reportActionError("publish", error);
      }
    },
    [
      buildPayload,
      onSaved,
      publishAsync,
      reportActionError,
      router,
      saveAsync,
    ]
  );

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

      // 포스터는 필수가 아니라 권장
      // 바깥 영역으로 닫으면 onCancel 없이 닫히므로 콜백으로만 진행
      if (!hasPoster()) {
        Alert.confirm({
          title: "포스터 없이 게시할까요?",
          message: "포스터가 있으면 공연 목록에서 더 잘 보여요.",
          confirmText: "게시",
          onConfirm: () => void saveAndPublish(id),
        });
        return;
      }

      await saveAndPublish(id);
    },
    [formId, hasPoster, saveAndPublish, validate]
  );

  return { handlePublish, isPublishing };
}
