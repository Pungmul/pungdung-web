export declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }

  module "*.css";

  module "nprogress" {
    interface NProgress {
      start: () => NProgress;
      done: (force?: boolean) => NProgress;
      set: (n: number) => NProgress;
      inc: (amount?: number) => NProgress;
      configure: (options: Partial<NProgressConfigureOptions>) => NProgress;
      status: null | number;
    }

    interface NProgressConfigureOptions {
      minimum: number;
      easing: string;
      speed: number;
      trickle: boolean;
      trickleSpeed: number;
      showSpinner: boolean;
    }

    const nprogress: NProgress;
    export default nprogress;
  }

  module "*.svg" {
    import React from "react";
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
  }
}
