"use client";

import { useImperativeHandle, useState } from "react";

import { Modal } from "@/shared";
import type { Address } from "@/shared/types";

import { getAddressMapTitle } from "../../lib";

/** 카카오 맵 줌 레벨  1 ~ 8 클 수록 축소*/
const KAKAO_MAP_ZOOM_LEVEL = 1;

/** 네이버 맵 줌 레벨  4 ~ 20 클 수록 확대*/
const NAVER_MAP_ZOOM_LEVEL = 18;

interface AddressModalProps {
  address?: Address;
  modalRef: React.RefObject<AddressModalHandle | null>;
}

export interface AddressModalHandle {
  handleClose: () => void;
  handleOpen: () => void;
}

export function AddressModal({ address, modalRef }: AddressModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
  };

  useImperativeHandle(modalRef, () => ({
    handleClose,
    handleOpen,
  }));

  const mapTitle = getAddressMapTitle(address);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} hasHeader={false}>
      <div className="flex flex-col gap-[12px] px-[12px] py-[8px]">
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://map.naver.com/p?title=${encodeURIComponent(
            mapTitle
          )}&lng=${address?.longitude}&lat=${address?.latitude}&zoom=${NAVER_MAP_ZOOM_LEVEL}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-white text-[16px] text-center font-semibold bg-[#2db400] rounded-[8px] p-[8px]"
          aria-label="네이버 지도에서 위치 보기"
        >
          네이버 지도로 보기
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`https://map.kakao.com/link/map/${mapTitle},${address?.latitude},${address?.longitude},${KAKAO_MAP_ZOOM_LEVEL}`}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="text-grey-800 text-[16px] text-center font-semibold bg-[#FEE500] rounded-[8px] p-[8px]"
          aria-label="카카오 지도에서 위치 보기"
        >
          카카오 지도로 보기
        </a>
      </div>
    </Modal>
  );
}
