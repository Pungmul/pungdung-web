import dayjs from "dayjs";

import { FrequentBoards, HomeHeader, HomeHotPostList } from "@/features/board";
import { NearLightningContent } from "@/features/lightning";
import { NotificationPermissionRequestCTA } from "@/features/notification";

import { SkeletonView, SuspenseComponent as Suspense } from "@/shared";

export default function Home() {
  const timeString = dayjs().format("YYYY.MM.DD HH:mm");

  return (
    <div className="relative w-full flex flex-col flex-grow max-w-[100dvw] min-w-[360px]">
      <div className="flex flex-col flex-grow md:max-w-[768px] md:w-full lg:w-[768px] md:mx-auto">
        <header className="flex flex-col gap-[12px] py-[24px]">
          <Suspense
            clientOnly
            fallback={
              <div className="flex flex-row justify-between items-end px-[24px]">
                <SkeletonView className="w-[240px] h-[28px] rounded-[8px] md:rounded-[4px]" />
              </div>
            }
          >
            <HomeHeader />
          </Suspense>
          <FrequentBoards />
        </header>
        <main className="relative w-full h-full flex-grow flex flex-col gap-[32px]">
          <section className="flex flex-col gap-[28px] pb-[16px]">
            <h2 className="text-h2 px-[24px]">근처에서 생긴 번개</h2>
            <NearLightningContent />
          </section>
          <section className="flex flex-col gap-[28px] pb-[32px]">
            <div className="flex flex-row items-end px-[24px] gap-[8px]">
              <h2 className="flex flex-row items-end text-h2">
                지금 뜨는 인기글
              </h2>
              <span className="text-grey-400 text-m1">{timeString}기준</span>
            </div>
            <div className="px-[32px]">
              <Suspense
                clientOnly
                fallback={
                  <SkeletonView className="w-full h-[560px] rounded-[8px] md:rounded-[4px]" />
                }
              >
                <HomeHotPostList />
              </Suspense>
            </div>
          </section>
        </main>
        <NotificationPermissionRequestCTA />
      </div>
    </div>
  );
}
