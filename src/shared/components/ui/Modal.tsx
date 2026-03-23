"use client";
import React, { forwardRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { XMarkIcon } from "@heroicons/react/24/outline";

import { cn } from "../../lib";

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

    useEffect(() => {
      // 클라이언트 측에서만 document 사용 가능
      setIsClient(true);

      // 모달이 열리면 body 스크롤을 잠그고, 모달이 닫히면 해제
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      // 컴포넌트가 언마운트되거나 모달이 닫힐 때 스크롤 잠금을 해제
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    if (!isClient || !isOpen) return null; // 서버에서는 렌더링하지 않음

    // Create a portal for the modal to render in the top-level DOM
    return ReactDOM.createPortal(
      <div
        ref={ref}
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
                <div className="font-medium text-xl">{title}</div>
              ) : (
                <div className="h-8 w-4"></div>
              )}
              <div
                className="right-4 self-center text-center absolute font-semibold text-4xl align-top cursor-pointer"
                style={{ lineHeight: "3.5rem" }}
                onClick={onClose}
                title={title ? title + " 닫기" : "닫기"}
              >
                <span className="flex size-6 items-center justify-center">
                  <XMarkIcon className="size-full" />
                </span>
              </div>
            </div>
          )}
          <div
            className={`relative flex-grow overflow-y-${overflow} overflow-x-visible`}
          >
            {children}
          </div>
        </div>
      </div>,
      document.body // 클라이언트에서만 `document`를 사용할 수 있음
    );
  }
);

Modal.displayName = "Modal";
export default Modal;
