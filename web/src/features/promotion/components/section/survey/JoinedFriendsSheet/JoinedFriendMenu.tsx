"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

import { cn } from "@/shared";

type JoinedFriendMenuItem = {
  label: string;
  handler: () => void;
  className?: string;
};

interface JoinedFriendMenuProps {
  items: JoinedFriendMenuItem[];
}

interface MenuPosition {
  left: number;
  top: number;
  maxHeight: number;
}

const VIEWPORT_GUTTER_PX = 8;
const MENU_GAP_PX = 4;

export function JoinedFriendMenu({ items }: JoinedFriendMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const menuItemRefs = useRef<HTMLButtonElement[]>([]);
  const menuId = useId();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;

    if (!trigger || !menu) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const availableBelow = Math.max(
      0,
      window.innerHeight - triggerRect.bottom - MENU_GAP_PX - VIEWPORT_GUTTER_PX
    );
    const availableAbove = Math.max(
      0,
      triggerRect.top - MENU_GAP_PX - VIEWPORT_GUTTER_PX
    );
    const opensBelow =
      availableBelow >= menuRect.height || availableBelow >= availableAbove;
    const maxHeight = opensBelow ? availableBelow : availableAbove;
    const top = opensBelow
      ? triggerRect.bottom + MENU_GAP_PX
      : triggerRect.top - Math.min(menuRect.height, maxHeight) - MENU_GAP_PX;

    setPosition({
      left: Math.min(
        Math.max(VIEWPORT_GUTTER_PX, triggerRect.right - menuRect.width),
        window.innerWidth - menuRect.width - VIEWPORT_GUTTER_PX
      ),
      top: Math.min(
        Math.max(VIEWPORT_GUTTER_PX, top),
        window.innerHeight - menuRect.height - VIEWPORT_GUTTER_PX
      ),
      maxHeight,
    });
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (isOpen) {
      menuItemRefs.current[0]?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, updatePosition]);

  const handleMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLUListElement>
  ) => {
    const menuItems = menuItemRefs.current.filter(Boolean);
    const currentIndex = menuItems.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    const nextIndexByKey: Record<string, number> = {
      ArrowDown: (currentIndex + 1) % menuItems.length,
      ArrowUp: (currentIndex - 1 + menuItems.length) % menuItems.length,
      End: menuItems.length - 1,
      Home: 0,
    };
    const nextIndex = nextIndexByKey[event.key];

    if (nextIndex !== undefined) {
      event.preventDefault();
      menuItems[nextIndex]?.focus();
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="flex shrink-0 cursor-pointer items-center justify-center rounded p-0.5 text-grey-600 hover:bg-grey-100"
        aria-controls={isOpen ? menuId : undefined}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="친구 메뉴"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen((previous) => !previous);
        }}
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          <EllipsisHorizontalIcon className="size-full" aria-hidden />
        </span>
      </button>
      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            id={menuId}
            role="menu"
            style={position ?? { left: 0, top: 0 }}
            className={cn(
              "fixed z-[60] flex max-h-[calc(100dvh-16px)] min-w-[6.5rem] flex-col gap-2 overflow-y-auto rounded-sm border border-grey-300 bg-background px-3 py-2 shadow-sm",
              position ? "visible" : "invisible"
            )}
            onKeyDown={handleMenuKeyDown}
          >
            {items.map((item, index) => (
              <li role="none" key={item.label}>
                <button
                  ref={(element) => {
                    if (element) {
                      menuItemRefs.current[index] = element;
                    }
                  }}
                  type="button"
                  role="menuitem"
                  className={cn(
                    "w-full text-right text-sm text-grey-800",
                    item.className
                  )}
                  onClick={() => {
                    item.handler();
                    setIsOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )}
    </>
  );
}
