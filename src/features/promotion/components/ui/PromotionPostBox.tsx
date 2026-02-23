import Image from "next/image";
import Link from "next/link";

import dayjs from "dayjs";
import { UsersIcon } from "@heroicons/react/24/solid";

import { addressToString } from "../../lib";
import { Promotion } from "../../types";

// PromotionPostBox 컴포넌트
export function PromotionPostBox({ promotion }: { promotion: Promotion }) {
  return (
    <li className="relative w-full bg-background p-[12px] cursor-pointer group">
      <Link
        href={`/board/promote/d/${promotion.publicKey}`}
        className="w-full flex flex-col gap-[12px]"
      >
        <div className="relative w-full aspect-[240/340] bg-grey-200 rounded-[4px] overflow-hidden border border-grey-200 transition-all duration-200 group-hover:scale-105">
          <div className="absolute top-[8px] right-[8px] bg-grey-400 text-white text-[11px] font-normal px-[4px] py-[2px] rounded-[4px] z-10">
            {promotion.status === "OPEN" ? "진행중" : "종료"}
          </div>
          <Image
            src={
              promotion.performanceImageInfoList?.[0]
                ? promotion.performanceImageInfoList[0].imageUrl
                : "/example/poster.jpg"
            }
            alt={promotion.title}
            fill
            className="object-cover object-center h-full"
          />
        </div>
        <div className="flex-grow w-full flex justify-between flex-col items-start gap-[8px]">
          <div className="line-clamp-2 font-semibold text-[17px] leading-[24px] text-grey-800">
            {promotion.title}
          </div>
          <div className="w-full flex flex-col gap-[4px] items-start">
            <div className="text-grey-500 text-[13px] font-normal max-w-full line-clamp-2 break-keep">
              {promotion.address
                ? addressToString(promotion.address)
                : "주소 없음"}
            </div>
            <div className="text-grey-400 text-[12px] font-normal max-w-full line-clamp-1">
              {(() => {
                const date = promotion.startAt
                  ? dayjs(new Date(promotion.startAt))
                  : dayjs(new Date("2025-09-11T17:00:00"));
                const hour = date.hour();
                const timePrefix = hour < 12 ? "이른" : "늦은";
                const time12 = date.format("h시 mm분");
                return `${date.format(
                  "YYYY.MM.DD(ddd)"
                )} ${timePrefix} ${time12}`;
              })()}
            </div>
          </div>
        </div>
        <div className="bg-grey-400 text-[12px] text-white lg:text-[14px] w-fit font-normal px-[4px] py-[2px] rounded-[4px] z-10 flex items-center gap-[4px]">
          <UsersIcon className="size-4 text-white" />
          {promotion.limitNum ? `${promotion.limitNum}` : "제한 없음"}
        </div>
      </Link>
    </li>
  );
}
