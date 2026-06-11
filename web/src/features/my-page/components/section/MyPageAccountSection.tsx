"use client";

import { SkeletonView } from "@/shared";
type MyPageAccountSectionProps = {
  email?: string;
};

export function MyPageAccountSection({ email }: MyPageAccountSectionProps) {
  return (
    <div className="flex flex-row justify-between p-[8px]">
      <span className="text-grey-600 font-semibold">이메일</span>
      <span className="text-grey-800">{email}</span>
    </div>
  );
}

export function MyPageAccountSectionSkeleton() {
  return (
    <div className="flex flex-row justify-between p-[8px]">
      <span className="text-grey-600 font-semibold">이메일</span>
      <SkeletonView className="h-[20px] w-[120px] md:w-[160px] rounded" />
    </div>
  );
}
