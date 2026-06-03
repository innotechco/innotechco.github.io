import {lazy, Suspense, useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import {ThemeProvider} from "./context/ThemeContext";

import ContactModal from "./components/modals/ContactModal";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/layout/ScrollToTop";

import {industryRoutes, routes} from "./routes";

const Home = lazy(() => import("./pages/home/Home"));
const AiAgent = lazy(() => import("./pages/ai-agent/AiAgent"));
const Archives = lazy(() => import("./pages/archives/Archives"));
const WhatWeThink = lazy(() => import("./pages/what-we-think/WhatWeThink"));
const WhoWeAre = lazy(() => import("./pages/who-we-are/WhoWeAre"));
const Automotive = lazy(() => import("./pages/automotive/Automotive"));
const EnergyAndMaterials = lazy(
  () => import("./pages/energy-and-materials/EnergyAndMaterials"),
);
const Health = lazy(() => import("./pages/health/Health"));
const HighTech = lazy(() => import("./pages/high-tech/HighTech"));
const MetalsAndMining = lazy(
  () => import("./pages/metals-and-mining/MetalsAndMining"),
);

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const {pathname} = useLocation();
  const footerTopSpacing =
    pathname === routes.whatWeThink
      ? "-mt-10"
      : [
          ...industryRoutes,
          routes.aiAgent,
          routes.archives,
          routes.whoWeAre,
        ].includes(pathname)
        ? "mt-0"
        : undefined;

  return (
    <ThemeProvider>
      <div className="relative w-full min-h-screen overflow-x-hidden">
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path={routes.home} element={<Home />} />
            <Route path={routes.aiAgent} element={<AiAgent />} />
            <Route path={routes.archives} element={<Archives />} />
            <Route path={routes.whatWeThink} element={<WhatWeThink />} />
            <Route path={routes.whoWeAre} element={<WhoWeAre />} />
            <Route path={routes.automotive} element={<Automotive />} />
            <Route
              path={routes.energyAndMaterials}
              element={<EnergyAndMaterials />}
            />
            <Route path={routes.health} element={<Health />} />
            <Route path={routes.highTech} element={<HighTech />} />
            <Route
              path={routes.metalsAndMining}
              element={<MetalsAndMining />}
            />
          </Routes>
        </Suspense>
        <Footer
          onContactClick={() => setIsContactOpen(true)}
          topSpacingClassName={footerTopSpacing}
        />
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
