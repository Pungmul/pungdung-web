type LightningParticipantMessageButtonProps = {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  label?: string;
};

export function LightningParticipantMessageButton({
  onClick,
  disabled,
  label = "메시지",
}: LightningParticipantMessageButtonProps) {
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
