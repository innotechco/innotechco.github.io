import {useTheme} from "../../../../app/providers/theme/useTheme.js";
import {ecosystemEcosystemMapDark as InnotechEcopic} from "../../home.assets.js";
import {ecosystemEcosystemMapLight as InnotechEcopicLight} from "../../home.assets.js";
import {ecosystemCurveDark as ellipseBlack} from "../../home.assets.js";
import {ecosystemCurveLight as ellipseWhite} from "../../home.assets.js";
import InnoCard from "./InnoCard.jsx";
import {useHomeContent} from "../../../../app/providers/home-content/useHomeContent.js";

function EcosystemSection() {
  const {isDarkMode} = useTheme();
  const {content} = useHomeContent();
  const ecosystemCards = content.ecosystemCards;

  return (
    <section
      className={`relative w-full ${isDarkMode ? "bg-black" : "bg-white"}`}
    >
      <div className="-mt-20 relative z-10 w-full overflow-x-hidden">
        <img loading="lazy"
          src={isDarkMode ? ellipseBlack : ellipseWhite}
          alt="Ellipse Background"
          className="w-full block"
        />
      </div>

      <div className="relative z-20 mt-[-26%] pb-16 sm:mt-[-30%] lg:mt-[-36%] lg:pb-28">
        <div className="home-ecosystem-art hidden justify-center px-4 pb-10 lg:flex xl:pb-16">
          <div className="overflow-hidden max-h-">
            <img loading="lazy"
              src={isDarkMode ? InnotechEcopic : InnotechEcopicLight}
              alt="INNOTECH Ecosystem"
              className="w-auto h-auto max-w-[90vw] object-contain"
            />
          </div>
        </div>

        <div className="home-ecosystem-cards mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 min-[1400px]:px-35">
          <div style={{"--endpoint-offset": isDarkMode ? 0 : 22 / 5060}} className="home-ecosystem-grid mx-auto grid max-w-[900px] grid-cols-2 items-stretch gap-4 lg:max-w-none lg:grid-cols-4 lg:gap-5 min-[1400px]:flex min-[1400px]:items-stretch min-[1400px]:justify-between xl:mx-auto">
            {ecosystemCards.map((card, index) => (
              <InnoCard
                key={card.title}
                iconKey={["INCEPTION", "INFINITY", "INSIGHT", "INLEARN"][index]}
                title={card.title}
                subtitle={card.subtitle}
                items={card.items}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default EcosystemSection;
