import { InterceptedLightningBuildOverlay } from "./_InterceptedLightningBuildOverlay";
import { LightningBuildPage } from "../../build/_BuildPage";
import LightningBuildAccessGate from "../../build/_LightningBuildAccessGate";

/** 데스크톱 소프트 네비: 지도 위 모달 / 모바일·웹뷰: 전체 화면 오버레이 */
export default function InterceptedLightningBuildPage() {
  return (
    <InterceptedLightningBuildOverlay>
      <LightningBuildAccessGate>
        <LightningBuildPage />
      </LightningBuildAccessGate>
    </InterceptedLightningBuildOverlay>
  );
}
