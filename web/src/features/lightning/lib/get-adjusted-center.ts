import { LightningBottomSheetRefType } from "../types";

export const getAdjustedCenter = (
  map: kakao.maps.Map,
  center: kakao.maps.LatLng,
  bottomSheetRef: LightningBottomSheetRefType
): kakao.maps.LatLng => {
  const bottomSheetHeight = bottomSheetRef
    ? Math.max(bottomSheetRef.getLevel(), 0)
    : 0;
  const proj = map.getProjection();
  const point = proj.containerPointFromCoords(center);
  const newPoint = new window.kakao.maps.Point(
    point.x,
    point.y + bottomSheetHeight / 2
  );
  const newCenter = proj.coordsFromContainerPoint(newPoint);
  return newCenter;
};
