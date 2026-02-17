"use client";

import { CheckIcon } from "@heroicons/react/24/outline";

import { Modal } from "@/shared/components";

import { useReportCommentAction } from "../../hooks/actions";
import {
  useReportCommentForm,
  useResetReportFormWhenModalOpens,
} from "../../hooks/form";
import {
  useReportComment,
  useReportCommentModal,
} from "../../store";

import { COMMENT_REPORT_TYPES } from "@/features/comment/constants/comment-report-enum";

const ReportCommentModal: React.FC = () => {
  // 스토어: 열린 대상 댓글·모달 표시 여부
  const { reportedComment, isModalOpen } = useReportCommentModal();
  const { closeModal } = useReportComment();

  // 신고 사유 폼
  const {
    handleSubmit,
    register,
    reset,
    selectedReportReason,
  } = useReportCommentForm();
  useResetReportFormWhenModalOpens({ isModalOpen, reset });

  // 제출 시 API mutation + 모달 닫기
  const { handleReportSubmit, isPending } = useReportCommentAction({
    closeModal,
    handleSubmit,
  });

  if (!reportedComment) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title="댓글 신고하기"
      className="border-none"
    >
      <form
        className="flex flex-col gap-4 justify-center items-center w-full h-full py-[12px]"
        onSubmit={handleReportSubmit}
      >
        <div className="text-left w-full bg-grey-200 py-3 px-4 rounded">
          <div>댓글 내용: {reportedComment?.content}</div>
          <div>작성자: {reportedComment?.userName}</div>
        </div>

        <div className="px-2 text-left w-full text-grey-400">사유 선택</div>

        <ul className="w-full border border-grey-100 py-3 px-4 rounded gap-4 flex flex-col">
          {Object.entries(COMMENT_REPORT_TYPES).map(([key, value]) => (
            <li key={key}>
              <label htmlFor={key} className="flex items-center cursor-pointer">
                <input
                  {...register("reportReason")}
                  type="radio"
                  id={key}
                  value={key}
                  className="hidden peer"
                />
                <span className="w-6 h-6 mr-2 border-2 border-grey-400 rounded-full peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                  <CheckIcon className="size-3 text-white stroke-2" />
                </span>
                {value}
              </label>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="w-full py-4 rounded-md mt-2 disabled:bg-primary-light disabled:cursor-not-allowed  bg-primary-dark text-white peer-checked:enabled:bg-primary"
          disabled={!selectedReportReason || isPending}
          title="신고하기"
        >
          {isPending ? "신고 중..." : "신고하기"}
        </button>
      </form>
    </Modal>
  );
};

export { ReportCommentModal };
