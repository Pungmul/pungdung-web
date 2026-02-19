/**
 * {@link HotPostBanner}와 동일한 외곽·pill 레이아웃·색만 두고 문구는 넣지 않는다.
 */
export function HotPostBannerSkeleton() {
  return (
    <div className="flex h-[64px] w-full flex-row items-center gap-2 bg-grey-100 px-[16px] md:bg-transparent">
      <div className="bg-red-50 flex w-full flex-row items-center gap-2 overflow-hidden rounded-full px-[12px] py-[8px]">
        <div
          className="h-[24px] w-[24px] flex-shrink-0 animate-pulse rounded-full bg-grey-200"
          aria-hidden
        />
        <div
          className="h-5 min-w-0 flex-1 animate-pulse rounded-full bg-grey-200/70"
          aria-hidden
        />
      </div>
    </div>
  );
}
