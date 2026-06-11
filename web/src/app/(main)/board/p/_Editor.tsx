"use client";

import dynamic from "next/dynamic";

export const Editor = dynamic(() => import("@/features/post/components/section/Editor").then((mod) => ({
    default: mod.Editor,
})), {
    ssr: false,
});

export const ModifyEditor = dynamic(() => import("@/features/post/components/section/ModifyEditor").then((mod) => ({
    default: mod.ModifyEditor,
})), {
    ssr: false,
});