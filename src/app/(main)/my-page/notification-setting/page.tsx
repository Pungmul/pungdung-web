import { NotificationToggle } from "@/features/my-page";

import { Header, Space } from "@/shared";

export default function LoginSettingPage() {
  return (
    <div className="bg-grey-100 h-full w-full">
      <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-background">
        <Header title="알림 설정" isBackBtn={true} />
        <Space h={24} />
        <div className="w-full px-[36px]">
          <div className="p-[16px] bg-grey-200 rounded-[10px]">
            <p className="text-sm font-normal text-grey-600">
              알림 설정을 변경할 수 있어요.
            </p>
          </div>
        </div>
        <div className="flex flex-col h-full w-full px-[32px] py-[24px]">
          <div className="px-[24px] py-[16px] bg-grey-100 rounded-[10px]">
            <NotificationToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
