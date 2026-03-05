import { Metadata } from "next";

import { Suspense } from "@suspensive/react";

import { Header, Space, Spinner } from "@/shared";

export const metadata: Metadata = {
  title: "풍덩 | 내 정보 수정",
  description: "내 정보 수정 페이지",
};

export default function EditPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-grey-100 h-full w-full">
      <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-background">
        <Header title="프로필 수정" />
        <Space h={36} />
        <Suspense
          clientOnly
          fallback={
            <div className="flex-grow flex items-center justify-center">
              <Spinner size={32} />
            </div>
          }
        >
          {children}
        </Suspense>
      </div>
    </div>
  );
}
