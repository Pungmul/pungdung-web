import { DarkModePreferenceSection } from "@/features/my-page";

import { Header, Space } from "@/shared";

export default function DarkModeSettingPage() {
  return (
    <div className="bg-grey-100 h-full w-full">
      <div className="flex flex-col h-full w-full min-w-[360px] max-w-[768px] mx-auto relative bg-background">
        <Header title="다크 모드" isBackBtn={true} />
        <Space h={24} />
        <div className="w-full px-[36px]">
          <div className="p-[16px] bg-grey-200 rounded-[10px]">
            <p className="text-sm font-normal text-grey-600">
              원하는 테마를 선택할 수 있어요.
            </p>
          </div>
        </div>
        <DarkModePreferenceSection />
      </div>
    </div>
  );
}
