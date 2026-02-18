"use client";
import dynamic from "next/dynamic";

/**클라이언트 전용 컴포넌트: SSR 방지 */
const ImageOverlay = dynamic(() => import("./ImageOverlay").then((mod) => mod.ImageOverlay), {
    ssr: false,
});

export { ImageOverlay };