"use client";

import { useState } from "react";

import { Toggle } from "@/shared/components/form/Toggle";

export default function LoginToggle() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-row items-center justify-between">
      <h2 className="text-base font-semibold text-grey-800">자동 로그인</h2>
      <Toggle checked={checked} toggle={setChecked} />
    </div>
  );
}


