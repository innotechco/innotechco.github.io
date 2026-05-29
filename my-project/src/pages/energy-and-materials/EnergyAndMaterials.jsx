import EnergyAndMaterialsection from "./sections/EnergyAndMaterialPicCard";
import Acceleration from "./sections/Acceleration";
import OurEcosystem from "./sections/OurEcosystem";
import OurCapabilities from "./sections/OurCapabilities";
import LiveEnergyInsights from "./sections/LiveEnergyInsights";

function EnergyAndMaterials() {
  return (
    <>
      <EnergyAndMaterialsection />
      <Acceleration />
      <OurCapabilities />
      <LiveEnergyInsights />
      <OurEcosystem />
    </>
  );
}

export default EnergyAndMaterials;
