"use client";

import Link from "next/link";

export default function BoardPageError() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 px-6 py-16">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-grey-800">
          게시판을 표시할 수 없어요
        </h2>
        <p className="text-grey-600">잠시 후 다시 시도해 주세요.</p>
      </div>
      <Link
        href="/board/main"
        replace
        className="rounded-lg border border-grey-300 px-6 py-2 text-grey-700 transition-colors hover:bg-grey-100"
      >
        게시판 목록으로
      </Link>
    </div>
  );
}
