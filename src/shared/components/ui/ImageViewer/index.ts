"use client";

import dynamic from "next/dynamic";

export type {
  ImageViewerImages,
  ImageViewerItem,
  ImageViewerProps,
} from "./ImageViewer";

const ImageViewer = dynamic(
  () => import("./ImageViewer").then((mod) => mod.ImageViewer),
  { ssr: false },
);

export { ImageViewer };
