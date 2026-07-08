import {lazy, Suspense, useState} from "react";
import {Routes, Route, useLocation} from "react-router-dom";

import {ThemeProvider} from "./context/ThemeContext";

import ContactModal from "./components/modals/ContactModal";
import contactActionContent from "./content/en/contact-actions/contact-actions.json";
import {ContactActionsProvider} from "./context/ContactActionsProvider";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import ScrollToTop from "./components/layout/ScrollToTop";

import {industryRoutes, serviceRoutes, routes} from "./routes";

const Home = lazy(() => import("./pages/home/Home"));
const InlearnAcademy = lazy(() =>
  import("./pages/inlearn-academy/InlearnAcademy"),
);
const Archives = lazy(() => import("./pages/what-we-think/archives/Archives"));
const ArticlePage = lazy(() => import("./pages/articles/ArticlePage"));
const PartnerPage = lazy(() =>
  import("./pages/what-we-do/services/partners/PartnerPage"),
);
const WhatWeThink = lazy(() => import("./pages/what-we-think/WhatWeThink"));
const WhoWeAre = lazy(() => import("./pages/who-we-are/WhoWeAre"));
const Inception = lazy(() =>
  import("./pages/what-we-do/services/inception/Inception"),
);
const Insight = lazy(() =>
  import("./pages/what-we-do/services/insight/Insight"),
);
const InfinityPage = lazy(() =>
  import("./pages/what-we-do/services/infinity/Infinity"),
);
const Automotive = lazy(() =>
  import("./pages/what-we-do/industries/automotive/Automotive"),
);
const EnergyAndMaterials = lazy(() =>
  import("./pages/what-we-do/industries/energy-and-materials/EnergyAndMaterials"),
);
const Health = lazy(() =>
  import("./pages/what-we-do/industries/health/Health"),
);
const HighTech = lazy(() =>
  import("./pages/what-we-do/industries/high-tech/HighTech"),
);
const MetalsAndMining = lazy(() =>
  import("./pages/what-we-do/industries/metals-and-mining/MetalsAndMining"),
);

function RouteFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-6 pt-28 text-white">
      <div className="flex items-center gap-3 font-['Gotham'] text-sm uppercase tracking-[0.18em] text-white/70">
        <span className="size-3 rounded-full bg-[#37B478]" />
        <span>Loading</span>
      </div>
    </main>
  );
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
          contentOverrides={activeContactContent}
        />
        </div>
      </ContactActionsProvider>
    </ThemeProvider>
  );
}

export default App;
