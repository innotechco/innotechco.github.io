import {useEffect, useRef, useState} from "react";
import {Route, Routes} from "react-router-dom";

import AllCoursesPage from "./pages/all-courses/AllCoursesPage.jsx";
import BasketPage from "./pages/basket/BasketPage.jsx";
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx";
import CoursePage from "./pages/course/CoursePage.jsx";
import AuthSidebar from "./auth/AuthSidebar.jsx";
import FirstPage from "./pages/first-page/FirstPage.jsx";
import InlearnNavbar from "./shell/InlearnNavbar.jsx";
import InlearnToast from "./shell/InlearnToast.jsx";
import {getBasketCount, subscribeToBasket} from "./services/basket.js";
import {getInlearnCourses} from "./inlearnContent.js";
import {restoreSession} from "./services/authService.js";
import {useTheme} from "../../app/providers/theme/useTheme.js";
import "../../styles/inlearn.css";

function InlearnAcademy() {
  const [authMode, setAuthMode] = useState("register");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState(null);
  /* An object rather than a string, so a toast can carry one action with
     it - the basket's Undo. null when there is nothing to say. */
  const [toast, setToast] = useState(null);
  const {isDarkMode, setIsDarkMode} = useTheme();
  const themeOnEntry = useRef(isDarkMode);
  const basketCount = useRef(0);

  /* The message belongs here rather than in the button that caused it: the
     toast is the shell's, and a course added from a card, from a course page or
     from anywhere else later should say the same thing in the same place.

     It compares against the count it last saw, so it speaks for an addition and
     stays quiet when something is removed. */
  useEffect(() => {
    basketCount.current = getBasketCount();

    return subscribeToBasket(() => {
      const next = getBasketCount();
      const added = next > basketCount.current;
      basketCount.current = next;
      if (added) setToast({message: getInlearnCourses().detail.addedToCart});
    });
  }, []);

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
      <InlearnToast
        message={toast?.message}
        action={toast?.action}
        onDismiss={() => setToast(null)}
      />
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
          setToast({
            message:
              how === "register"
                ? `Your account is ready${name ? `, ${name}` : ""}.`
                : `Welcome back${name ? `, ${name}` : ""}.`,
          });
        }}
      />
      {/* INLEARN owns everything under /inlearn, so its pages are routed here
          rather than in the site's router: the navbar, the sign-in panel and
          the session above are shared by all of them and would otherwise be
          mounted again on every move between two INLEARN pages.

          Relative paths, because this whole tree is mounted at /inlearn/*.
          Anything unrecognised lands on the first page rather than on a blank
          screen - a mistyped INLEARN address is still an INLEARN visit. */}
      <Routes>
        <Route path="courses" element={<AllCoursesPage />} />
        <Route path="courses/:slug" element={<CoursePage />} />
        {/* The basket raises the shell's toast rather than one of its own:
            there is one place messages appear on this module, and a removal
            should be answered in the same place an addition is. */}
        <Route path="basket" element={<BasketPage onToast={setToast} />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="*" element={<FirstPage />} />
      </Routes>
    </main>
  );
}

export default InlearnAcademy;
