import { Suspense } from "@suspensive/react";

import { Spinner } from "@/shared";

import { PromotionPostingPage } from "./_PromotionPostingPage";

export const metadata = {
  title: "풍덩 | 공연 등록",
};

export default function PromotionFormPage() {
  return (
    <div className="w-full bg-grey-100">
      <div className="relative w-full min-h-app md:max-w-[768px] h-full mx-auto bg-background">
        <Suspense
          clientOnly
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-background">
              <Spinner size={32} />
            </div>
          }
        >
          <PromotionPostingPage key="board-posting-page" />
        </Suspense>
      </div>
    </div>
  );
}
