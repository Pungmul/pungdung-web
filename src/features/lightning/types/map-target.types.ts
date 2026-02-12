import type { GeoCoordinates } from "./geo.types";
import type { LightningMeeting } from "./meeting.types";

export type LightningLookup = {
  byId: Map<number, LightningMeeting>;
  idToIndex: Map<number, number>;
};

export type LightningMapTarget = {
  id: number;
  index: number;
  location: GeoCoordinates;
};
