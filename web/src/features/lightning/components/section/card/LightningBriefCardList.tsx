import { SwiperSlide } from "swiper/react";

import { NearLightningType } from "../../../types";
import { AddLightningCard, NearLightningCard } from "../../ui";

const LIGHTNING_BRIEF_CARD_HEIGHT = 164;
const LIGHTNING_BRIEF_CARD_WIDTH = 342;

interface LightningBriefCardListProps {
  lightningList: NearLightningType[];
}

export function LightningBriefCardList({
  lightningList,
}: LightningBriefCardListProps) {
  return (
    <>
      {lightningList.length === 0 ? (
        <SwiperSlide
          style={{
            width: "calc(100% - 48px)",
            maxWidth: LIGHTNING_BRIEF_CARD_WIDTH,
            height: LIGHTNING_BRIEF_CARD_HEIGHT,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-lg font-semibold">번개가 없습니다.</div>
          </div>
        </SwiperSlide>
      ) : (
        [...lightningList].map((lightningMeeting) => (
          <SwiperSlide
            key={"lightning-card-" + lightningMeeting?.lightningMeeting?.id}
            style={{
              width: "calc(100% - 48px)",
              maxWidth: LIGHTNING_BRIEF_CARD_WIDTH,
              height: LIGHTNING_BRIEF_CARD_HEIGHT,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={async () => { }}
          >
            <NearLightningCard {...lightningMeeting} />
          </SwiperSlide>
        ))
      )}
      <SwiperSlide
        style={{
          width: "calc(100% - 48px)",
          maxWidth: LIGHTNING_BRIEF_CARD_WIDTH,
          height: LIGHTNING_BRIEF_CARD_HEIGHT,
        }}
      >
        <AddLightningCard />
      </SwiperSlide>
    </>
  );
}
