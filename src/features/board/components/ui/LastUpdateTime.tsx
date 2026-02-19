import dayjs from "dayjs";

export function LastUpdateTime() {
  const now = dayjs().format("YYYY.MM.DD HH:mm");

  return (
    <div className="text-[11px] text-gray-400">
      <p>마지막 업데이트: {now}</p>
    </div>
  );
}
