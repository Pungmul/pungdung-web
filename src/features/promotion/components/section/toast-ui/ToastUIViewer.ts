import {
  ComponentProps,
  createElement,
  forwardRef,
  useLayoutEffect,
  useState,
} from "react";

import { Viewer } from "@toast-ui/react-editor";

import "@toast-ui/editor/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

type Theme = "light" | "dark";
type ToastViewerProps = ComponentProps<typeof Viewer>;

export const ToastUIViewer = forwardRef<Viewer, ToastViewerProps>(
  (props, ref) => {
    const [theme, setTheme] = useState<Theme>("light");

    useLayoutEffect(() => {
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      setTheme(darkMediaQuery.matches ? "dark" : "light");

      const handler = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? "dark" : "light");
      };
      darkMediaQuery.addEventListener("change", handler);

      return () => darkMediaQuery.removeEventListener("change", handler);
    }, []);

    return createElement(Viewer, {
      ...props,
      ref,
      theme,
      key: theme,
    });
  }
);

ToastUIViewer.displayName = "ToastUIViewer";
