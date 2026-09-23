import Image from "next/image";
import Link from "next/link";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

type ChatPromotionInfoPanelViewProps = {
  href: string;
  posterUrl: string | null;
  title: string;
  location: string;
  scheduleLabel: string;
};

export function ChatPromotionInfoPanelView({
  href,
  posterUrl,
  title,
  location,
  scheduleLabel,
}: ChatPromotionInfoPanelViewProps) {
  return (
    <section className="flex shrink-0 items-center justify-between gap-3 border-b border-grey-100 bg-background px-5 py-4">
      <div className="flex min-w-0 flex-1 flex-row items-center gap-3">
        <div className="relative size-[64px] shrink-0 overflow-hidden rounded-[8px] bg-grey-200">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : null}
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <p className="min-w-0 truncate text-[13px] font-semibold leading-[15px] text-grey-800">
            {title}
          </p>
          <div className="flex min-w-0 flex-col gap-1">
            <p className="min-w-0 truncate text-[11px] leading-[12px] text-grey-400">
              {location}
            </p>
            <p className="min-w-0 truncate text-[11px] leading-[12px] text-grey-400">
              {scheduleLabel}
            </p>
          </div>
        </div>
      </div>
      <Link
        href={href}
        aria-label={`${title} 상세`}
        className="flex size-11 shrink-0 items-center justify-center"
      >
        <ChevronRightIcon className="size-5 text-grey-400" aria-hidden />
      </Link>
    </section>
  );
}
