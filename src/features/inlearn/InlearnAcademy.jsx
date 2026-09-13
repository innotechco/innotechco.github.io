import {useEffect, useRef, useState} from "react";

import AuthSidebar from "./components/AuthSidebar.jsx";
import InlearnHero from "./components/InlearnHero.jsx";
import InlearnNavbar from "./components/InlearnNavbar.jsx";
import {restoreSession} from "./services/authService.js";
import {useTheme} from "../../app/providers/theme/useTheme.js";
import "../../styles/inlearn.css";

function InlearnAcademy() {
  const [authMode, setAuthMode] = useState("register");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState(null);
  const {isDarkMode, setIsDarkMode} = useTheme();
  const themeOnEntry = useRef(isDarkMode);

  /* The access token only lives ten minutes, which is shorter than most visits
     away, so a stored one is almost certainly stale by now. Trading it for a
     fresh one here means the first thing that needs it does not have to fail
     first. A refresh token that has expired or been revoked comes back null,
     and the visitor is simply signed out. */
  useEffect(() => {
    let isActive = true;
    restoreSession()
      .then((restored) => {
        if (isActive) setSession(restored);
      })
      .catch(() => {
        if (isActive) setSession(null);
      });
    return () => {
      isActive = false;
    };
  }, []);

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
      <InlearnNavbar onAuthOpen={openAuth} session={session} />
      <AuthSidebar
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onModeChange={setAuthMode}
        onSignedIn={(signedIn) => {
          setSession(signedIn);
          setIsAuthOpen(false);
        }}
      />
      <section className="inlearn-stage">
        <InlearnHero />
      </section>
    </main>
  );
}

export default InlearnAcademy;
