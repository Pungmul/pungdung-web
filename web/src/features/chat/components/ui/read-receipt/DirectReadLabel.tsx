"use client";

import { motion } from "framer-motion";

type DirectReadLabelProps = {
  visible: boolean;
};

/** 1:1 채팅 읽음 라벨. 고정 높이 슬롯 + transform 애니메이션으로 reflow를 막는다. */
export function DirectReadLabel({ visible }: DirectReadLabelProps) {
  return (
    <div
      className="flex h-4 min-w-[1.75rem] shrink-0 items-center self-start leading-4"
      aria-hidden={!visible}
    >
      {visible ? (
        <motion.span
          className="inline-block origin-bottom-left leading-4 text-[10px] lg:text-[11px] text-grey-400"
          initial={{
            scale: 1,
            opacity: 1,
            color: "var(--color-grey-400)",
            fontWeight: 400,
          }}
          animate={{
            scale: [1, 1.2, 1.2, 1],
            color: [
              "var(--color-grey-400)",
              "var(--color-primary)",
              "var(--color-primary)",
              "var(--color-grey-400)",
            ],
            fontWeight: [400, 600, 600, 400],
          }}
          transition={{
            duration: 0.5,
            times: [0, 0.2, 0.5, 1],
            ease: "easeInOut",
          }}
        >
          읽음
        </motion.span>
      ) : null}
    </div>
  );
}
