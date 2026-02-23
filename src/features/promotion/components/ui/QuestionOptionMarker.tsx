"use client";

export type QuestionOptionMarkerVariant = "radio" | "checkbox";

interface QuestionOptionMarkerProps {
  variant: QuestionOptionMarkerVariant;
}

export function QuestionOptionMarker({ variant }: QuestionOptionMarkerProps) {
  if (variant === "radio") {
    return <div className="w-4 h-4 shrink-0 border-2 border-grey-400 rounded-full" />;
  }
  return <div className="w-4 h-4 shrink-0 border-2 border-grey-400 rounded" />;
}
