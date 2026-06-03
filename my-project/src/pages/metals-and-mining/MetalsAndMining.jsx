import IndustryPage from "../industries/components/IndustryPage";
import {industryConfig} from "../industries/data/industryConfig";

function MetalsAndMining() {
  return <IndustryPage config={industryConfig.metals} />;
}

export default MetalsAndMining;
