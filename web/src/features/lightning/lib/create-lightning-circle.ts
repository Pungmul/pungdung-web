import { LocationType } from "@/features/location";

export const createLightningCircle = ({
  locationPoint,
  radius = 500,
  strokeColor = "#FED421",
  fillColor = "#FED421",
  onClick,
}: {
  locationPoint: LocationType;
  radius?: number;
  strokeColor?: string;
  fillColor?: string;
  onClick?: () => void;
}) => {
  const imageSrc = "/icons/Thunder-color.png";
  const imageSize = new window.kakao.maps.Size(32, 32);
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, {
    offset: new window.kakao.maps.Point(16, 16),
  });

  const centerLightningMarker = new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(
      locationPoint.latitude,
      locationPoint.longitude
    ),
    image: markerImage,
  });

  const circle = new window.kakao.maps.Circle({
    center: new window.kakao.maps.LatLng(
      locationPoint.latitude,
      locationPoint.longitude
    ),
    radius,
    strokeColor,
    fillColor,
    strokeWeight: 1,
    fillOpacity: 0.2,
  });

  const mouseoverOption = {
    fillColor, // 채우기 색깔입니다
    fillOpacity: 0.4,
  };

  // 다각형에 마우스아웃 이벤트가 발생했을 때 변경할 채우기 옵션입니다
  const mouseoutOption = {
    fillColor, // 채우기 색깔입니다
    fillOpacity: 0.2,
  };

  // 다각형에 마우스오버 이벤트를 등록합니다
  window.kakao.maps.event.addListener(circle, "mouseover", () => {
    // 다각형의 채우기 옵션을 변경합니다
    circle.setOptions(mouseoverOption);
  });

  window.kakao.maps.event.addListener(circle, "mouseout", () => {
    // 다각형의 채우기 옵션을 변경합니다
    circle.setOptions(mouseoutOption);
  });

  window.kakao.maps.event.addListener(circle, "click", () => {
    onClick?.();
  });

  window.kakao.maps.event.addListener(centerLightningMarker, "click", () => {
    onClick?.();
  });

  return {
    marker: centerLightningMarker,
    circle,
  }
};
