type FriendAcceptButtonProps = {
  onAccept: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export default function FriendAcceptButton({
  onAccept,
  disabled,
}: FriendAcceptButtonProps) {
  return (
    <button
      type="button"
      aria-label="친구 요청 수락"
      disabled={disabled}
      className="shrink-0 rounded-lg border border-grey-200 bg-primary px-4 py-2 text-center text-xs font-medium text-white shadow-sm hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(e) => {
        e.stopPropagation();
        onAccept(e);
      }}
    >
      수락
    </button>
  );
}
