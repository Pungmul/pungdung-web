import { createWebColorStyleText } from "@pungdung/design-tokens";
import type { Preview } from "@storybook/nextjs-vite";

import "@/app/globals.css";

const colorStyleText = createWebColorStyleText();

const preview: Preview = {
  parameters: {
    layout: "centered",
    a11y: {
      test: "todo",
    },
    viewport: {
      options: {
        mobile: {
          name: "mobile",
          styles: {
            width: "390px",
            height: "844px",
          },
          type: "mobile",
        },
        desktop: {
          name: "desktop",
          styles: {
            width: "1280px",
            height: "800px",
          },
          type: "desktop",
        },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  initialGlobals: {
    viewport: { value: "mobile", isRotated: false },
  },
  decorators: [
    (Story) => (
      <>
        <style id="app-color-tokens">{colorStyleText}</style>
        <div className="bg-background p-4">
          <Story />
        </div>
      </>
    ),
  ],
};

export default preview;
