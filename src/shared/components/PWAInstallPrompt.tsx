"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

import { PlusIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";

import { useView } from "@/shared/lib/useView";
import { Button } from "./buttons";

const PWA_PROMPT_HIDE_UNTIL_KEY = "pwa_install_prompt_hide_until";
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches;
}

function detectIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(
      typeof window !== "undefined" &&
      (window as Window & { MSStream?: unknown }).MSStream
    )
  );
}

function shouldHidePrompt(): boolean {
  if (typeof window === "undefined") return false;
  const hideUntil = Number(localStorage.getItem(PWA_PROMPT_HIDE_UNTIL_KEY));
  if (!Number.isFinite(hideUntil)) return false;
  return Date.now() < hideUntil;
}

function hidePromptForOneDay(): void {
  if (typeof window === "undefined") return;
  const hideUntil = Date.now() + ONE_DAY_MS;
  localStorage.setItem(PWA_PROMPT_HIDE_UNTIL_KEY, String(hideUntil));
}

export default function PWAInstallPrompt() {
  const view = useView();
  const dragY = useMotionValue(0);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      if (shouldHidePrompt()) return;
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (shouldHidePrompt()) return;
    const ios = detectIOS();
    setIsIOS(ios);
    if (ios && !isStandalone()) setOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = () => {
      if (isStandalone()) setOpen(false);
    };
    if (isStandalone()) setOpen(false);
    mql.addEventListener("change", handleDisplayModeChange);
    return () => {
      mql.removeEventListener("change", handleDisplayModeChange);
    };
  }, []);

  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setOpen(false);
  }, [deferredPrompt]);

  const handleClose = useCallback(() => {
    hidePromptForOneDay();
    setOpen(false);
    setDeferredPrompt(null);
  }, []);

  if (isStandalone()) return null;
  if (view !== "mobile") return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-x-0 top-4 md:left-[100px] lg:left-[224px] z-50 flex justify-center px-4 min-w-80"
          style={{ y: dragY }}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="y"
          dragConstraints={{ top: -100, bottom: 0 }}
          dragDirectionLock
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y < -15 || info.velocity.y < -250) handleClose();
          }}
        >
          <motion.div
            layout
            className="w-full px-4 py-4 bg-grey-800 bg-opacity-90 rounded-lg shadow-lg flex flex-row justify-between items-center gap-4"
          >
            <div className="flex flex-col gap-3 text-grey-100 text-sm md:text-base">
              <span className="font-medium">앱 설치</span>
              {isIOS ? (
                <span className="text-grey-100/80 text-xs md:text-sm inline-flex flex-wrap items-center gap-0.5">
                  공유 버튼
                  <ArrowUpOnSquareIcon
                    className="size-4 shrink-0 inline-block text-grey-100 text-opacity-80"
                    aria-hidden={true}
                  />
                  을 탭한 후{" "}
                  <span className="font-bold">{"홈 화면에 추가"}</span>
                  <div className="size-4 shrink-0 inline-flex text-grey-100 border border-grey-100 text-opacity-80 rounded-sm items-center justify-center">
                    <PlusIcon
                      className="size-3 shrink-0 inline-block text-grey-100 text-opacity-80"
                      aria-hidden={true}
                    />
                  </div>
                  를 선택하세요
                </span>
              ) : (
                <span className="text-grey-100 text-opacity-80 text-xs md:text-sm">
                  홈 화면에 추가하여 빠르게 접속하세요
                </span>
              )}
            </div>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg py-1 px-2 h-fit text-sm text-grey-300"
              >
                닫기
              </button>
              {!isIOS && (
                <Button
                  onClick={handleInstallClick}
                  className="w-auto h-fit px-2 py-1 text-sm shrink-0"
                >
                  설치
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
