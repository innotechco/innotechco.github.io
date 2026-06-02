import {useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import {ThemeProvider} from "./context/ThemeContext";

import ContactModal from "./components/modals/ContactModal";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/layout/ScrollToTop";

import Home from "./pages/home/Home";
import AiAgent from "./pages/ai-agent/AiAgent";
import WhatWeThink from "./pages/what-we-think/WhatWeThink";
import WhoWeAre from "./pages/who-we-are/WhoWeAre";

import Automotive from "./pages/automotive/Automotive";
import EnergyAndMaterials from "./pages/energy-and-materials/EnergyAndMaterials";
import Health from "./pages/health/Health";
import HighTech from "./pages/high-tech/HighTech";
import MetalsAndMining from "./pages/metals-and-mining/MetalsAndMining";

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const {pathname} = useLocation();
  const footerTopSpacing =
    pathname === "/what-we-think"
      ? "-mt-10"
      : [
          "/automotive",
          "/energy-and-materials",
          "/health",
          "/high-tech",
          "/metals-and-mining",
          "/ai-agent",
          "/who-we-are",
        ].includes(pathname)
        ? "mt-0"
        : undefined;

  return (
    <ThemeProvider>
      <div className="relative w-full min-h-screen overflow-x-hidden">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ai-agent" element={<AiAgent />} />
          <Route path="/what-we-think" element={<WhatWeThink />} />
          <Route path="/who-we-are" element={<WhoWeAre />} />
          <Route path="/automotive" element={<Automotive />} />
          <Route path="/energy-and-materials" element={<EnergyAndMaterials />} />
          <Route path="/health" element={<Health />} />
          <Route path="/high-tech" element={<HighTech />} />
          <Route path="/metals-and-mining" element={<MetalsAndMining />} />
        </Routes>
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
