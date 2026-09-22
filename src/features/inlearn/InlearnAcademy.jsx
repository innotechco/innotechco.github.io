import {useEffect, useRef, useState} from "react";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";

import AllCoursesPage from "./pages/all-courses/AllCoursesPage.jsx";
import BasketPage from "./pages/basket/BasketPage.jsx";
import CheckoutPage from "./pages/checkout/CheckoutPage.jsx";
import CoursePage from "./pages/course/CoursePage.jsx";
import DashboardPage from "./pages/dashboard/DashboardPage.jsx";
import ProfileSection from "./pages/dashboard/sections/ProfileSection.jsx";
import SaveSection from "./pages/dashboard/sections/SaveSection.jsx";
import AuthSidebar from "./auth/AuthSidebar.jsx";
import FirstPage from "./pages/first-page/FirstPage.jsx";
import InlearnNavbar from "./shell/InlearnNavbar.jsx";
import InlearnToast from "./shell/InlearnToast.jsx";
import {getBasketCount, subscribeToBasket} from "./services/basket.js";
import {subscribeToSavedCourses} from "./services/savedCourses.js";
import {subscribeToCourseShare} from "./services/courseShare.js";
import {getInlearnCourses} from "./inlearnContent.js";
import {restoreSession, signOut} from "./services/authService.js";
import {routes} from "../../app/routes.js";
import {useTheme} from "../../app/providers/theme/useTheme.js";
import "../../styles/inlearn.css";

/* Sat here beside the panel's own wording rather than in a content JSON file:
   every other sentence the sign-in panel says is written in the components too,
   and INLEARN is English-only so far. It moves with them on the day the module
   is translated.

   It says why, and it does not apologise or alarm. Running out after a month is
   the system working, not a fault, and "signed out for your security" reads as
   though something happened. */
const SESSION_EXPIRED_MESSAGE = "You have been signed out. Please sign in again to continue.";

function InlearnAcademy() {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState("register");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [session, setSession] = useState(null);
  /* Three states, not two: null means "nobody", and until restoreSession has
     answered we do not yet know which. The dashboard needs that distinction -
     see the route below. */
  const [isSessionKnown, setIsSessionKnown] = useState(false);
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

  useEffect(
    () =>
      subscribeToSavedCourses((change) => {
        if (!change) return;
        setToast({
          message: change.saved ? "Course saved." : "Course removed from saved.",
          action: {
            label: "View",
            tone: "link",
            run: () => navigate(routes.inlearnDashboardSave),
          },
        });
      }),
    [navigate],
  );

  useEffect(
    () =>
      subscribeToCourseShare(({copied}) => {
        setToast({
          message: copied ? "Course link copied." : "Could not copy the course link.",
        });
      }),
    [],
  );

  /* The access token only lives ten minutes, which is shorter than most visits
     away, so a stored one is almost certainly stale by now. Trading it for a
     fresh one here means the first thing that needs it does not have to fail
     first. A refresh token that has expired or been revoked comes back null,
     and the visitor is simply signed out. */
  useEffect(() => {
    let isActive = true;
    restoreSession()
      .then(({session: restored, expired}) => {
        if (!isActive) return;
        setSession(restored);
        setIsSessionKnown(true);
        /* Only when a session that existed has run out. A first-time visitor
           also arrives signed out, and telling them their session expired
           would be a lie about an account they never had. */
        if (expired) setToast({message: SESSION_EXPIRED_MESSAGE});
      })
      .catch(() => {
        if (!isActive) return;
        setSession(null);
        setIsSessionKnown(true);
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

  /* Signing out belongs to the shell: the shell holds the session, and a rail
     that cleared it would be reaching past its own edge. The dashboard route
     then sees no session and sends the visitor to the first page by itself,
     so there is no navigation to write here. */
  /* The Profile page has just been told what the server stored; the navbar and
     the panel are showing the same person. Folding it back into the session
     here is what keeps the three of them saying the same thing without any of
     them asking the server again. */
  const handleProfileChange = (profile) => {
    setSession((current) =>
      current
        ? {
            ...current,
            displayName: profile.fullName || current.displayName,
            avatar: profile.avatar ?? null,
            user: {...current.user, email: profile.email ?? current.user?.email},
          }
        : current,
    );
  };

  const handleExit = () => {
    signOut();
    setSession(null);
    setIsSessionKnown(true);
  };

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

        {/* Everything behind signing in, under one shell that draws the rail
            once. Signed out it is not a page at all: the visitor is sent to
            the first page with the sign-in panel already open, rather than
            shown an empty dashboard belonging to nobody.

            restoreSession has not answered on the first render, so a session
            that exists is still null here - hence the third state. Treating
            "not known yet" as "signed out" would bounce a signed-in visitor
            off their own dashboard every time they opened it by address. */}
        <Route
          path="dashboard"
          element={
            isSessionKnown && !session
              ? <Navigate to={routes.inlearnAcademy} replace state={{openAuth: "login"}} />
              : <DashboardPage session={session} onExit={handleExit} />
          }
        >
          <Route index element={null} />
          <Route path="bill" element={null} />
          <Route path="courses" element={null} />
          <Route path="save" element={<SaveSection />} />
          <Route
            path="profile"
            element={
              <ProfileSection
                onProfileChange={handleProfileChange}
                onToast={setToast}
              />
            }
          />
        </Route>

        <Route path="*" element={<FirstPage />} />
      </Routes>
    </main>
  );
}

export default InlearnAcademy;
