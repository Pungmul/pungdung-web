"use client";

import { useEffect } from "react";

import type { RefObject } from "react";

type UseMapMoveToLightningIndexRefProps = {
  mapMoveToLightningIndexRef: RefObject<
    ((index: number, speed?: number) => void) | null
  >;
  moveToLightningIndex: (index: number, speed?: number) => void;
};

export const useMapMoveToLightningIndexRef = ({
  mapMoveToLightningIndexRef,
  moveToLightningIndex,
}: UseMapMoveToLightningIndexRefProps) => {
  useEffect(() => {
    mapMoveToLightningIndexRef.current = moveToLightningIndex;

    return () => {
      mapMoveToLightningIndexRef.current = null;
    };
  }, [mapMoveToLightningIndexRef, moveToLightningIndex]);
};
