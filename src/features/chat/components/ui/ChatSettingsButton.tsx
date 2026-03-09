import { Cog8ToothIcon } from "@heroicons/react/24/solid";

interface ChatSettingsButtonProps {
  onClick?: () => void;
}

export const ChatSettingsButton = ({ onClick }: ChatSettingsButtonProps) => {
  return (
    <div className="flex flex-row justify-end items-center gap-[16px] py-[8px] px-[16px]">
      <div
        className="cursor-pointer flex items-center justify-center"
        onClick={onClick}
      >
        <Cog8ToothIcon className="size-[24px] text-grey-500" />
      </div>
    </div>
  );
};

