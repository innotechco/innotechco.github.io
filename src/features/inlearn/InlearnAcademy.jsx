import {useEffect, useRef, useState} from "react";

import AuthSidebar from "./components/AuthSidebar.jsx";
import FirstPage from "./first-page/FirstPage.jsx";
import InlearnNavbar from "./components/InlearnNavbar.jsx";
import InlearnToast from "./components/InlearnToast.jsx";
import {restoreSession} from "./services/authService.js";
import {useTheme} from "../../app/providers/theme/useTheme.js";
import "../../styles/inlearn.css";

function InlearnAcademy() {
  const [authMode, setAuthMode] = useState("register");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [toast, setToast] = useState("");
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
      <InlearnToast message={toast} onDismiss={() => setToast("")} />
      <InlearnNavbar onAuthOpen={openAuth} session={session} />
      <AuthSidebar
        isOpen={isAuthOpen}
        mode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onModeChange={setAuthMode}
        /* A provider sign-in can fail while the panel is shut, and its message
           belongs where the visitor can read it. */
        onProviderError={() => openAuth("login")}
        onSignedIn={(signedIn, how) => {
          setSession(signedIn);
          setIsAuthOpen(false);
          const name = signedIn?.displayName ?? "";
          setToast(
            how === "register"
              ? `Your account is ready${name ? `, ${name}` : ""}.`
              : `Welcome back${name ? `, ${name}` : ""}.`,
          );
        }}
      />
      <FirstPage />
    </main>
  );
}

export default InlearnAcademy;
