import {lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import {ThemeProvider} from "./providers/theme/ThemeContext.jsx";
import {dismissBootCurtain} from "./bootCurtain.js";
import {InlearnMark, InnotechMark} from "../shared/components/ui/BrandMark.jsx";

import ContactModal from "../shared/components/modals/ContactModal.jsx";
import {useLanguage} from "./providers/language/useLanguage.js";
import {localizedModule} from "../shared/i18n/locale.js";
import {t} from "../shared/i18n/ui.js";
import {ContactActionsProvider} from "./providers/contact-actions/ContactActionsProvider.jsx";
import Footer from "../shared/components/layout/Footer.jsx";
import Navbar from "../shared/components/layout/Navbar.jsx";
import ScrollToTop from "../shared/components/layout/ScrollToTop.jsx";
import SiteScrollbar from "../shared/components/layout/SiteScrollbar.jsx";

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

/* The same face as the curtain in index.html, for the same reason it exists:
   this is what a visitor sees while a page is on its way, and two different
   loading screens on one site read as two different sites.

   `variant` is where the visitor is going, not where they are. INLEARN is a
   white module and the rest is black - a black cover lifting onto a white page
   is the flash a cover is supposed to prevent, and it is exactly what moving
   from innotech.global into INLEARN used to look like. */
function LoadingMark({fullScreen = true, variant = "site"}) {
  const isInlearn = variant === "inlearn";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-[18px] px-6 ${
        isInlearn ? "bg-white" : "bg-[#050505]"
      } ${fullScreen ? "min-h-screen pt-28" : "h-full min-h-48"}`}
    >
      {isInlearn ? (
        <InlearnMark className="size-[58px]" />
      ) : (
        <InnotechMark className="size-[58px]" />
      )}
      <span
        className={`text-xs font-semibold uppercase tracking-[0.22em] ${
          isInlearn ? "text-[#050505]/40" : "text-white/45"
        }`}
      >
        {t("loading")}
      </span>
    </div>
  );
}

/* The marker matters: while this is on screen the real page is still a dynamic
   import, so nothing of it is in the document yet and measuring readiness would
   measure this fallback. waitForContentToSettle() waits for it to go away. */
/* The panel React shows while a route's chunk is still arriving. It takes the
   look of the place it is on its way to, the same as the curtain over it. */
function RouteFallback() {
  const {pathname} = useLocation();

  return (
    <main data-route-loading="">
      <LoadingMark variant={isInlearnPath(pathname) ? "inlearn" : "site"} />
    </main>
  );
}

/* Long enough for a slow connection to finish assembling the page, short
   enough that a curtain which cannot lift still lifts. */
const FIRST_VISIT_MAX_WAIT_MS = 6000;
const ROUTE_CHANGE_MAX_WAIT_MS = 2500;

/* How long a move is allowed to take before it is worth covering.

   This is the fix for a curtain that used to appear over pages that were
   already on screen. A route whose chunk is already loaded mounts and settles
   within a frame or two; raising a curtain over it and holding it there reads
   as the site stalling, not loading. So nothing is shown for the first moment
   of any move - if the page is ready by then, the visitor never sees a
   curtain at all. */
const CURTAIN_GRACE_MS = 160;

/* And once it IS up, it stays long enough to be a deliberate cover rather than
   a flash. This only ever applies to a curtain that was actually shown. */
const MINIMUM_CURTAIN_MS = 400;

/* requestAnimationFrame never fires while the tab is in the background, so a
   bare await on it hangs for as long as the visitor looks somewhere else - with
   the curtain still up when they come back. The timer is the way out. */
/* The timer is the way out when requestAnimationFrame never fires - a
   background tab, or an embedded view that reports itself hidden.

   It is 32ms, two frames at sixty a second, rather than the 100ms it used to
   be. That number is paid on every single round of the settle, and at 100ms it
   was the reason a first paint could sit behind the curtain for six seconds
   anywhere the tab was not visibly in front: not because anything was loading,
   but because the code that checks was waiting on a timer six times longer
   than the frame it stands in for. */
const FRAME_FALLBACK_MS = 32;

function nextFrame() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    requestAnimationFrame(finish);
    window.setTimeout(finish, FRAME_FALLBACK_MS);
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

    /* Nothing to load is not the same as still loading. A picture element with
       no source is never complete and never fires load or error, so waiting on
       one waits for ever - which in practice meant waiting out the whole
       deadline. (Spelled out in words because the lazy-loading test scans this
       file's raw source for the tag and a comment containing it fails.) */
    const source = image.getAttribute("src");
    if (!source && !image.getAttribute("srcset")) return false;

    /* A data URI carries its own bytes: it arrived with the document and there
       is no request outstanding for it. Waiting on one buys nothing, and an
       inlined icon that has not finished decoding will hold the whole settle
       open while it does. */
    if (source?.startsWith("data:")) return false;

    const rect = image.getBoundingClientRect();
    /* It has to have a box in BOTH directions to be something the visitor is
       waiting to see. This used to ask for both to be zero, which let through
       anything laid out flat - the decorative curve across the home page is
       1024 wide and 0 high until its own styles land, and on every first visit
       it was counted as loading, kept the settle from ever going quiet, and
       held the curtain up until the six second deadline.

       A later round picks an image up once it has a real size, so nothing is
       lost by skipping it now. */
    if (!rect.width || !rect.height) return false;

    return rect.top < window.innerHeight * 1.25 && rect.bottom > 0;
  });
}

/* A single pass is what made the first visit look broken: it ran while <main>
   was still the Suspense fallback, found nothing to wait for, and let the
   curtain go before the page existed. So this waits in rounds, and only stops
   once the route has mounted and two rounds in a row find nothing left
   loading - or once the deadline passes, because a curtain that never lifts is
   worse than one that lifts early. */
/* A move between pages has exactly one thing to wait for: the page's chunk to
   arrive and mount. That is a marker appearing in the document, so it is polled
   for directly rather than measured in animation frames.

   Frames were the wrong instrument here. nextFrame() falls back to a 100ms
   timer whenever requestAnimationFrame does not fire - which is any background
   tab, and some embedded views - so the four frames the settle used cost 400ms
   before it could even conclude that an already-loaded page was ready. That is
   longer than the grace period, so every move showed a curtain it did not need.
   A 30ms poll answers the same question in a fraction of the time and does not
   depend on the tab being visible. */
async function waitForRouteToMount(deadline) {
  while (performance.now() < deadline) {
    if (!document.querySelector("[data-route-loading]")) return;
    await wait(30);
  }
}

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

  /* The curtain is asked for, not switched on.

     A request arms a timer. If the page is ready before it fires, the request
     is dropped and nothing was ever shown - which is every move to a page whose
     code is already loaded. Only a move that is actually slow gets a curtain,
     and once one is up it stays long enough to read as deliberate. */
  const graceTimer = useRef(0);
  const shownAt = useRef(0);
  /* Where the move is going, decided when the curtain is asked for.

     It cannot be read off the current location: the click handler asks for the
     curtain while the old page is still on screen and the address has not
     changed yet, so a curtain that read the location would come up in the
     colour of the page being left and then change under the visitor. */
  const [variant, setVariant] = useState("site");

  const showCurtain = useCallback(() => {
    if (shownAt.current) return;
    shownAt.current = performance.now();
    setIsVisible(true);
  }, []);

  /* `immediate` is for a move that changes what the site LOOKS like rather than
     one that merely takes time: stepping into or out of INLEARN swaps a dark
     page for a light one, and the curtain is what stops that being a flash.
     There is nothing to wait and see about, so it goes up at once - and because
     this is called from a layout effect, at once means before the new page has
     been painted. */
  const requestCurtain = useCallback(
    ({immediate = false, to = "site"} = {}) => {
      if (graceTimer.current || shownAt.current) return;
      setVariant(to);
      if (immediate) {
        showCurtain();
        return;
      }
      graceTimer.current = window.setTimeout(() => {
        graceTimer.current = 0;

        /* The last word before it goes up: is there anything left to cover?

           A curtain exists to hide a page being assembled. If the page has
           already mounted by the time this timer fires, then whatever it would
           cover is something the visitor is already reading - and dropping a
           curtain over that is the exact thing being complained about: the page
           appears, and then a loading screen arrives on top of it.

           So the timer is permission to show, not an instruction. */
        if (document.querySelector("[data-route-loading]")) showCurtain();
      }, CURTAIN_GRACE_MS);
    },
    [showCurtain],
  );

  const releaseCurtain = useCallback(() => {
    window.clearTimeout(graceTimer.current);
    graceTimer.current = 0;

    /* Never shown: there is nothing to take away, and nothing to wait for. */
    if (!shownAt.current) {
      dismissBootCurtain();
      return 0;
    }

    const remaining = Math.max(0, MINIMUM_CURTAIN_MS - (performance.now() - shownAt.current));
    return remaining;
  }, []);

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
        /* Asked for here, while the old page is still on screen, so a slow move
           is covered from the moment it starts rather than after the new page
           has already appeared. */
        const goingToInlearn = isInlearnPath(targetUrl.pathname);
        const isCrossing = isInlearnPath(currentUrl.pathname) !== goingToInlearn;
        requestCurtain({
          immediate: isCrossing,
          to: goingToInlearn ? "inlearn" : "site",
        });
      }
    };

    document.addEventListener("click", handleInternalLinkClick, true);
    return () =>
      document.removeEventListener("click", handleInternalLinkClick, true);
  }, [requestCurtain]);

  /* A layout effect, not an effect: this runs after React has put the new page
     in the document but BEFORE the browser paints it. A plain effect runs after
     the paint, which is what used to let the new page flash into view and then
     be covered - page, then loading, then page again. Back and forward and any
     navigate() call had no click to arm the curtain earlier, so they showed it
     every time. */
  useLayoutEffect(() => {
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
        /* One side INLEARN and the other not: that is the crossing, and it is
           covered on sight rather than after a grace period. */
        const goingToInlearn = isInlearnPath(location.pathname);
        requestCurtain({
          immediate: cameFromInlearn !== goingToInlearn,
          to: goingToInlearn ? "inlearn" : "site",
        });
      }

      const startedAt = performance.now();
      const deadline =
        startedAt +
        (isFirstVisit ? FIRST_VISIT_MAX_WAIT_MS : ROUTE_CHANGE_MAX_WAIT_MS);

      if (isFirstVisit) {
        /* The first paint is the one the curtain exists for: wait for the fonts
           and for the pictures in the first screenful, or the page assembles in
           front of the visitor. */
        await nextFrame();
        await nextFrame();

        if (document.fonts?.ready) {
          await untilDeadline(document.fonts.ready, deadline);
        }

        await waitForContentToSettle(deadline);
      } else {
        await waitForRouteToMount(deadline);
      }

      if (isCancelled) return;

      const remaining = releaseCurtain();

      timeoutId = window.setTimeout(() => {
        if (isCancelled) return;
        shownAt.current = 0;
        setIsVisible(false);
        /* Unconditional, and idempotent: if this run was cut short by a
           navigation, the run that replaces it still has to take the first
           curtain down. */
        dismissBootCurtain();
      }, remaining);
    };

    waitForPageReady();

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
      window.clearTimeout(graceTimer.current);
      graceTimer.current = 0;
    };
  }, [location.key, location.pathname, location.search, requestCurtain, releaseCurtain]);

  return (
    <div
      aria-hidden={!isVisible}
      className={`fixed inset-0 z-[200] transition-opacity duration-300 ${
        variant === "inlearn" ? "bg-white" : "bg-[#050505]"
      } ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
    >
      <LoadingMark fullScreen={false} variant={variant} />
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
        {/* Above the page and outside every route, so it is the same bar on
            innotech.global and inside INLEARN. */}
        <SiteScrollbar />
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
