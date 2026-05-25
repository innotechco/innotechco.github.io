import {useState} from "react";
import {ThemeProvider} from "./components/ThemeContext";
import Navbar from "./components/Navbar";
import FirstPage from "./components/FirstPage";
import EcosystemSection from "./components/EcosystemSection";
import LatestNews from "./components/LatestNews";
import WhatWeThink from "./components/WhatWeThink";
import Map from "./components/Map";
import FooterFirstPage from "./components/FooterFirstPage";
import ContactModal from "./components/ContactModal";

function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <ThemeProvider>
      {" "}
      <div className="relative w-full min-h-screen overflow-x-hidden">
        <Navbar /> 
        <FirstPage />
        <EcosystemSection /> 
        <LatestNews />
        <WhatWeThink />
        <Map />
        <FooterFirstPage onContactClick={() => setIsContactOpen(true)} />
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
