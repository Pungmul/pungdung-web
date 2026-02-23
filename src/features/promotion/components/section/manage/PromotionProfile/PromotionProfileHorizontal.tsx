"use client";

import { useRef } from "react";

import { PosterThumbnail } from "./PosterThumbnail";
import type { PromotionProfileProps } from ".";
import { PromotionProfileMeta } from "./PromotionProfileMeta";
import { AddressModal, type AddressModalHandle } from "../../../overlay/AddressModal";

interface PromotionProfileCardProps extends PromotionProfileProps {
  onPosterClick: () => void;
}

/**
 * 프로모션 프로필 수평 모드 컴포넌트 (데스크탑/태블릿 모드)
 * @param posterUrl - 포스터 URL
 * @param title - 제목
 * @param address - 주소
 * @param startAt - 시작 시간
 * @param onPosterClick - 포스터 클릭 이벤트
 */
export function PromotionProfileHorizontal({
  posterUrl,
  title,
  address,
  startAt,
  onPosterClick,
}: PromotionProfileCardProps) {
  const addressModalRef = useRef<AddressModalHandle>(null);

  return (
    <>
      {address && <AddressModal address={address} modalRef={addressModalRef} />}
      <div className="w-full flex flex-row gap-[12px] lg:gap-[24px] bg-background px-[24px] py-[16px]">
        <div className="h-[168px] lg:h-[330px] shrink-0">
          <PosterThumbnail
            posterUrl={posterUrl}
            title={title}
            layout="horizontal"
            onClick={onPosterClick}
          />
        </div>
        <div className="flex-grow w-full flex flex-col items-start justify-end py-[12px] gap-[12px]">
          <div className="line-clamp-2 font-semibold text-[16px] lg:text-[23px] leading-[24px] text-grey-800">
            {title}
          </div>
          <div className="w-full border-t border-grey-200" />
          <PromotionProfileMeta
            variant="horizontal"
            address={address}
            startAt={startAt}
            onAddressClick={() => {
              addressModalRef.current?.handleOpen();
            }}
          />
        </div>
      </div>
    </>
  );
}
