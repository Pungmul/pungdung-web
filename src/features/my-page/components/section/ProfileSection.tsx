import Image from "next/image";
import Link from "next/link";

import { SkeletonView, Space } from "@/shared";

import { formatMyPageClubSummaryLine } from "@/features/my-page/lib/format-my-page-club-summary-line";

export function ProfileSectionSkeleton() {
  return (
    <section className="flex flex-col list-none">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-grey-800 font-semibold text-lg p-[8px]">프로필</h2>
      </div>
      <Space h={16} />
      <div className="flex flex-row items-end justify-between px-2 gap-6 md:gap-12">
        <SkeletonView className="h-[128px] md:h-[256px] aspect-[1] rounded-md" />
        <div className="flex-grow">
          <ul className="flex flex-col gap-[16px] list-none py-1">
            <li className="flex flex-row justify-between">
              <span className="text-grey-500 text-base">이름</span>
              <SkeletonView className="h-[24px] w-[120px] md:w-[160px] rounded" />
            </li>
            <li className="flex flex-row justify-between">
              <span className="text-grey-500 text-base">패명</span>
              <SkeletonView className="h-[24px] w-[120px] md:w-[160px] rounded" />
            </li>
            <li className="flex flex-row justify-between">
              <span className="text-grey-500 text-base">동아리</span>
              <SkeletonView className="h-[24px] w-[120px] md:w-[160px] rounded" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

type ProfileSectionProps = {
  profileImageSrc: string | undefined;
  name: string | undefined;
  clubName: string | undefined;
  groupName: string | undefined;
  clubAge: number | undefined;
};

export function ProfileSection({
  profileImageSrc,
  name,
  clubName,
  groupName,
  clubAge,
}: ProfileSectionProps) {
  // 동아리 문구 규칙은 lib 순수 함수로 위임해 UI 분기 복잡도를 줄인다.
  const clubSummaryLine = formatMyPageClubSummaryLine({ groupName, clubAge });

  return (
    <section className="flex flex-col list-none">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-grey-800 font-semibold text-lg p-[8px]">프로필</h2>
        <Link
          href="/my-page/edit"
          className="text-grey-400 p-[8px] hover:text-primary"
        >
          수정
        </Link>
      </div>
      <Space h={16} />
      <div className="flex flex-row items-end justify-between px-2 gap-6 md:gap-12">
        <div className="h-full min-h-[128px] md:min-h-[256px] aspect-[1] overflow-hidden rounded-md border-2 border-grey-300 relative">
          {profileImageSrc && (
            <Image
              src={profileImageSrc}
              alt="profile"
              fill
              className="object-cover object-center"
            />
          )}
        </div>
        <div className="flex-grow">
          <ul className="flex flex-col gap-[16px] list-none py-1">
            <li className="flex flex-row justify-between">
              <span className="text-grey-500 text-base">이름</span>
              <span className="text-base">{name}</span>
            </li>
            <li className="flex flex-row justify-between">
              <span className="text-grey-500 text-base">패명</span>
              <span className="text-base">{clubName ?? "-"}</span>
            </li>
            <li className="flex flex-row justify-between">
              <span className="text-grey-500 text-base">동아리</span>
              <span className="text-base">{clubSummaryLine}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
