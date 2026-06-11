import { Cog8ToothIcon } from "@heroicons/react/24/solid";

interface ChatSettingsButtonProps {
  onClick?: () => void;
}

export const ChatSettingsButton = ({ onClick }: ChatSettingsButtonProps) => {
  return (
    <div className="flex flex-row justify-start items-center gap-[16px] p-4 pb-6">
      <button
        type="button"
        className="cursor-pointer flex items-center justify-center"
        onClick={onClick}
        aria-label="채팅방 설정 열기"
      >
        <span className="flex size-7 p-0.5 items-center justify-center">
          <Cog8ToothIcon className="size-full text-grey-500" />
        </span>
      </button>
    </div>
  );
};
