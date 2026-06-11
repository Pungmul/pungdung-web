import { SkeletonView } from "@/shared";

function UpcomingPerformanceItemSkeletonRow() {
  return (
    <div
      role="presentation"
      aria-hidden
      className="flex w-full flex-row gap-[12px] bg-background px-[24px] py-[16px]"
    >
      <div className="relative h-[168px] shrink-0 lg:h-[192px]">
        <div className="relative flex h-full aspect-[2/3] items-center justify-center overflow-hidden rounded-[4px] border border-grey-200">
          <SkeletonView style={{ height: "100%" }} className="h-full w-full rounded-[4px]" />
        </div>
      </div>
      <div className="flex min-w-0 flex-grow flex-col justify-end gap-2 py-2">
        <div className="flex w-full flex-col gap-[6px]">
          <SkeletonView style={{ height: 22 }} className="w-[92%] rounded-[4px]" />
        </div>
        <div className="flex w-full flex-col gap-[4px]">
          <SkeletonView style={{ height: 14 }} className="w-[80%] rounded-[4px]" />
          <SkeletonView style={{ height: 14 }} className="w-[55%] rounded-[4px]" />
          <SkeletonView style={{ height: 14 }} className="w-[70%] rounded-[4px]" />
        </div>
      </div>
    </div>
  );
}

export const UpcomingPerformanceItemSkeleton = ({ length }: { length: number }) => {
  return (
    <>
      {Array.from({ length }).map((_, idx) => (
        <UpcomingPerformanceItemSkeletonRow key={`upcoming-performance-item-skeleton-${idx}`} />
      ))}
    </>
  );
};
