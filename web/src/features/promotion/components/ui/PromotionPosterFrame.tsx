const STATUS_LABEL: Record<string, string> = {
  DRAFT: "작성중",
  OPEN: "모집중",
  CLOSED: "마감",
};

export function PromotionPosterFrame({
  status,
  children,
}: {
  status: string | null | undefined;
  children: React.ReactNode;
}) {
  const label = status ? STATUS_LABEL[status] : undefined;

  return (
    <>
      <div className="absolute inset-0 z-0">{children}</div>
      {status === "CLOSED" ? (
        <div className="pointer-events-none absolute inset-0 z-10 bg-black/70" />
      ) : null}
      {label ? (
        <div className="absolute right-[8px] top-[8px] z-20 rounded-[4px] bg-grey-400 px-[4px] py-[2px] text-[11px] font-normal text-white">
          {label}
        </div>
      ) : null}
    </>
  );
}
