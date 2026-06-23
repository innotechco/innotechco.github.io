import {useTheme} from "../../../../context/useTheme";
import InnotechEcopic from "../../../../assets/illustrations/InnotechEcopic.svg";
import InnotechEcopicLight from "../../../../assets/illustrations/InnotechEcopicLight.svg";
import ellipseBlack from "../../../../assets/images/home/EllipseBlack.webp";
import ellipseWhite from "../../../../assets/images/home/EllipseWhite.webp";
import InnoCard from "./InnoCard";
import {ecosystemCards} from "./data";

function EcosystemSection() {
  const {isDarkMode} = useTheme();

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

      <div className="relative z-20 mt-[-18%] pb-16 sm:mt-[-25%] lg:mt-[-33%] lg:pb-28">
        <div className="hidden justify-center px-4 pb-16 lg:flex">
          <div className="overflow-hidden max-h-137.5">
            <img loading="lazy"
              src={isDarkMode ? InnotechEcopic : InnotechEcopicLight}
              alt="Innotech Ecosystem"
              className="w-auto h-auto max-w-[90vw] object-contain"
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-35">
          <div className="grid grid-cols-2 items-stretch gap-4 sm:gap-6 lg:flex lg:flex-wrap lg:justify-between lg:items-start">
            {ecosystemCards.map((card) => (
              <InnoCard
                key={card.title}
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
