"use client";

import { useRef } from "react";

import { PosterThumbnail } from "./PosterThumbnail";
import type { PromotionProfileProps } from ".";
import { PromotionProfileMeta } from "./PromotionProfileMeta";
import { AddressModal, type AddressModalHandle } from "../../../overlay/AddressModal";

interface PromotionProfileWidgetProps extends PromotionProfileProps {
  onPosterClick: () => void;
}

/**
 * 프로모션 프로필 수직 모드 컴포넌트 (모바일 모드)
 * @param posterUrl - 포스터 URL
 * @param title - 제목
 * @param address - 주소
 * @param startAt - 시작 시간
 * @param onPosterClick - 포스터 클릭 이벤트
 */
export function PromotionProfileVertical({
  posterUrl,
  title,
  address,
  startAt,
  onPosterClick,
}: PromotionProfileWidgetProps) {
  const addressModalRef = useRef<AddressModalHandle>(null);

  return (
    <>
      {address && <AddressModal address={address} modalRef={addressModalRef} />}
      <section className="w-full flex flex-col gap-[12px]">
        <div className="w-full flex flex-col gap-[24px] bg-background px-[28px] py-[16px]">
          <div className="w-full px-[16px]">
            <PosterThumbnail
              posterUrl={posterUrl}
              title={title}
              layout="vertical"
              onClick={onPosterClick}
            />
          </div>
          <div className="w-full flex justify-between flex-col items-start gap-[8px]">
            <div className="line-clamp-2 font-semibold text-[20px] leading-[24px] text-grey-800">
              {title || ""}
            </div>
          </div>
          <PromotionProfileMeta
            variant="vertical"
            address={address}
            startAt={startAt}
            onAddressClick={() => {
              addressModalRef.current?.handleOpen();
            }}
          />
        </div>
      </section>
    </>
  );
}
