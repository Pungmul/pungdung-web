"use client";

import Link from "next/link";

import { useLoadMyFriends } from "@/features/friends";

import { SkeletonView,Space } from "@/shared";
import { SuspenseComponent as Suspense } from "@/shared";

import ProfileSection from "./ProfileSection";
import { ProfileSectionSkeleton } from "./ProfileSection";
import { useSuspenseGetMyPageInfo } from "../../queries";

export default function MyPageClient() {
  return (
    <div className="px-8 py-6 flex-grow flex flex-col w-full bg-background">
      <Suspense clientOnly fallback={<ProfileSectionSkeleton />}>
        <ProfileSection />
      </Suspense>

      <Space h={32} />

      {/* <section className="flex flex-col list-none ">
        <h3 className="text-grey-800 font-semibold text-[18px]">계정</h3>
        <Space h={16} />
        <ul className="flex flex-col gap-[4px] list-none"></ul>
      </section>

      <Space h={32} /> */}

      <section className="flex flex-col ">
        <h3 className="text-grey-800 font-semibold text-[18px]">계정</h3>
        <Space h={16} />
        <ul className="flex flex-col gap-[4px] list-none relative w-full">
          <li>
            <FriendsSection />
          </li>

          <li>
            <Suspense clientOnly fallback={<AccountSectionSkeleton />}>
              <AccountSection />
            </Suspense>
          </li>
          <li>
            <Link
              href="/my-page/change-password"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              비밀번호 변경
            </Link>
          </li>
          <li>
            <Link
              href="/my-page/login-setting"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              로그인 설정
            </Link>
          </li>
        </ul>
      </section>

      <Space h={32} />

      <section>
        <h3 className="text-grey-700 font-semibold text-[18px]">내 설정</h3>
        <Space h={16} />
        <ul className="flex flex-col gap-[4px] list-none">
          <li>
            <Link
              href="/my-page/dark-mode-setting"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              다크 모드
            </Link>
          </li>
          <li>
            <Link
              href="/my-page/notification-setting"
              className="block text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800"
            >
              알림 설정
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}

function AccountSection() {
  const { data: userInfo } = useSuspenseGetMyPageInfo();
  return (
    <div className="flex flex-row justify-between p-[8px]">
      <span className="text-grey-600 font-semibold">이메일</span>
      <span className="text-grey-800">{userInfo?.email}</span>
    </div>
  );
}

function AccountSectionSkeleton() {
  return (
    <div className="flex flex-row justify-between p-[8px]">
      <span className="text-grey-600 font-semibold">이메일</span>
      <SkeletonView className="h-[20px] w-[120px] md:w-[160px] rounded" />
    </div>
  );
}

function FriendsSection() {
  const {
    data: { acceptedFriendList, pendingReceivedList } = {
      acceptedFriendList: [],
      pendingReceivedList: [],
    },
    isLoading,
  } = useLoadMyFriends();
  return (
    <Link
      href="/my-page/friends"
      className="text-[16px] text-grey-600 font-semibold p-[8px] hover:text-grey-800 flex flex-row items-center justify-between gap-[8px]"
    >
      친구 관리 {!isLoading && acceptedFriendList?.length}
      {isLoading ? (
        <SkeletonView className="h-[20px] w-[120px] md:w-[160px] rounded" />
      ) : (
        pendingReceivedList?.length > 0 && (
          <p className="text-blue-400 text-[14px]">
            {pendingReceivedList?.length} 개의 새로운 친구 요청
          </p>
        )
      )}
    </Link>
  );
}
