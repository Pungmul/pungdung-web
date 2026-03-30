"use client";

import React from "react";
import Link from "next/link";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { ErrorBoundary, ErrorBoundaryFallbackProps } from "@suspensive/react";
import { Suspense } from "@suspensive/react";

import { ClientApiError } from "@/core/api/client";

import { HotPostBannerSkeleton } from "@/features/board";
import { PostBoxSkeleton } from "@/features/post";

import { Button, LinkChipButton, ListEmptyView } from "@/shared/components";

const NO_CLUB_CODE = "POST_014";

export function ClubBoardBoundary({ children }: { children: React.ReactNode }) {

    return (
        <QueryErrorResetBoundary>
            {({ reset: resetQueries }) => (
                <ErrorBoundary onReset={resetQueries} fallback={ClubBoardError}>
                    <Suspense clientOnly fallback={<ClubBoardLoading />}>
                        {children}
                    </Suspense>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    )
}


function ClubBoardLoading() {
    return (
        <React.Fragment>
            <div aria-busy aria-label="동아리 게시판 로딩">
                <HotPostBannerSkeleton />
            </div>
            <PostBoxSkeleton length={8} />
        </React.Fragment>
    );
}

function ClubBoardError({
    error,
    reset: resetBoundary,
}: ErrorBoundaryFallbackProps) {
    if (error instanceof ClientApiError && error.code === NO_CLUB_CODE) {
        return (
            <ListEmptyView
                message={error.message || "소속 동아리가 없습니다."}
                action={
                    <LinkChipButton href="/board/main" filled>
                        게시판으로 돌아가기
                    </LinkChipButton>
                }
            />
        );
    }

    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-[16px] py-12 text-center">
            <p className="whitespace-pre-line text-base leading-relaxed text-grey-800">
                {"동아리 게시판을 불러오지 못했어요.\n다시 시도해 주세요."}
            </p>
            <div className="flex items-center gap-2">
                <Button type="button" onClick={resetBoundary}>
                    다시 시도
                </Button>
                <Link href="/board/main" className="text-sm text-grey-500 underline">
                    게시판으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
