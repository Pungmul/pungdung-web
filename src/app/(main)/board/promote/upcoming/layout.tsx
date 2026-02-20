import { Metadata } from "next";

import { BoardHeader } from "@/features/board";

export const metadata: Metadata = {
  title: "풍덩 | 관람 예정 공연",
  description: "관람 예정된 공연 목록 입니다.",
};

export const dynamic = "force-dynamic";

export default async function UpcomingPerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full">
      <BoardHeader boardID={"upcoming-performance"} />
      <div className="flex flex-col w-full flex-grow relative items-center">
        <div className="w-full max-w-[768px]">{children}</div>
      </div>
    </div>
  );
}
