"use client";

import { useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { CheckIcon } from "@heroicons/react/24/outline";

import { Modal } from "@/shared/components";

import { useReportPostModalAction } from "../../hooks/actions";
import { useReportPost } from "../../hooks/state";
import {
  reportPostModalFormSchema,
  type ReportPostModalFormValues,
} from "../../types/schemas";

import {
  POST_REPORT_TYPES,
  type PostReportType,
} from "@/features/post/constants/post-report-enum";

export function ReportPostModal() {
  // 신고 대상 메타 + 모달 열림 상태
  const { reportedPost, isModalOpen, closeModal } = useReportPost();

  // 사유 선택 폼
  const form = useForm<ReportPostModalFormValues>({
    resolver: zodResolver(reportPostModalFormSchema),
    defaultValues: {},
  });

  // 제출 시 mutation·모달 닫기
  const { onSubmit, isPending } = useReportPostModalAction({
    closeModal,
    handleSubmit: form.handleSubmit,
  });

  // 모달을 다시 열 때 이전 입력 제거
  useEffect(() => {
    if (isModalOpen) {
      form.reset({});
    }
  }, [form, isModalOpen]);

  const reportReason = form.watch("reportReason");

  if (!reportedPost) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="게시글 신고하기"
      className="border-none"
    >
      <FormProvider {...form}>
        <form
          className="flex flex-col gap-4 justify-center items-center w-full h-full py-[12px]"
          onSubmit={onSubmit}
        >
          <div className="text-left w-full bg-grey-200 py-3 px-4 rounded">
            <div>제목: {reportedPost.title}</div>
            <div>
              작성자:
              {" "}
              {reportedPost.author === "Anonymous"
                ? "익명"
                : reportedPost.author}
            </div>
          </div>

          <div className="px-2 text-left w-full text-grey-400">사유 선택</div>

          <Controller
            name="reportReason"
            control={form.control}
            render={({ field }) => (
              <ul className="w-full border border-grey-100 py-3 px-4 rounded gap-4 flex flex-col">
                {Object.entries(POST_REPORT_TYPES).map(([key, value]) => (
                  <li key={key}>
                    <label
                      htmlFor={key}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        id={key}
                        name="options"
                        className="hidden peer"
                        checked={field.value === key}
                        value={key}
                        onChange={() =>
                          field.onChange(key as PostReportType)}
                      />
                      <span className="w-6 h-6 mr-2 border-2 border-grey-400 rounded-full peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                        <CheckIcon className="size-3 text-white stroke-2" />
                      </span>
                      {value}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          />
          <button
            type="submit"
            className="w-full py-4 rounded-md mt-2 disabled:bg-primary-light disabled:cursor-not-allowed  bg-primary-dark text-white peer-checked:enabled:bg-primary"
            disabled={reportReason === undefined || isPending}
            title="신고하기"
          >
            {isPending ? "신고 중..." : "신고하기"}
          </button>
        </form>
      </FormProvider>
    </Modal>
  );
}
