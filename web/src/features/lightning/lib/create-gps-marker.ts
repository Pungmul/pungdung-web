import { LocationType } from "@/features/location";

export const createGPSMarker = ({
  locationPoint,
}: {
  locationPoint: LocationType;
}) => {
  const imageSrc = "/icons/gpsMarker.png";
  const imageSize = new window.kakao.maps.Size(24, 24);
  const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, {
    offset: new window.kakao.maps.Point(16, 16),
  });

  const GPSMarker = new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(
      locationPoint.latitude,
      locationPoint.longitude
    ),
    image: markerImage,
  });

  return {
    marker: GPSMarker,
  };
};
