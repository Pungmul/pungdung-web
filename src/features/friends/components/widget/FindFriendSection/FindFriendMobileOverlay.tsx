"use client";

import { AnimatePresence, motion, type PanInfo, useAnimate } from "framer-motion";

import type { FindFriendShellProps } from "./types";

/** 모바일: 바텀시트 스타일, 아래로 드래그해 닫기 */
export function FindFriendMobileOverlay({
  isOpen,
  onClose,
  children,
}: FindFriendShellProps) {
  const [container, containerAnimate] = useAnimate<HTMLDivElement>();
  const [backdrop, backdropAnimate] = useAnimate<HTMLDivElement>();

  const resetSheetPosition = () => {
    containerAnimate(
      container.current,
      { y: 0 },
      { duration: 0.25, ease: "easeOut" }
    );
    backdropAnimate(
      backdrop.current,
      { opacity: 1 },
      { duration: 0.25, ease: "easeOut" }
    );
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const shouldClose = info.offset.y > 140 || info.velocity.y > 600;
    if (shouldClose) {
      onClose();
    } else {
      resetSheetPosition();
    }
  };

  return (
    <AnimatePresence mode="sync">
      {isOpen && (
        <motion.div
          key="find-friend-backdrop"
          ref={backdrop}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed inset-0 z-[100] touch-none"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        />
      )}
      {isOpen && (
        <motion.div
          key="find-friend-container"
          ref={container}
          drag="y"
          dragDirectionLock
          dragConstraints={{ top: 0, bottom: 240 }}
          dragElastic={{ top: 0, bottom: 0.2 }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          onDragEnd={handleDragEnd}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className="fixed left-0 right-0 bottom-0 z-[110] flex max-h-[min(94dvh,100%)] flex-col justify-end pointer-events-none"
        >
          <div
            className="pointer-events-auto flex max-h-[min(94dvh,100%)] w-full flex-col rounded-t-[20px] bg-background shadow-[0_-8px_32px_rgba(0,0,0,0.12)] md:max-w-[960px] md:mx-auto pb-[env(safe-area-inset-bottom,0px)]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div
              className="flex shrink-0 flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing"
              aria-hidden
            >
              <div className="h-1 w-10 rounded-full bg-grey-300" />
            </div>
            <div className="min-h-0 flex-1 overflow-hidden px-1 pt-1">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
