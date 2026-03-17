"use client";

import { useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import { myPageQueries } from "@/features/my-page";

import { NotificationIcon } from "@/features/notification/components";

export function HomeHeader() {
  const router = useRouter();
  const { data: myInfo } = useSuspenseQuery(myPageQueries.info());

  return (
    <div className="flex flex-row justify-between items-end px-[24px]">
      <h1 className="text-[18px] font-normal">
        {myInfo?.clubName || myInfo?.name}님 안녕하세요?
      </h1>
      <div className="flex flex-row justify-end">
        <div className="md:hidden" onClick={() => router.push("/notification")}>
          <NotificationIcon />
        </div>
      </div>
    </div>
  );
}
