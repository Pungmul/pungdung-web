import { LightningBuildPage } from "./_BuildPage";
import LightningBuildAccessGate from "./_LightningBuildAccessGate";

export default function LightningBuildRoutePage() {
  return (
    <LightningBuildAccessGate>
      <LightningBuildPage />
    </LightningBuildAccessGate>
  );
}
