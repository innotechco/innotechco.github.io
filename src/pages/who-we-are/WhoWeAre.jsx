import {useTheme} from "../../context/useTheme";
import {experts, stats, whoWeAreContent, whoWeAreImages} from "./data";
import CareersSection from "./sections/CareersSection";
import ExpertsSection from "./sections/ExpertsSection";
import HeroSection from "./sections/HeroSection";
import HistorySection from "./sections/HistorySection";
import IntroSection from "./sections/IntroSection";
import StatsSection from "./sections/StatsSection";
import VideoSection from "./sections/VideoSection";
import WhoWeAreBackground from "./components/WhoWeAreBackground";

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
