import "@/app/globals.css";

interface SpinnerProps {
  size?: number;
  baseColor?: string;
  highlightColor?: string;
}

export function Spinner({
  size = 24,
  baseColor = "#FFFFFF",
  highlightColor = "#D9D9D9",
}: SpinnerProps) {
  return (
    <div
      className="animate-spin rounded-full border-4 aspect-square"
      style={{
        height: `${size}px`,
        borderColor: baseColor,
        borderTopColor: highlightColor,
      }}
    />
  );
}
