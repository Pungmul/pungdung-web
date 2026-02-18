import { SkeletonView, Space } from "@/shared/components";

export function PostContentSkeleton() {
  return (
    <div className="flex-grow flex flex-col">
      <Space h={16} />
      <div
        className="flex flex-col px-[24px] py-[20px] bg-background gap-[36px]"
      >
        <div className="flex flex-col gap-[16px]">
          <SkeletonView className="w-[80%] h-[32px] rounded-sm" />
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-row gap-2 items-center">
              <SkeletonView
                style={{ height: 24, width: 48, borderRadius: 4 }}
              />
            </div>
            <div className="flex items-center flex-row gap-1">
              <div className="w-4 h-4 bg-grey-300" />
              <SkeletonView
                style={{ height: 16, width: 36, borderRadius: 4 }}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[12px]">
          <SkeletonView
            style={{ height: 20, width: "100%", borderRadius: 4 }}
          />
          <SkeletonView
            style={{ height: 20, width: "100%", borderRadius: 4 }}
          />
          <SkeletonView style={{ height: 20, width: "40%", borderRadius: 4 }} />
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex items-center flex-row gap-1">
            <div className="w-6 h-6 bg-red-200" />
            <SkeletonView style={{ height: 24, width: 48, borderRadius: 4 }} />
          </div>
          <div className="flex items-center flex-row gap-1">
            <div className="w-6 h-6 bg-grey-200" />
            <SkeletonView style={{ height: 24, width: 48, borderRadius: 4 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
