"use client";

import type { ReactNode } from "react";

interface QuestionOptionFieldRowProps {
  marker: ReactNode;
  field: ReactNode;
  trailing?: ReactNode;
}

export function QuestionOptionFieldRow({
  marker,
  field,
  trailing,
}: QuestionOptionFieldRowProps) {
  return (
    <div className="flex items-center gap-2">
      {marker}
      {field}
      {trailing}
    </div>
  );
}
