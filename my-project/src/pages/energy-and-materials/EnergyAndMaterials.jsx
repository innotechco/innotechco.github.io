import IndustryPage from "../industries/components/IndustryPage";
import {industryConfig} from "../industries/data/industryConfig";

function EnergyAndMaterials() {
  return <IndustryPage config={industryConfig.energy} />;
}

export default EnergyAndMaterials;
