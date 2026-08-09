"use client";

import { Spinner } from "@/shared/components";

import type { PostEditorSubmitUploadUi } from "../../types/post-editor-submit.types";

export function PostSubmitProgressOverlay({
  uploadUi,
}: {
  uploadUi: PostEditorSubmitUploadUi;
}) {
  if (uploadUi.phase === "idle") {
    return null;
  }

  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="absolute inset-0 z-[30] flex flex-col items-center justify-center gap-3 bg-black/40 px-4 text-white"
    >
      <Spinner size={36} baseColor="#FFFFFF" highlightColor="#D9D9D9" />
      {uploadUi.phase === "compressing" ? (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-[15px] font-medium">이미지 압축 중...</p>
          <p className="text-[17px] font-semibold tabular-nums">
            {uploadUi.current}/{uploadUi.total}장 ({uploadUi.percent}%)
          </p>
        </div>
      ) : (
        <p className="text-[15px] font-medium">이미지 업로드 중...</p>
      )}
    </div>
  );
}
