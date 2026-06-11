import type { LightningParticipationBadgeStatus } from "../../../lib/get-lightning-participation-time-display";

type ParticipationStatusTagProps = {
  statusLabel: LightningParticipationBadgeStatus;
};

export function ParticipationStatusTag({
  statusLabel,
}: ParticipationStatusTagProps) {
  return (
    <span className="shrink-0 rounded-[4px] bg-primary p-[4px] text-[10px] font-bold tracking-[0.5px] text-background">
      {statusLabel}
    </span>
  );
}
