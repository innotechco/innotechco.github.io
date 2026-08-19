import {useTheme} from "../../context/useTheme";
import RfpForm from "./components/RfpForm";
import RfpHeroSection from "./sections/RfpHeroSection";
import {getRfpContent} from "./data";

const rfpContent = getRfpContent();

function RequestForProposal() {
  const {isDarkMode} = useTheme();
  const pageBackground = isDarkMode ? "bg-[#050505]" : "bg-white";
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <main
      className={`relative isolate w-full overflow-x-hidden pt-30 font-['Gotham'] transition-colors duration-500 ${pageBackground}`}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1265px] flex-col items-center px-4 pb-24 sm:px-6 lg:px-10">
        <RfpHeroSection
          content={rfpContent.hero}
          isDarkMode={isDarkMode}
          textColor={textColor}
        />

        <div className="w-full min-w-0 max-w-[860px]">
          <RfpForm content={rfpContent} isDarkMode={isDarkMode} />
        </div>
      </div>
    </main>
  );
}

export default RequestForProposal;
