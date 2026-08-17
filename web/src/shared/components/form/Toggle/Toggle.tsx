"use client";

import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  toggle: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
}

export function Toggle({ checked, toggle, label, disabled = false }: ToggleProps) {
  return (
    <label className={`relative inline-flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        role="switch"
        aria-label={label}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        checked={checked}
        disabled={disabled}
        onChange={() => {
          if (disabled) return;
          toggle(!checked);
        }}
        className="sr-only peer"
      />

      <motion.div
        animate={{
          backgroundColor: checked ? "var(--color-primary)" : "var(--color-grey-200)",
          borderColor: checked ? "var(--color-primary-light)" : "var(--color-grey-300)",
        }}
        transition={{ duration: 0.2 }}
        className="w-16 h-8 rounded-full border-2"
        aria-hidden
      />

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
        aria-hidden
      />
    </label>
  );
}
