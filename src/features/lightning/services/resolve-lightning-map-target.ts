import type {
  LightningLookup,
  LightningMapTarget,
  LightningMeeting,
} from "../types";

export const createLightningLookup = (
  lightningList: LightningMeeting[]
): LightningLookup => {
  const byId = new Map<number, LightningMeeting>();
  const idToIndex = new Map<number, number>();

  lightningList.forEach((lightning, index) => {
    byId.set(lightning.id, lightning);
    idToIndex.set(lightning.id, index);
  });

  return {
    byId,
    idToIndex,
  };
};

export const resolveLightningMapTargetById = (
  lookup: LightningLookup,
  lightningId: number
): LightningMapTarget | null => {
  const target = lookup.byId.get(lightningId);
  const targetIndex = lookup.idToIndex.get(lightningId);

  if (!target || targetIndex === undefined) return null;

  return {
    id: lightningId,
    index: targetIndex,
    location: {
      latitude: target.latitude,
      longitude: target.longitude,
    },
  };
};

export const getLightningIdAtIndex = (
  lightningList: LightningMeeting[],
  index: number
): number | null => lightningList[index]?.id ?? null;
