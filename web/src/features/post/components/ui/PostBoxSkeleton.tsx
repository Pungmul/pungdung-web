import { SkeletonView } from "@/shared/components";

export function PostBoxSkeleton({ length }: { length: number }) {
  return (
    <>
      {Array.from({ length }).map((_, idx) => (
        <li
          key={"post-skeleton-" + idx}
          className="w-full bg-background flex flex-col relative py-6 px-8 gap-2"
        >
          <div
            className="flex justify-between flex-col items-start gap-2 "
          >
            <SkeletonView style={{ height: 20 }} className="w-full rounded h-5" />
            <SkeletonView
              style={{ height: 12, width: 48 }}
              className="rounded h-3 w-12"
            />
          </div>
          <div
            className="text-grey-400 flex flex-col w-full gap-2"
          >
            <SkeletonView className="w-full rounded h-2" />
            <SkeletonView className="w-full rounded h-2" />
            <SkeletonView className="w-32 rounded h-2" />
          </div>
        </li>
      ))}
    </>
  );
}
