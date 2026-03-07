
import { useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared/store";

import { useAcceptFriendMutation } from "../../queries";

export default function FriendAcceptButton({ friendRequestId }: { friendRequestId: number }) {
  const { mutate: acceptFriend } = useAcceptFriendMutation();
  const queryClient = useQueryClient();

  const handleAccept = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(friendRequestId, "friendRequestId");
    acceptFriend(friendRequestId, {
      onSuccess: () => {
        Toast.show({ message: "친구 수락 완료", type: "success" });
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      },
      onError: () => {
        alert("친구 수락 실패");
      },
    });
  };

  return (
    <button
      className="text-xs items-center justify-center flex p-0.5 border border-blue-400 rounded-sm text-blue-600 hover:bg-blue-400 hover:text-white cursor-pointer"
      onClick={handleAccept}
    >
      수락
    </button>
  );
}
