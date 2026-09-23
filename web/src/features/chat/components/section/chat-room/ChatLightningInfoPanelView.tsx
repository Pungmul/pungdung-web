import {
  type ChatLightningPanelPhase,
  chatLightningPanelStatusLabel,
} from "../../../lib/chat-room/chat-lightning-panel-display";

type ChatLightningInfoPanelViewProps = {
  phase: ChatLightningPanelPhase;
  title: string;
  location: string;
  timeLabel: string;
};

export function ChatLightningInfoPanelView({
  phase,
  title,
  location,
  timeLabel,
}: ChatLightningInfoPanelViewProps) {
  const statusLabel = chatLightningPanelStatusLabel(phase);

  return (
    <section className="flex shrink-0 flex-col gap-3 border-b border-grey-100 bg-background px-5 py-4">
      <div className="flex min-w-0 flex-col gap-1">
        <p
          className={`text-[12px] leading-[14px] ${phase === "past" ? "text-grey-400" : "text-primary"}`}
        >
          {statusLabel}
        </p>
        <p className="min-w-0 truncate text-[14px] font-semibold leading-[16px]">
          {title}
        </p>
      </div>
      <div className="flex min-w-0 flex-col gap-1 text-[11px] text-grey-400">
        {location ? (
          <p className="min-w-0 truncate leading-[12px]">{location}</p>
        ) : null}
        <p className="leading-[12px]">{timeLabel}</p>
      </div>
    </section>
  );
}
