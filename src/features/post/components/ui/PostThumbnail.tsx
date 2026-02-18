"use client"

import { useState } from "react";
import Image from "next/image";

import { ImageObject } from "@/shared/types/image";

export function PostThumbnail({
  imageData,
  priority = false,
}: {
  imageData: ImageObject;
  priority?: boolean;
}) {
    const [isLoading, setLoading] = useState(true);
    const imageUrl = imageData?.fullFilePath ? imageData.fullFilePath.split("?")[0]! : "/default-image.png";

    return (
        <div className="relative size-16 rounded overflow-hidden flex-shrink-0">
            {/* 로딩 스켈레톤 */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-grey-300 animate-pulse w-full h-full" />
            )}

            {/* 실제 이미지 */}
            <Image
                key={imageData.id}
                src={imageUrl}
                fill
                sizes="64px"
                priority={priority}
                alt={imageData.convertedFileName}
                quality={75}
                style={{ objectFit: "cover" }}
                onLoadingComplete={() => setLoading(false)}
            />
        </div>
    );
}





