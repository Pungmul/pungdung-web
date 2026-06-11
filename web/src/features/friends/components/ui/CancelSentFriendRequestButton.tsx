type CancelSentFriendRequestButtonProps = {
  onCancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

/** 보낸 대기 요청 취소 — API는 부모 훅에서 연결 */
export default function CancelSentFriendRequestButton({
  onCancel,
  disabled,
}: CancelSentFriendRequestButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="shrink-0 rounded-lg border border-grey-200 px-4 py-2 text-center text-xs font-medium text-grey-600 hover:bg-grey-100 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(e) => {
        e.stopPropagation();
        onCancel(e);
      }}
    >
      요청 취소
    </button>
  );
}
