"use client";
import React, { forwardRef, useEffect, useId, useState } from "react";
import ReactDOM from "react-dom";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { cn } from "../../../lib";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  hasHeader?: boolean;
  style?: React.CSSProperties;
  className?: string;
  headerClassName?: string;
  overflow?: "visible" | "hidden" | "auto";
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      children,
      onClose,
      title,
      hasHeader = true,
      style,
      className,
      headerClassName,
      overflow = "auto",
    },
    ref
  ) => {
    const [isClient, setIsClient] = useState(false);
    const titleId = useId();
    const hasTitle = Boolean(title?.trim());
    const labelledBy = hasHeader && hasTitle ? titleId : undefined;
    const dialogLabel = labelledBy ? undefined : (hasTitle ? title : "대화 상자");

    useEffect(() => {
      setIsClient(true);

      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      if (!isOpen) {
        return () => {
          document.body.style.overflow = "";
        };
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, onClose]);

    if (!isClient || !isOpen) return null;

    return ReactDOM.createPortal(
      <div
        className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50"
      >
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
          onClick={onClose}
        />
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelledBy}
          aria-label={dialogLabel}
          className={cn(
            "relative flex flex-col bg-background rounded-md shadow-lg p-4 min-w-80",
            className
          )}
          style={{ ...style }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {hasHeader && (
            <div
              className={`relative flex flex-row justify-center items-center px-4 border-b border-b-grey-100 flex-shrink-0 ${headerClassName}`}
              style={{
                height: "56px",
              }}
            >
              {title ? (
                <div id={titleId} className="font-medium text-xl">
                  {title}
                </div>
              ) : (
                <div className="h-8 w-4"></div>
              )}
              <button
                type="button"
                aria-label="닫기"
                className="right-4 self-center text-center absolute font-semibold text-4xl align-top"
                style={{ lineHeight: "3.5rem" }}
                onClick={onClose}
              >
                <span
                  className="flex size-6 items-center justify-center"
                  aria-hidden
                >
                  <XMarkIcon className="size-full" />
                </span>
              </button>
            </div>
          )}
          <div
            className={`relative flex-grow overflow-y-${overflow} overflow-x-visible`}
          >
            {children}
          </div>
        </div>
      </div>,
      document.body
    );
  }
);

Modal.displayName = "Modal";
export default Modal;
