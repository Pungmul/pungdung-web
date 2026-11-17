import "@/app/globals.css";

interface SpinnerProps {
  size?: number;
  baseColor?: string;
  highlightColor?: string;
  progress?: number;
}

export function Spinner({
  size = 24,
  baseColor = "#FFFFFF",
  highlightColor = "#D9D9D9",
  progress,
}: SpinnerProps) {
  if (progress !== undefined) {
    const value = Math.max(0, Math.min(progress, 1));
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="none" stroke={baseColor} strokeWidth="4" />
        <circle cx="12" cy="12" r="10" fill="none" stroke={highlightColor} strokeWidth="4" pathLength="1" strokeDasharray={`${value} 1`} transform="rotate(-90 12 12)" />
      </svg>
    );
  }
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
