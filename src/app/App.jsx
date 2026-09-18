import {lazy, Suspense, useEffect, useRef, useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import {ThemeProvider} from "./providers/theme/ThemeContext.jsx";
import {dismissBootCurtain} from "./bootCurtain.js";

import ContactModal from "../shared/components/modals/ContactModal.jsx";
import {useLanguage} from "./providers/language/useLanguage.js";
import {localizedModule} from "../shared/i18n/locale.js";
import {t} from "../shared/i18n/ui.js";
import {ContactActionsProvider} from "./providers/contact-actions/ContactActionsProvider.jsx";
import Footer from "../shared/components/layout/Footer.jsx";
import Navbar from "../shared/components/layout/Navbar.jsx";
import ScrollToTop from "../shared/components/layout/ScrollToTop.jsx";

import {industryRoutes, serviceRoutes, routes} from "./routes.js";

/* INLEARN owns everything under its route, and several things - the navbar, the
   footer shape, the loading curtain - key off that. */
function isInlearnPath(pathname) {
  return (
    pathname === routes.inlearnAcademy ||
    pathname.startsWith(`${routes.inlearnAcademy}/`)
  );
}

function lazyWithRetry(importer, name) {
  return lazy(async () => {
    try {
      const module = await importer();
      sessionStorage.removeItem(`lazy-reload-${name}`);
      return module;
    } catch (error) {
      const storageKey = `lazy-reload-${name}`;
      const shouldReload =
        !sessionStorage.getItem(storageKey) &&
        /failed|fetch|import|chunk|module/i.test(error?.message ?? "");

      if (shouldReload) {
        sessionStorage.setItem(storageKey, "true");
        window.location.reload();
      }

      throw error;
    }
  });
}

const Home = lazyWithRetry(() => import("../features/home/Home.jsx"), "home");
const InlearnAcademy = lazyWithRetry(
  () => import("../features/inlearn/InlearnAcademy.jsx"),
  "inlearn",
);
const Archives = lazyWithRetry(
  () => import("../features/archives/Archives.jsx"),
  "archives",
);
const ArticlePage = lazyWithRetry(
  () => import("../features/articles/ArticlePage.jsx"),
  "article",
);
const PartnerPage = lazyWithRetry(
  () => import("../features/what-we-do/partners/PartnerPage.jsx"),
  "partner",
);
const WhatWeThink = lazyWithRetry(
  () => import("../features/what-we-think/WhatWeThink.jsx"),
  "what-we-think",
);
const RequestForProposal = lazyWithRetry(
  () => import("../features/request-for-proposal/RequestForProposal.jsx"),
  "request-for-proposal",
);
const WhoWeAre = lazyWithRetry(
  () => import("../features/who-we-are/WhoWeAre.jsx"),
  "who-we-are",
);
const Inception = lazyWithRetry(
  () => import("../features/what-we-do/services/inception/Inception.jsx"),
  "inception",
);
const Insight = lazyWithRetry(
  () => import("../features/what-we-do/services/insight/Insight.jsx"),
  "insight",
);
const InfinityPage = lazyWithRetry(
  () => import("../features/what-we-do/services/infinity/Infinity.jsx"),
  "infinity",
);
const Automotive = lazyWithRetry(
  () => import("../features/what-we-do/industries/automotive/Automotive.jsx"),
  "automotive",
);
const EnergyAndMaterials = lazyWithRetry(
  () =>
    import("../features/what-we-do/industries/energy-and-materials/EnergyAndMaterials.jsx"),
  "energy-and-materials",
);
const Health = lazyWithRetry(
  () => import("../features/what-we-do/industries/health/Health.jsx"),
  "health",
);
const HighTech = lazyWithRetry(
  () => import("../features/what-we-do/industries/high-tech/HighTech.jsx"),
  "high-tech",
);
const MetalsAndMining = lazyWithRetry(
  () => import("../features/what-we-do/industries/metals-and-mining/MetalsAndMining.jsx"),
  "metals-and-mining",
);

function LoadingMark({fullScreen = true}) {
  return (
    <div
      className={`flex items-center justify-center bg-[#050505] px-6 text-white ${
        fullScreen ? "min-h-screen pt-28" : "h-full min-h-48"
      }`}
    >
      <div className="flex items-center gap-3 font-['Gotham'] text-sm uppercase tracking-[0.18em] text-white/70">
        <span className="size-3 animate-pulse rounded-full bg-[#37B478]" />
        <span className="font-['Gotham'] text-sm uppercase tracking-[0.18em] text-white/70">
          {t("loading")}
        </span>
      </div>
    </div>
  );
}

/* The marker matters: while this is on screen the real page is still a dynamic
   import, so nothing of it is in the document yet and measuring readiness would
   measure this fallback. waitForContentToSettle() waits for it to go away. */
function RouteFallback() {
  return (
    <main data-route-loading="">
      <LoadingMark />
    </main>
  );
}

/* Long enough for a slow connection to finish assembling the page, short
   enough that a curtain which cannot lift still lifts. */
const FIRST_VISIT_MAX_WAIT_MS = 6000;
const ROUTE_CHANGE_MAX_WAIT_MS = 2500;
const MINIMUM_CURTAIN_MS = 450;

/* requestAnimationFrame never fires while the tab is in the background, so a
   bare await on it hangs for as long as the visitor looks somewhere else - with
   the curtain still up when they come back. The timer is the way out. */
function nextFrame() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    requestAnimationFrame(finish);
    window.setTimeout(finish, 100);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function untilDeadline(promise, deadline) {
  return Promise.race([promise, wait(Math.max(0, deadline - performance.now()))]);
}

/* Deliberately the whole document, not "main img": the home page has no <main>
   at all, so that older query found nothing to wait for and the curtain came
   down on a page that had not started loading its pictures.

   Only what the visitor is about to look at counts. Waiting for every image on
   the page would mean waiting for ones far below the fold that a lazy loader
   will not even request until they are scrolled to - the curtain would then sit
   there until its deadline on every single visit. */
function pendingVisibleImages() {
  return Array.from(document.images).filter((image) => {
    if (image.complete) return false;

    const rect = image.getBoundingClientRect();
    /* No box yet: either hidden or not laid out. A later round picks it up once
       it has a size, so there is nothing to wait for now. */
    if (!rect.width && !rect.height) return false;

    return rect.top < window.innerHeight * 1.25 && rect.bottom > 0;
  });
}

/* A single pass is what made the first visit look broken: it ran while <main>
   was still the Suspense fallback, found nothing to wait for, and let the
   curtain go before the page existed. So this waits in rounds, and only stops
   once the route has mounted and two rounds in a row find nothing left
   loading - or once the deadline passes, because a curtain that never lifts is
   worse than one that lifts early. */
async function waitForContentToSettle(deadline) {
  let quietRounds = 0;

  while (performance.now() < deadline && quietRounds < 2) {
    await nextFrame();
    await nextFrame();

    if (document.querySelector("[data-route-loading]")) {
      quietRounds = 0;
      await wait(80);
      continue;
    }

    const pending = pendingVisibleImages();

    if (!pending.length) {
      quietRounds += 1;
      await wait(120);
      continue;
    }

    quietRounds = 0;
    await untilDeadline(
      Promise.all(
        pending.map(
          (image) =>
            new Promise((resolve) => {
              image.addEventListener("load", resolve, {once: true});
              image.addEventListener("error", resolve, {once: true});
            }),
        ),
      ),
      deadline,
    );
  }
}

function RouteLoadingOverlay() {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [isVisible, setIsVisible] = useState(false);
  /* INLEARN moves between its own pages constantly - basket, courses, dashboard -
     and a full-screen curtain on every one of those reads as the site hanging
     rather than loading. Crossing between INLEARN and innotech.global is a real
     jump between two looks, so that one keeps the curtain. */
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    const handleInternalLinkClick = (event) => {
      const link = event.target.closest?.("a[href]");

      if (
        !link ||
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === "_blank"
      ) {
        return;
      }

      const targetUrl = new URL(link.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const isSamePage =
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.search === currentUrl.search &&
        targetUrl.hash;
      /* Hopping between two INLEARN pages is not worth a curtain. */
      const insideInlearn =
        isInlearnPath(currentUrl.pathname) && isInlearnPath(targetUrl.pathname);

      if (targetUrl.origin === currentUrl.origin && !isSamePage && !insideInlearn) {
        setIsVisible(true);
      }
    };

    document.addEventListener("click", handleInternalLinkClick, true);
    return () =>
      document.removeEventListener("click", handleInternalLinkClick, true);
  }, []);

  useEffect(() => {
    const cameFromInlearn = isInlearnPath(previousPathname.current);
    previousPathname.current = location.pathname;
    /* The first visit never takes this shortcut: landing straight on /inlearn
       looks like a move inside INLEARN, and skipping it there would leave the
       curtain from index.html with nothing to take it down. */
    if (
      !isFirstRender.current &&
      cameFromInlearn &&
      isInlearnPath(location.pathname)
    ) {
      return undefined;
    }

    let timeoutId;
    let isCancelled = false;

    const waitForPageReady = async () => {
      const isFirstVisit = isFirstRender.current;

      if (isFirstVisit) {
        isFirstRender.current = false;
        /* index.html already has a curtain over the screen on a first visit,
           painted before this bundle existed. Raising a second one over it
           would only risk a seam between the two. */
      } else {
        setIsVisible(true);
      }

      const startedAt = performance.now();
      const deadline =
        startedAt +
        (isFirstVisit ? FIRST_VISIT_MAX_WAIT_MS : ROUTE_CHANGE_MAX_WAIT_MS);

      await nextFrame();
      await nextFrame();

      if (document.fonts?.ready) {
        await untilDeadline(document.fonts.ready, deadline);
      }

      await waitForContentToSettle(deadline);

      const elapsed = performance.now() - startedAt;
      const minimumDelay = Math.max(0, MINIMUM_CURTAIN_MS - elapsed);

      timeoutId = window.setTimeout(() => {
        if (isCancelled) return;
        setIsVisible(false);
        /* Unconditional, and idempotent: if this run was cut short by a
           navigation, the run that replaces it still has to take the first
           curtain down. */
        dismissBootCurtain();
      }, minimumDelay);
    };

    waitForPageReady();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [location.key, location.pathname, location.search]);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-0 z-[200] bg-[#050505] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <LoadingMark fullScreen={false} />
    </div>
  );
}

function SearchHighlightManager() {
  const location = useLocation();

  useEffect(() => {
    const highlightText = location.state?.searchHighlight;
    if (!highlightText) return undefined;

    const normalizeHighlightText = (value) =>
      String(value)
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();

    let highlightedElement;
    const clearHighlight = () => {
      highlightedElement?.classList.remove("search-result-highlight");
      highlightedElement = undefined;
    };

    let retryCount = 0;
    let timeoutId;

    const findAndHighlight = () => {
      const normalizedHighlight = normalizeHighlightText(highlightText);
      const candidates = document.querySelectorAll(
        "main h1, main h2, main h3, main p, main li, main span",
      );

      highlightedElement = Array.from(candidates)
        .filter((element) =>
          normalizeHighlightText(element.textContent ?? "").includes(
            normalizedHighlight,
          ),
        )
        .sort(
          (a, b) =>
            normalizeHighlightText(a.textContent ?? "").length -
            normalizeHighlightText(b.textContent ?? "").length,
        )[0];

      if (!highlightedElement && retryCount < 12) {
        retryCount += 1;
        timeoutId = window.setTimeout(findAndHighlight, 120);
        return;
      }

      if (!highlightedElement) return;

      highlightedElement.classList.add("search-result-highlight");
      highlightedElement.scrollIntoView({behavior: "smooth", block: "center"});
      window.addEventListener("mousedown", clearHighlight, {once: true});
      window.history.replaceState({}, "", location.pathname);
    };

    timeoutId = window.setTimeout(findAndHighlight, 120);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("mousedown", clearHighlight);
      clearHighlight();
    };
  }, [location.key, location.pathname, location.state]);

  return null;
}

