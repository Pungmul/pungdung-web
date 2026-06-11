"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  toggle: (checked: boolean) => void;
}

export function Toggle({ checked, toggle }: ToggleProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      {/* 실제 토글 상태 */}
      <input
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={() => toggle(!checked)}
        className="sr-only peer"
      />

      {/* 배경 */}
      <motion.div
        animate={{
          backgroundColor: checked ? "var(--color-primary)" : "var(--color-grey-200)",
          borderColor: checked ? "var(--color-primary-light)" : "var(--color-grey-300)",
        }}
        transition={{ duration: 0.2 }}
        className="w-16 h-8 rounded-full border-2"
      />

      {/* 슬라이더 */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="absolute left-1 top-1 size-6 bg-white rounded-full shadow-md"
        animate={{
          x: checked ? 32 : 0,
        }}
      />
    </label>
  );
}
