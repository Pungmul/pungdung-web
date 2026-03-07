import { useQueryClient } from "@tanstack/react-query";

import { Toast } from "@/shared/store";

import { useRejectFriendMutation } from "../../queries";

export default function FriendRejectButton({ friendRequestId }: { friendRequestId: number }) {
  const { mutate: rejectFriend } = useRejectFriendMutation();
  const queryClient = useQueryClient();

  const handleReject = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log(friendRequestId, "friendRequestId");
    rejectFriend(friendRequestId, {
      onSuccess: () => {
        Toast.show({ message: "친구 거절 완료", type: "success" });
        queryClient.invalidateQueries({ queryKey: ["friends"] });
      },
      onError: () => {
        alert("친구 거절 실패");
      },
    });
  };

  return (
    <button
      className="text-xs items-center justify-center flex p-0.5 border border-red-400 rounded-sm text-red-600 hover:bg-red-400 hover:text-white cursor-pointer"
      onClick={handleReject}
    >
      거절
    </button>
  );
}
