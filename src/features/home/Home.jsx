import HeroSection from "./sections/hero/HeroSection.jsx";
import EcosystemSection from "./sections/ecosystem/EcosystemSection.jsx";
import LatestNewsSection from "./sections/latest-news/LatestNewsSection.jsx";
import LiveInsightsSection from "./sections/live-insights/LiveInsightsSection.jsx";
import GlobalFootprintSection from "./sections/global-footprint/GlobalFootprintSection.jsx";
import {HomeContentProvider} from "../../app/providers/home-content/HomeContentProvider.jsx";

function Home() {
  return (
    <HomeContentProvider>
      <HeroSection />
      <EcosystemSection />
      <LatestNewsSection />
      <LiveInsightsSection />
      <GlobalFootprintSection />
    </HomeContentProvider>
  );
}

export default Home;
