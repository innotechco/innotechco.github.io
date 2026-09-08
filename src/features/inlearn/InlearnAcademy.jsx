import {useState} from "react";

import AuthSidebar from "./components/AuthSidebar.jsx";
import InlearnFooter from "./components/InlearnFooter.jsx";
import InlearnHero from "./components/InlearnHero.jsx";
import InlearnNavbar from "./components/InlearnNavbar.jsx";
import "../../styles/inlearn.css";

function InlearnAcademy() {
  const [authMode, setAuthMode] = useState("register");
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
    <main className="inlearn-page">
      <InlearnNavbar onAuthOpen={openAuth} />
      <AuthSidebar
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onModeChange={setAuthMode}
      />
      <section className="inlearn-stage">
        <InlearnHero />
      </section>
      <InlearnFooter />
    </main>
  );
}

export default InlearnAcademy;
