"use client";

import Image from "next/image";
import Link from "next/link";

import { Button, LinkButton,Space } from "@/shared";
import { KakaoLogo } from "@/shared/components/Icons";

import { LoginForm } from "@/features/auth/components";
import { useLoginForm } from "@/features/auth/hooks/form";

export default function LoginPage() {
  const loginForm = useLoginForm();

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
              window.location.href = `/api/auth/kakao/login`;
            }}
          >
            <KakaoLogo style={{ width: 20, height: 20 }} />
            <div className="text-[16px] font-semibold text-black ">카카오로 시작하기</div>
          </Button>
        </div>
      </div>
    </div>
  );
}
