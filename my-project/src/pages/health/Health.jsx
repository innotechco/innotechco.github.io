import IndustryPage from "../industries/components/IndustryPage";
import {industryConfig} from "../industries/data/industryConfig";

function Health() {
  return <IndustryPage config={industryConfig.health} />;
}

export default Health;
