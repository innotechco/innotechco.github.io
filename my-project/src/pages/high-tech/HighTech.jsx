import HighTechPicCard from "./sections/HighTechPicCard";
import Introduction from "./sections/Introduction";
import OurExpert from "./sections/OurExpert";
import OurServicesIn from "./sections/OurServicesIn";
import LiveTechInsights from "./sections/LiveTechInsights";

function HighTech() {
  return (
    <>
      <HighTechPicCard />
      <Introduction />
      <OurServicesIn />
      <LiveTechInsights />
      <OurExpert />
    </>
  );
}

export default HighTech;
