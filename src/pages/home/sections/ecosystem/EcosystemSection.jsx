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

      <div className="relative z-20 mt-[-26%] pb-16 sm:mt-[-30%] lg:mt-[-36%] lg:pb-28">
        <div className="hidden justify-center px-4 pb-10 lg:flex xl:pb-16">
          <div className="overflow-hidden max-h-">
            <img loading="lazy"
              src={isDarkMode ? InnotechEcopic : InnotechEcopicLight}
              alt="Innotech Ecosystem"
              className="w-auto h-auto max-w-[90vw] object-contain"
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8 min-[1400px]:px-35">
          <div className="mx-auto grid max-w-[900px] grid-cols-2 items-stretch gap-4 lg:max-w-none lg:grid-cols-4 lg:gap-5 min-[1400px]:flex min-[1400px]:justify-between min-[1400px]:items-start xl:mx-auto">
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
