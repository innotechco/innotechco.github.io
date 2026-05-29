import HealthPicCard from "./sections/HealthPicCard";
import Acceleration from "./sections/Acceleration";
import OurEcosystem from "./sections/OurEcosystem";
import OurCapabilities from "./sections/OurCapabilities";
import LiveHealthInsights from "./sections/LiveHealthInsights";

function Health() {
  return (
    <>
      <HealthPicCard />
      <Acceleration />
      <OurCapabilities />
      <LiveHealthInsights />
      <OurEcosystem />
    </>
  );
}

export default Health;