function App() {
  const {isLanguageLoading} = useLanguage();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactActionId, setContactActionId] = useState("default");
  const {pathname} = useLocation();
  const isInlearnRoute = isInlearnPath(pathname);
  const footerTopSpacing =
    isInlearnRoute || pathname === routes.whatWeThink
      ? "mt-0"
      : [
          ...serviceRoutes,
          ...industryRoutes,
          routes.archives,
          routes.whoWeAre,
        ].includes(pathname) || pathname.startsWith(`${routes.articles}/`)
      ? "mt-0"
      : undefined;

  const openContact = (actionId = "default") => {
    setContactActionId(actionId);
    setIsContactOpen(true);
  };

  const activeContactContent = {
    ...localizedModule(import.meta.glob("../content/{en,ar,tr}/contact-actions/contact-actions.json", {eager: true, import: "default"}), "../content/en/contact-actions/contact-actions.json").default,
    ...(localizedModule(import.meta.glob("../content/{en,ar,tr}/contact-actions/contact-actions.json", {eager: true, import: "default"}), "../content/en/contact-actions/contact-actions.json")[contactActionId] ?? {}),
  };

  return (
    <ThemeProvider>
      <ContactActionsProvider onOpen={openContact}>
        <div className="relative w-full min-h-screen overflow-x-hidden">
        <ScrollToTop />
        <SearchHighlightManager />
        <RouteLoadingOverlay />
        {isLanguageLoading ? <div className="fixed inset-0 z-[250] bg-[#050505]"><LoadingMark fullScreen={false} /></div> : null}
        {isInlearnRoute ? null : <Navbar />}
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={routes.home} element={<Home />} />
            <Route path={`${routes.inlearnAcademy}/*`} element={<InlearnAcademy />} />
            <Route path={routes.archives} element={<Archives />} />
            <Route path={routes.article} element={<ArticlePage />} />
            <Route path={routes.partner} element={<PartnerPage />} />
            <Route path={routes.whatWeThink} element={<WhatWeThink />} />
            <Route path={routes.whoWeAre} element={<WhoWeAre />} />
            <Route path={routes.rfp} element={<RequestForProposal />} />
            <Route path={routes.inception} element={<Inception />} />
            <Route path={routes.insight} element={<Insight />} />
            <Route path={routes.infinity} element={<InfinityPage />} />
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
        {/* INLEARN keeps its own navbar but shares the site footer, as a plain
            rectangle rather than the curved shape the other pages use. */}
        <Footer
          onContactClick={() => openContact("default")}
          topSpacingClassName={footerTopSpacing}
          variant={isInlearnRoute ? "flat" : "curved"}
        />
        <ContactModal
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
          actionId={contactActionId}
          contentOverrides={activeContactContent}
        />
        </div>
      </ContactActionsProvider>
    </ThemeProvider>
  );
}

export default App;
