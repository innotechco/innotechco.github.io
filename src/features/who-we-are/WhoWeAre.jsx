import {useTheme} from "../../app/providers/theme/useTheme.js";
import {experts, stats, whoWeAreContent, whoWeAreImages} from "./who-we-are.content.js";
import CareersSection from "./sections/CareersSection.jsx";
import ExpertsSection from "./sections/ExpertsSection.jsx";
import HeroSection from "./sections/HeroSection.jsx";
import HistorySection from "./sections/HistorySection.jsx";
import IntroSection from "./sections/IntroSection.jsx";
import StatsSection from "./sections/StatsSection.jsx";
import VideoSection from "./sections/VideoSection.jsx";
import WhoWeAreBackground from "./components/WhoWeAreBackground.jsx";

function WhoWeAre() {
  const {isDarkMode} = useTheme();
  const pageBackground = isDarkMode ? "bg-[#050505]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const invertedTextColor = isDarkMode ? "text-black" : "text-white";
  const inverseCardBackground = isDarkMode ? "bg-white" : "bg-black";
  const historyImage = isDarkMode
    ? whoWeAreImages.historyDark
    : whoWeAreImages.historyLight;

  return (
    <main
      className={`relative isolate w-full overflow-hidden pt-30 font-['Gotham'] transition-colors duration-500 ${pageBackground}`}
    >
      <WhoWeAreBackground images={whoWeAreImages} isDarkMode={isDarkMode} />
      <div className="relative z-10">
        <HeroSection content={whoWeAreContent.hero} textColor={textColor} />
        <IntroSection
          content={whoWeAreContent.intro}
          image={whoWeAreImages.intro}
          textColor={textColor}
          isDarkMode={isDarkMode}
        />
        <HistorySection
          content={whoWeAreContent.history}
          image={historyImage}
          textColor={textColor}
        />
        <StatsSection stats={stats} isDarkMode={isDarkMode} />
        <VideoSection
          ariaLabel={whoWeAreContent.video.playLabel}
          icon={whoWeAreImages.circlePlay}
          isDarkMode={isDarkMode}
        />
        <ExpertsSection
          experts={experts}
          image={whoWeAreImages.expert}
          isDarkMode={isDarkMode}
          textColor={textColor}
          title={whoWeAreContent.expertsTitle}
        />
        <CareersSection
          content={whoWeAreContent.careers}
          image={whoWeAreImages.careers}
          invertedTextColor={invertedTextColor}
          inverseCardBackground={inverseCardBackground}
        />
      </div>
    </main>
  );
}

export default WhoWeAre;
