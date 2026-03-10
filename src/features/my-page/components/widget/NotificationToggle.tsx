"use client";

import { useState } from "react";

import { Toggle } from "@/shared/components/form/Toggle";

export default function NotificationToggle() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-row items-center justify-between">
      <h2 className="text-base font-semibold text-grey-800">알림 설정</h2>
      <Toggle checked={checked} toggle={setChecked} />
    </div>
  );
}


