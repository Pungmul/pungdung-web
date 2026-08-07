"use client";

import { Suspense } from "react";

import {
  BoardDetailContent as BoardDetailContentImpl,
  BoardDetailContentLoading,
  type BoardDetailContentProps,
} from "./BoardDetailContent";
import { BoardDetailContentErrorBoundary } from "./BoardDetailContentErrorBoundary";

export type { BoardDetailContentProps };

export function BoardDetailContent(props: BoardDetailContentProps) {
  return (
    <BoardDetailContentErrorBoundary>
      <Suspense fallback={<BoardDetailContentLoading />}>
        <BoardDetailContentImpl {...props} />
      </Suspense>
    </BoardDetailContentErrorBoundary>
  );
}
