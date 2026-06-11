type FriendMessageButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  /** 기본 `메시지` — 로딩 문구는 부모에서 넘긴다 */
  label?: string;
};

/** 친구 목록용 얇은 직사각형 메시지 버튼 (라벨·스타일만 담당) */
export default function FriendMessageButton({
  onClick,
  disabled,
  label = "메시지",
}: FriendMessageButtonProps) {
  const isBusy = Boolean(disabled);
  return (
    <button
      type="button"
      disabled={disabled}
      aria-busy={isBusy}
      className="shrink-0 rounded-md bg-grey-200 px-2.5 py-1.5 text-center text-[12px] font-medium leading-tight tracking-tight text-grey-700 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      {label}
    </button>
  );
}
