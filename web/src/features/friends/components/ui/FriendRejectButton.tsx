type FriendRejectButtonProps = {
  onReject: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export default function FriendRejectButton({
  onReject,
  disabled,
}: FriendRejectButtonProps) {
  return (
    <button
      type="button"
      aria-label="친구 요청 거절"
      disabled={disabled}
      className="shrink-0 rounded-lg border border-grey-200 bg-grey-100 px-4 py-2 text-center text-xs font-medium text-grey-600 shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(e) => {
        e.stopPropagation();
        onReject(e);
      }}
    >
      거절
    </button>
  );
}
