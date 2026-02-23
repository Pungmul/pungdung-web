import { SkeletonView } from "@/shared";

export const PromotionPostBoxSkeleton = ({ length }: { length: number }) => {
    return (
      <>
        {Array.from({ length }).map((_, idx) => (
          <div
            key={"promotion-post-box-skeleton-" + idx}
            className="relative w-full bg-background p-[12px]"
          >
            <section className="w-full flex flex-col gap-[12px]">
              <div className="relative w-full aspect-[240/340] rounded-[4px] overflow-hidden">
                <SkeletonView style={{ height: '100%' }} className="w-full h-full rounded-[4px]" />
              </div>
              <div className="flex-grow w-full flex justify-between flex-col items-start gap-[8px]">
                <SkeletonView style={{ height: 24 }} className="w-full rounded-[4px]" />
  
                <div className="w-full flex flex-col gap-[4px] items-start">
                  <SkeletonView style={{ height: 14 }} className="w-full rounded-[4px]" />
                  <SkeletonView style={{ height: 14 }} className="w-full rounded-[4px]" />
                </div>
              </div>
            </section>
          </div>
        ))}
      </>
    );
  };