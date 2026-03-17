import { Metadata } from "next";

import { Header, Space } from "@/shared";

import { MyPageClient } from "./_MyPage";

// 서버 사이드 렌더링 완전 비활성화
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: `풍덩 | 마이 페이지`,
};

export default function MyPagePage() {
  return (
    <div className="bg-grey-100 h-full w-full">
      <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-grey-100">
        <Header title="마이 페이지" isBackBtn={false} />
        <Space h={12} />
        <MyPageClient />
      </div>
    </div>
  );
}
