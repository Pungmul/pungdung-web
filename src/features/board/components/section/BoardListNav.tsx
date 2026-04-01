"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { boardHrefSegment } from "../../lib";
import { boardQueries } from "../../queries";
import { cn } from "@/shared";

function boardNavLinkClass(isActive: boolean) {
  return cn("cursor-pointer text-[15px]",
    isActive ? "text-primary" : "text-grey-500",
    "hover:text-primary transition-colors");
}

function isBoardPathActive(pathname: string, segment: string): boolean {
  const basePath = `/board/${segment}`;
  return pathname === basePath || pathname.startsWith(`${basePath}/`);
}

export function BoardListNav() {
  // 현재 경로와 핫게시판·각 게시판 활성 표시 매칭
  const pathname = usePathname();
  const router = useRouter();
  // 게시판 사이드바 목록
  const { data: boardList = [] } = useQuery(boardQueries.list());

  return (
    <aside>
      <nav className="hidden lg:flex flex-col gap-[24px] sticky top-[72px] self-start w-36 h-fit">
        <h2 className="text-[17px] font-bold px-4">다른 게시판</h2>
        <ul className="flex flex-col items-start list-none gap-[24px] p-4">
          <li>
            <Link
              href="/board/hot-post"
              prefetch={false}
              className={boardNavLinkClass(
                isBoardPathActive(pathname, "hot-post")
              )}
              onMouseEnter={() => {
                void router.prefetch("/board/hot-post");
              }}
              onTouchStart={() => {
                void router.prefetch("/board/hot-post");
              }}
            >
              인기 게시글
            </Link>
          </li>
          {boardList.map((board) => {
            const segment = boardHrefSegment(board.id);
            return (
              <li key={board.id}>
                <Link
                  href={`/board/${segment}`}
                  prefetch={false}
                  className={boardNavLinkClass(
                    isBoardPathActive(pathname, segment)
                  )}
                  onMouseEnter={() => {
                    void router.prefetch(`/board/${segment}`);
                  }}
                  onTouchStart={() => {
                    void router.prefetch(`/board/${segment}`);
                  }}
                >
                  {board.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
