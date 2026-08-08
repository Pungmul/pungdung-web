"use client";

import { useEffect } from "react";
import Link from "next/link";

import { reportAppError } from "@/core/config/report-app-error";

// (main) 세그먼트 최후 방어
// layout 셸(Tabs/Sidebar)은 유지
export default function MainSegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    reportAppError(error, { boundary: "segment" });
  }, [error]);

  return (
    <div className="flex min-h-app flex-grow flex-col items-center justify-center space-y-6 px-6">
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
          페이지를 표시하지 못했어요
        </h2>
        <p className="mb-4 whitespace-pre-wrap text-grey-600">
          잠시 후 다시 시도해 주세요.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="rounded-lg border border-grey-300 px-6 py-2 text-grey-700 transition-colors hover:bg-grey-100"
        >
          홈으로
        </Link>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-grey-800 px-6 py-2 text-background transition-colors hover:bg-grey-700"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}
