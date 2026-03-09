"use client";
import React, { useState } from "react";
import Image from "next/image";

import { ImageModal } from "@/shared/components/ui";

interface ImageMessageProps {
  imageList: string[];
  sideContent?: string | React.ReactNode;
  isUser: boolean;
  userImageUrl: string | null;
  senderUsername: string;
  isProfileRevealed: boolean;
}

const ImageMessageComponent: React.FC<ImageMessageProps> = ({
  imageList,
  sideContent,
  isUser,
  userImageUrl,
  senderUsername,
  isProfileRevealed,
}: ImageMessageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="px-[12px] flex flex-col gap-[4px] flex-grow">
      {!isUser && isProfileRevealed && (
        <p className="text-[10px] ml-[44px] lg:text-[13px] font-light text-grey-500">
          {senderUsername}
        </p>
      )}
      <div
        className={
          "flex items-end flex-wrap columns-3 gap-2" +
          (isUser ? " flex-row-reverse" : " flex-row")
        }
      >
        {!isUser &&
          (isProfileRevealed ? (
            <div className="size-[32px] bg-grey-100 rounded-full overflow-hidden relative">
              {userImageUrl ? (
                <Image src={userImageUrl} alt="user" fill loading="lazy" />
              ) : (
                <div className="size-[32px] bg-grey-200 rounded-full overflow-hidden" />
              )}
            </div>
          ) : (
            <div className="size-[32px]" />
          ))}
        <div className="flex flex-row flex-wrap columns-3 gap-2">
          {imageList.map((imageUrl, index) => (
            <Image
              key={imageUrl}
              src={imageUrl}
              alt="image"
              height={128}
              width={128}
              className="object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(index)}
            />
          ))}
        </div>
        {sideContent && <>{sideContent}</>}
      </div>
      <ImageModal
        isOpen={isModalOpen}
        images={imageList}
        initialIndex={selectedImageIndex}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export const ImageMessage = React.memo(ImageMessageComponent);
