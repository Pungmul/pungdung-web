import {
  type ComponentProps,
  createElement,
  forwardRef,
  useLayoutEffect,
  useState,
} from "react";

import type { Editor as EditorType } from "@toast-ui/react-editor";
import { Editor } from "@toast-ui/react-editor";

import "@toast-ui/editor/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";

type Theme = "light" | "dark";
type ToastEditorProps = ComponentProps<typeof Editor>;

export const ToastUIEditor = forwardRef<EditorType, ToastEditorProps>(
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

    return createElement(Editor, {
      ...props,
      ref,
      theme,
      key: theme,
    });
  }
);

ToastUIEditor.displayName = "ToastUIEditor";
