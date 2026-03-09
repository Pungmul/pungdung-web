import { PlusIcon } from "@heroicons/react/24/solid";

interface ChatInviteButtonProps {
  onClick: () => void;
}

export const ChatInviteButton = ({ onClick }: ChatInviteButtonProps) => {
  return (
    <button
      className="flex flex-row items-center gap-[12px] py-[8px] px-[16px] hover:bg-grey-200 w-full"
      onClick={onClick}
    >
      <div className="size-[36px] bg-background rounded-full flex items-center justify-center">
        <PlusIcon className="size-[24px] text-blue-500" />
      </div>
      <div className="text-sm font-medium text-blue-500">초대하기</div>
    </button>
  );
};

