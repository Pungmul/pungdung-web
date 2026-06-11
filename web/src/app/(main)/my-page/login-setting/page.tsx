import { redirect } from "next/navigation";

import { LoginToggle } from "@/features/my-page";

import { BottomFixedButton, Header, Space } from "@/shared";

export default function LoginSettingPage() {
  async function handleLogout() {
    "use server";
    // 서버 액션 내부에서 redirect 가능
    redirect("/logout");
  }

  return (
    <div className="bg-grey-100 h-full w-full">
      <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-background">
        <Header title="로그인 설정" isBackBtn={true} />
        <form
          action={handleLogout}
          className="flex flex-col h-full w-full flex-grow"
        >
          <Space h={24} />
          <div className="w-full px-[36px]">
            <div className="p-[16px] bg-grey-200 rounded-[10px]">
              <p className="text-sm font-normal text-grey-600">
                로그인 시 자동으로 로그인 상태를 유지할 수 있어요.
              </p>
            </div>
          </div>
          <div className="flex flex-col h-full w-full px-[32px] py-[24px]">
            <div className="px-[24px] py-[16px] bg-grey-100 rounded-[10px]">
              <LoginToggle />
            </div>
          </div>
          <BottomFixedButton type="submit">{"로그아웃"}</BottomFixedButton>
        </form>
      </div>
    </div>
  );
}
