import IndustryPage from "../industries/components/IndustryPage";
import {industryConfig} from "../industries/data/industryConfig";

function Automotive() {
  return <IndustryPage config={industryConfig.automotive} />;
}

export default Automotive;
