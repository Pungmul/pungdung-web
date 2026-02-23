"use client";

export type OptionsQuestionPreviewMarkerVariant = "radio" | "checkbox";

interface OptionsQuestionPreviewProps {
  options: Array<{ label: string }>;
  markerVariant: OptionsQuestionPreviewMarkerVariant;
}

export function OptionsQuestionPreview({
  options,
  markerVariant,
}: OptionsQuestionPreviewProps) {
  return (
    <div className="space-y-[8px] px-[8px] flex flex-col gap-[4px]">
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-[8px]">
          {markerVariant === "radio" ? (
            <div className="w-4 h-4 border-2 border-grey-400 rounded-full" />
          ) : (
            <div className="w-4 h-4 border-2 border-grey-400 rounded" />
          )}
          <span className="text-[14px] text-grey-700">
            {option.label || `선택지 ${index + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
}
