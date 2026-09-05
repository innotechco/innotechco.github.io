import {lazy, Suspense, useEffect, useRef, useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import {ThemeProvider} from "./providers/theme/ThemeContext.jsx";

import ContactModal from "../shared/components/modals/ContactModal.jsx";
import {useLanguage} from "./providers/language/useLanguage.js";
import {localizedModule} from "../shared/i18n/locale.js";
import {t} from "../shared/i18n/ui.js";
import {ContactActionsProvider} from "./providers/contact-actions/ContactActionsProvider.jsx";
import Footer from "../shared/components/layout/Footer.jsx";
import Navbar from "../shared/components/layout/Navbar.jsx";
import ScrollToTop from "../shared/components/layout/ScrollToTop.jsx";

import {industryRoutes, serviceRoutes, routes} from "./routes.js";

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
  () => import("../features/inlearn-academy/InlearnAcademy.jsx"),
  "inlearn-academy",
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
