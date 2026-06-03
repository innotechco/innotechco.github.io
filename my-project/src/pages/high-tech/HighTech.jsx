import IndustryPage from "../industries/components/IndustryPage";
import {industryConfig} from "../industries/data/industryConfig";

function HighTech() {
  return <IndustryPage config={industryConfig.highTech} />;
}

export default HighTech;
