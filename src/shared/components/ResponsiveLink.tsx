"use client";

import { CSSProperties } from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

import { useView } from "@/shared/lib/view/view-store-provider";

interface CustomLinkProps extends LinkProps {
  className?: string;
  draggable?: boolean;
  children: React.ReactNode;
  style?: CSSProperties;
}

function resolveHrefForBridge(href: LinkProps["href"]): string {
  if (typeof href === "string") {
    return href;
  }
  const pathname = href.pathname ?? "";
  const search =
    typeof href.search === "string"
      ? href.search
      : "";
  return `${pathname}${search}`;
}

export const WebViewLink: React.FC<CustomLinkProps> = ({
  href,
  className,
  children,
  style,
  prefetch = false,
  onMouseEnter,
  onTouchStart,
  ...props
}) => {
  const view = useView();
  const router = useRouter();
  const { draggable = false, ...linkRest } = props;

  const resolvedHref = resolveHrefForBridge(href);
  const prefetchOnIntent = () => {
    void router.prefetch(resolvedHref);
  };

  if (view === "webview") {
    const handleClick = () => {
      const bridge =
        typeof window !== "undefined" ? window.ReactNativeWebView : undefined;
      if (bridge?.postMessage) {
        bridge.postMessage(
          JSON.stringify({
            action: "push",
            href: resolvedHref,
          })
        );
        return;
      }
      router.push(resolvedHref);
    };

    return (
      <div
        role="link"
        tabIndex={0}
        className={[className, "cursor-pointer"].filter(Boolean).join(" ")}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        draggable={draggable}
        style={style}
      >
        {children}
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={className}
      style={style}
      draggable={draggable}
      onMouseEnter={(e) => {
        prefetchOnIntent();
        onMouseEnter?.(e);
      }}
      onTouchStart={(e) => {
        prefetchOnIntent();
        onTouchStart?.(e);
      }}
      {...linkRest}
    >
      {children}
    </Link>
  );
};
