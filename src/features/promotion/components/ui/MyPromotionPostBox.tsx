"use client";
import Image from "next/image";
import Link from "next/link";

import dayjs from "dayjs";
import { PhotoIcon } from "@heroicons/react/24/outline";

import { addressToString } from "../../lib";
import { PromotionFormListItem } from "../../types";

// MyPromotionPostBox 컴포넌트
export function MyPromotionPostBox({ form }: { form: PromotionFormListItem }) {
  return (
    <li className="relative w-full bg-background p-[12px] cursor-pointer group">
      <Link
        href={
          form.status === "DRAFT"
            ? `/board/promote/f?formId=${form.id}`
            : `/board/promote/m?formId=${form.id}&performanceId=${form.publicKey}`
        }
        className="w-full flex flex-col gap-[12px]"
      >
        <div className="relative w-full aspect-[240/340] bg-grey-200 rounded-[4px] overflow-hidden border border-grey-200 transition-all duration-200 group-hover:scale-105">
          {form.performanceImageInfoList?.[0] ? (
            <Image
              src={
                form.performanceImageInfoList?.[0]
                  ? form.performanceImageInfoList[0].imageUrl
                  : "/example/poster.jpg"
              }
              alt={form.title || "포스터"}
              fill
              className="object-cover object-center h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <span className="size-16 flex items-center justify-center">
                <PhotoIcon className="size-full text-grey-400" />
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow w-full flex justify-between flex-col items-start gap-[8px]">
          <div className="line-clamp-2 font-semibold text-[17px] leading-[24px] text-grey-800">
            {form.title || "제목 없는 공연" + form.id}
          </div>
          <div className="w-full flex flex-col gap-[4px] items-start">
            <div className="text-grey-500 text-[13px] font-normal max-w-full line-clamp-2 break-keep">
              {form.address ? addressToString(form.address) : "주소 없음"}
            </div>
            <div className="text-grey-400 text-[12px] font-normal max-w-full line-clamp-1">
              {(() => {
                const date = form.startAt
                  ? dayjs(new Date(form.startAt))
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
        {form.status === "OPEN" && (
          <div className="bg-grey-400 text-white text-[12px] lg:text-[14px] w-fit font-normal px-[4px] py-[2px] rounded-[4px] z-10 flex items-center gap-[4px]">
            공개중
          </div>
        )}
      </Link>
    </li>
  );
}
