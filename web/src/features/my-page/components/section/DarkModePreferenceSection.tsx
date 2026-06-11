"use client";

import { useThemePreference } from "@/shared";
import type { ThemePreference } from "@/shared/lib/theme-preference";

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "라이트" },
  { value: "dark", label: "다크" },
  { value: "system", label: "기기 설정 (기본값)" },
];

export function DarkModePreferenceSection() {
  const { preference, effectiveTheme, setPreference } = useThemePreference();

  return (
    <section className="w-full px-[32px] py-[24px]">
      <div className="rounded-[10px] bg-grey-100 px-[24px] py-[16px]">
        <p className="text-[16px] font-semibold text-grey-800">테마</p>
        <p className="mt-[4px] text-[14px] font-normal text-grey-600">
          현재 적용: {effectiveTheme === "dark" ? "다크" : "라이트"}
        </p>

        <div className="mt-[16px] flex flex-col gap-[8px]" role="radiogroup">
          {THEME_OPTIONS.map((option) => {
            const isSelected = preference === option.value;

            return (
              <button
                type="button"
                key={option.value}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setPreference(option.value)}
                className="flex items-center justify-between rounded-[8px] border border-grey-300 bg-background px-[12px] py-[10px] text-left"
              >
                <span className="text-[14px] font-medium text-grey-700">
                  {option.label}
                </span>
                <span
                  className={`h-[18px] w-[18px] rounded-full border ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-grey-400 bg-background"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
