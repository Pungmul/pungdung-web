"use client";

import { useRef } from "react";

import { useFormContext } from "react-hook-form";

import type { Editor as EditorType } from "@toast-ui/react-editor";

import { Button, Header, Space, Spinner, useConfirmPageLeave } from "@/shared";

import { usePromotionPostingFormActions } from "../../../../hooks/actions";
import type { PromotionFormDraft } from "../../../../types";
import type { PromotionPostingFormValues } from "../../../../types/promotion-posting-form.types";
import { PromotionDraftDeleteButton } from "../PromotionDraftDeleteButton";
import { PromotionInfoForm } from "../PromotionInfoForm";
import { PromotionPosterForm } from "../PromotionPoster";
import { PromotionTabs } from "../PromotionTabs";

export function PromotionPostingFormBody({
  formId,
  form,
}: {
  formId: string | null;
  form: PromotionFormDraft;
}) {
  const descriptionEditorRef = useRef<EditorType | null>(null);
  const { formState } = useFormContext<PromotionPostingFormValues>();
  const { allowLeave } = useConfirmPageLeave({
    enabled: formState.isDirty,
    alert: {
      title: "확인",
      message: "이 화면을 벗어나면 저장하지 않은 내용이 사라져요.",
      confirmText: "나가기",
      cancelText: "머무르기",
    },
  });
  const { handleSaveDraft, handlePublish, isPending } =
    usePromotionPostingFormActions(
      formId,
      form,
      descriptionEditorRef,
      allowLeave
    );

  return (
    <>
      <Header
        title="공연 등록"
        onLeftClick={() => {
          window.history.back();
        }}
        rightBtn={
          isPending ? (
            <Spinner size={24} />
          ) : (
            <button
              type="button"
              onClick={handleSaveDraft}
              className="text-center text-grey-500 cursor-pointer text-[16px]"
            >
              임시 저장
            </button>
          )
        }
      />
      <form
        className="relative flex flex-col px-[24px] py-[12px]"
        onSubmit={handlePublish}
      >
        <PromotionPosterForm />
        <Space h={32} />

        <PromotionInfoForm />
        <Space h={32} />

        <PromotionTabs descriptionEditorRef={descriptionEditorRef} />

        {formId ? (
          <PromotionDraftDeleteButton
            formId={formId}
            onBeforeLeave={allowLeave}
          />
        ) : null}

        <Space h={64} />

        <footer className="sticky w-full bottom-0 z-10 flex flex-row justify-start max-w-[640px] min-w-[320px] mx-auto p-[12px] px-[4px] pb-[24px] py-[32px] bg-gradient-to-t from-background via-background via-80% to-transparent">
          <Button
            disabled={isPending}
            type="submit"
            className={
              "w-full border-primary bg-primary text-background py-2 rounded-md flex justify-center items-center " +
              (isPending ? " bg-primary-light" : " cursor-pointer")
            }
          >
            {isPending ? <Spinner /> : "등록하기"}
          </Button>
        </footer>
      </form>
    </>
  );
}
