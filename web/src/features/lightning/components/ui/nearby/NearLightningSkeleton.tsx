import { SkeletonView } from "@/shared/components";

export function NearLightningSkeleton() {
  return (
    <div className="relative w-full px-[16px] overflow-x-auto scrollbar-hide">
      <ul className="w-full h-full gap-[12px] flex flex-row list-none">
        {Array.from({ length: 5 }).map((_, index) => (
          <li
            key={"skeleton-card-" + index}
            className="w-[280px] aspect-[16/9] rounded-[4px] shrink-0"
          >
            <SkeletonView className="w-full h-full rounded-[4px]" />
          </li>
        ))}
      </ul>
    </div>
  );
}
