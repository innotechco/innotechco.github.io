import {useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";

import {useTheme} from "../../../../context/useTheme";
import {fetchPartnerPage} from "../../../../services/contentApi";
import PartnerHeroSection from "./shared/sections/PartnerHeroSection";
import PartnerIntroSection from "./shared/sections/PartnerIntroSection";
import PartnerStatsSection from "./shared/sections/PartnerStatsSection";
import PartnerToolsSection from "./shared/sections/PartnerToolsSection";

function PartnerPage() {
  const {slug} = useParams();
  const {isDarkMode} = useTheme();
  const [result, setResult] = useState({
    page: null,
    slug: null,
    status: "loading",
  });

  useEffect(() => {
    let isActive = true;

    fetchPartnerPage(slug)
      .then((page) => {
        if (!isActive) return;
        setResult({
          page,
          slug,
          status: page ? "ready" : "not-found",
        });
      })
      .catch(() => {
        if (!isActive) return;
        setResult({page: null, slug, status: "not-found"});
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  const page = result.slug === slug ? result.page : null;
  const status = result.slug === slug ? result.status : "loading";
  const pageBackground = isDarkMode ? "bg-[#050505]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  const content = useMemo(() => page, [page]);

  if (status === "not-found") {
    return (
      <main className={`min-h-screen px-6 py-40 ${pageBackground}`}>
        <h1 className={`font-['Gotham'] text-5xl font-bold ${textColor}`}>
          Partner not found
        </h1>
      </main>
    );
  }

  if (!content) {
    return (
      <main className={`min-h-screen px-6 py-40 ${pageBackground}`}>
        <p className={`font-['Gotham'] text-xl ${textColor}`}>Loading partner...</p>
      </main>
    );
  }

  return (
    <main
      className={`min-h-screen overflow-hidden font-['Gotham'] transition-colors duration-500 ${pageBackground}`}
    >
      <PartnerHeroSection
        assets={content.assets}
        content={content}
        isDarkMode={isDarkMode}
      />
      <PartnerIntroSection
        assets={content.assets}
        content={content}
        isDarkMode={isDarkMode}
      />
      <PartnerStatsSection
        assets={content.assets}
        content={content}
        isDarkMode={isDarkMode}
      />
      <PartnerToolsSection
        assets={content.assets}
        content={content}
        isDarkMode={isDarkMode}
      />
    </main>
  );
}

export default PartnerPage;
