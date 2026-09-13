import {useEffect, useRef, useState} from "react";

import AuthSidebar from "./components/AuthSidebar.jsx";
import InlearnHero from "./components/InlearnHero.jsx";
import InlearnNavbar from "./components/InlearnNavbar.jsx";
import {useTheme} from "../../app/providers/theme/useTheme.js";
import "../../styles/inlearn.css";

function InlearnAcademy() {
  const [authMode, setAuthMode] = useState("register");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const {isDarkMode, setIsDarkMode} = useTheme();
  const themeOnEntry = useRef(isDarkMode);

  /* INLEARN is only designed for the light theme so far, and the shared footer
     follows the site theme - in the dark theme it turns white and clashes with
     this page's light background. Hold the site in light while INLEARN is open
     and hand the visitor's own choice back on the way out. */
  useEffect(() => {
    const previous = themeOnEntry.current;
    setIsDarkMode(false);
    return () => setIsDarkMode(previous);
  }, [setIsDarkMode]);

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
    </main>
  );
}

export default InlearnAcademy;
