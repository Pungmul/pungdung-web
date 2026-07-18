"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { resolveLoginReturnPath } from "@/features/auth";

import { Alert, Button, LinkButton, Space } from "@/shared";
import { KakaoLogo } from "@/shared/components/Icons";

import { LoginForm } from "@/features/auth/components";
import { useLoginForm } from "@/features/auth/hooks/form";

export default function LoginPage() {
  const handledReasonRef = useRef<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnPath = resolveLoginReturnPath(searchParams.get("next"));
  const loginForm = useLoginForm({ returnPath });

  useEffect(() => {
    const reason = searchParams.get("reason");
    const message =
      reason === "session_expired"
        ? "로그인 세션이 만료되었습니다. 다시 로그인해주세요."
        : reason === "auth_required"
          ? "로그인 후 이용할 수 있는 페이지입니다."
          : null;

    if (!message) return;
    if (handledReasonRef.current === reason) return;

    handledReasonRef.current = reason;

    Alert.alert({
      title: "로그인 후 이용해주세요.",
      message,
    });
    router.replace(`/login?next=${encodeURIComponent(returnPath)}`);
  }, [returnPath, router, searchParams]);

  return (
    <div className="w-full h-screen flex flex-row relative">
      <div className="relative flex-1 hidden lg:block">
        <div className="h-full min-w-[380px] mx-auto lg:max-w-[640px] rounded-md flex flex-col my-auto px-[24px] justify-center">
          <div className="relative w-[320px] self-center aspect-[2/1]">
            <Image
              src={"/logos/pungdeong_logo.png"}
              alt="logo"
              className="object-contain"
              fill
            />
          </div>
        </div>
      </div>
      <div className="relative flex-1">
        <div className="h-full min-w-[380px] mx-auto lg:max-w-[640px] rounded-md flex flex-col my-auto px-[24px] justify-center">
          <div className="relative w-[320px] self-center aspect-[2/1]">
            <Image
              src={"/logos/pungdeong_logo.png"}
              alt="logo"
              className="object-contain"
              fill
            />
          </div>
          <Space h={48} />
          <LoginForm {...loginForm} />
          <Space h={24} />
          <LinkButton
            href="/sign-up"
            className="w-full border-[2px] border-grey-500 text-grey-500 bg-background text-center"
          >
            회원가입
          </LinkButton>
          <Space h={24} />

          <div className="text-[16px] font-normal text-grey-500 text-center flex flex-row justify-between items-center gap-[4px]">
            <p>비밀번호를 잊으셨다면?</p>
            <Link href="/reset-password/email-check">
              <p className="text-[16px] underline font-normal text-grey-500 text-center cursor-pointer">
                비밀번호 재설정
              </p>
            </Link>
          </div>

          <Space h={24} />

          <div className="flex flex-row justify-center items-center py-[4px]">
            <div className="flex-1 border-[0.25px] border-grey-400" />
            <div className="text-[16px] font-normal px-[8px] text-grey-400">
              소셜 로그인
            </div>
            <div className="flex-1 border-[0.25px] border-grey-400" />
          </div>

          <Space h={24} />
          <Button
            className="flex flex-row items-center justify-center gap-[16px] px-[24px] !bg-kakao "
            onClick={() => {
              window.location.href = `/api/auth/kakao/login?redirectURL=${encodeURIComponent(returnPath)}`;
            }}
          >
            <span className="flex size-5 items-center justify-center">
              <KakaoLogo className="size-full" />
            </span>
            <div className="text-[16px] font-semibold text-black ">카카오로 시작하기</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
