"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { useLoginRequiredConfirmAction } from "@/features/auth";

import { getBoardRoute } from "../../lib";
import { frequentBoardItemKey, useFrequentBoard } from "../../store";

const FIXED_BOARDS = [
  { name: "인기 게시판", href: "/board/hot-post", requiresLogin: true },
  { name: "자유 게시판", href: "/board/1", requiresLogin: false },
  { name: "홍보 게시판", href: getBoardRoute("promote"), requiresLogin: false },
] as const;

export function BoardListNav({ isGuest = false }: { isGuest?: boolean }) {
  const { requestLogin } = useLoginRequiredConfirmAction();
  const { boardList, removeBoard } = useFrequentBoard();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  return (
    <aside className="hidden lg:mr-3 lg:block">
      <nav aria-label="게시판 목록" className="sticky top-[72px] w-40 rounded-xl border border-grey-200 bg-background p-3">
        <ul className="flex list-none flex-col gap-1">
          {FIXED_BOARDS.map((board) => (
            <li key={board.href}>
              <Link
                href={board.href}
                prefetch={false}
                onClick={(event) => {
                  if (isGuest && board.requiresLogin) {
                    event.preventDefault();
                    requestLogin();
                  }
                }}
                className="block rounded-md p-3 text-xs font-bold hover:bg-grey-100"
              >
                {board.name}
              </Link>
            </li>
          ))}
        </ul>
        {hydrated && boardList.length > 0 && (
          <section className="mt-3.5">
            <h2 className="px-1.5 py-1 text-xs text-grey-500">최근 방문한 게시판</h2>
            <ul className="flex list-none flex-col gap-1">
              {boardList.slice(0, 5).map((board) => (
                <li key={frequentBoardItemKey(board)} className="flex items-center justify-between gap-2 rounded-md pl-3 pr-2 hover:bg-grey-100">
                  <Link href={getBoardRoute(board.id, board.tabId)} prefetch={false} className="min-w-0 flex-1 truncate py-3 text-xs font-bold">
                    {board.name}
                  </Link>
                  <button type="button" aria-label={`${board.name} 삭제`} onClick={() => removeBoard(board)} className="flex size-6 shrink-0 items-center justify-center text-grey-400">
                    <XMarkIcon className="size-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </nav>
    </aside>
  );
}
