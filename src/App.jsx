import {lazy, Suspense, useEffect, useRef, useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import {ThemeProvider} from "./context/ThemeContext";

import ContactModal from "./components/modals/ContactModal";
import contactActionContent from "./content/en/contact-actions/contact-actions.json";
import {ContactActionsProvider} from "./context/ContactActionsProvider";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/layout/ScrollToTop";

import {industryRoutes, serviceRoutes, routes} from "./routes";

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

const Home = lazyWithRetry(() => import("./pages/home/Home"), "home");
const InlearnAcademy = lazyWithRetry(
  () => import("./pages/inlearn-academy/InlearnAcademy"),
  "inlearn-academy",
);
const Archives = lazyWithRetry(
  () => import("./pages/what-we-think/archives/Archives"),
  "archives",
);
const ArticlePage = lazyWithRetry(
  () => import("./pages/articles/ArticlePage"),
  "article",
);
const PartnerPage = lazyWithRetry(
  () => import("./pages/what-we-do/services/partners/PartnerPage"),
  "partner",
);
const WhatWeThink = lazyWithRetry(
  () => import("./pages/what-we-think/WhatWeThink"),
  "what-we-think",
);
const WhoWeAre = lazyWithRetry(
  () => import("./pages/who-we-are/WhoWeAre"),
  "who-we-are",
);
const Inception = lazyWithRetry(
  () => import("./pages/what-we-do/services/inception/Inception"),
  "inception",
);
const Insight = lazyWithRetry(
  () => import("./pages/what-we-do/services/insight/Insight"),
  "insight",
);
const InfinityPage = lazyWithRetry(
  () => import("./pages/what-we-do/services/infinity/Infinity"),
  "infinity",
);
const Automotive = lazyWithRetry(
  () => import("./pages/what-we-do/industries/automotive/Automotive"),
  "automotive",
);
const EnergyAndMaterials = lazyWithRetry(
  () =>
    import("./pages/what-we-do/industries/energy-and-materials/EnergyAndMaterials"),
  "energy-and-materials",
);
const Health = lazyWithRetry(
  () => import("./pages/what-we-do/industries/health/Health"),
  "health",
);
const HighTech = lazyWithRetry(
  () => import("./pages/what-we-do/industries/high-tech/HighTech"),
  "high-tech",
);
const MetalsAndMining = lazyWithRetry(
  () => import("./pages/what-we-do/industries/metals-and-mining/MetalsAndMining"),
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
          Loading
        </span>
      </div>
    </div>
  );
}

function RouteFallback() {
  return (
    <main>
      <LoadingMark />
    </main>
  );
}

function RouteLoadingOverlay() {
  const location = useLocation();
  const isFirstRender = useRef(true);
  const [isVisible, setIsVisible] = useState(false);

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

      if (targetUrl.origin === currentUrl.origin && !isSamePage) {
        setIsVisible(true);
      }
    };

    document.addEventListener("click", handleInternalLinkClick, true);
    return () =>
      document.removeEventListener("click", handleInternalLinkClick, true);
  }, []);

  useEffect(() => {
    let timeoutId;
    let isCancelled = false;

    const waitForPageReady = async () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
      } else {
        setIsVisible(true);
      }

      const startedAt = performance.now();

      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => requestAnimationFrame(resolve));

      if (document.fonts?.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => window.setTimeout(resolve, 800)),
        ]);
      }

      const images = Array.from(document.querySelectorAll("main img")).filter(
        (image) => !image.complete,
      );

      if (images.length) {
        await Promise.race([
          Promise.all(
            images.map(
              (image) =>
                new Promise((resolve) => {
                  image.addEventListener("load", resolve, {once: true});
                  image.addEventListener("error", resolve, {once: true});
                }),
            ),
          ),
          new Promise((resolve) => window.setTimeout(resolve, 1600)),
        ]);
      }

      const elapsed = performance.now() - startedAt;
      const minimumDelay = Math.max(0, 450 - elapsed);

      timeoutId = window.setTimeout(() => {
        if (!isCancelled) setIsVisible(false);
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
        .replace(/[^a-z0-9]+/g, " ")
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
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactActionId, setContactActionId] = useState("default");
  const {pathname} = useLocation();
  const footerTopSpacing =
    pathname === routes.whatWeThink
      ? "mt-0"
      : [
          ...serviceRoutes,
          ...industryRoutes,
          routes.featuredArticle,
          routes.inlearnAcademy,
          routes.archives,
          routes.whoWeAre,
        ].includes(pathname)
      ? "mt-0"
      : undefined;

  const openContact = (actionId = "default") => {
    setContactActionId(actionId);
    setIsContactOpen(true);
  };

  const activeContactContent = {
    ...contactActionContent.default,
    ...(contactActionContent[contactActionId] ?? {}),
  };

  return (
    <ThemeProvider>
      <ContactActionsProvider onOpen={openContact}>
        <div className="relative w-full min-h-screen overflow-x-hidden">
        <ScrollToTop />
        <SearchHighlightManager />
        <RouteLoadingOverlay />
        <Navbar />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path={routes.home} element={<Home />} />
            <Route path={routes.inlearnAcademy} element={<InlearnAcademy />} />
            <Route path={routes.archives} element={<Archives />} />
            <Route path={routes.article} element={<ArticlePage />} />
            <Route path={routes.partner} element={<PartnerPage />} />
            <Route path={routes.whatWeThink} element={<WhatWeThink />} />
            <Route path={routes.whoWeAre} element={<WhoWeAre />} />
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
        <Footer
          onContactClick={() => openContact("default")}
          topSpacingClassName={footerTopSpacing}
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
