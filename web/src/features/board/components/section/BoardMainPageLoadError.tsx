"use client";

import { useRouter } from "next/navigation";

import type { BoardRscLoadErrorKind } from "../../types";

const LOAD_ERROR_MESSAGE: Record<BoardRscLoadErrorKind, string> = {
  contract: "게시판 정보를 불러오지 못했습니다.",
  http: "게시판 목록을 불러오지 못했습니다.",
  unknown: "게시판 목록을 불러오지 못했습니다.",
};

export function BoardMainPageLoadError({
  errorKind,
}: {
  errorKind: BoardRscLoadErrorKind;
}) {
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-grey-100 px-6 text-center">
      <p className="text-[15px] text-grey-600">{LOAD_ERROR_MESSAGE[errorKind]}</p>
      <button
        type="button"
        className="text-primary underline"
        onClick={() => {
          router.refresh();
        }}
      >
        다시 시도
      </button>
    </div>
  );
}
