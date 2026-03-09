import { Button } from "@/shared";

interface ChatExitButtonProps {
  onClick: () => void;
}

export const ChatExitButton = ({ onClick }: ChatExitButtonProps) => {
  return (
    <div className="px-3">
      <Button
        className="bg-red-500 text-background"
        onClick={onClick}
      >
        채팅방 나가기
      </Button>
    </div>
  );
};
