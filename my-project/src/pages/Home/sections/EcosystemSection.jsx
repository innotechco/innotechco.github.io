import {useTheme} from "../../../context/useTheme";
import InnotechEcopic from "../../../assets/illustrations/InnotechEcopic.svg";
import InnotechEcopicLight from "../../../assets/illustrations/InnotechEcopicLight.svg";
import ellipseBlack from "../../../assets/images/home/EllipseBlack.png";
import ellipseWhite from "../../../assets/images/home/EllipseWhite.png";
import InnoCard from "../components/InnoCard";
import {ecosystemCards} from "../data/ecosystemCards";

function EcosystemSection() {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`relative w-full ${isDarkMode ? "bg-black" : "bg-white"}`}
    >
      <div className="-mt-20 relative z-10 w-full overflow-x-hidden">
        <img
          src={isDarkMode ? ellipseBlack : ellipseWhite}
          alt="Ellipse Background"
          className="w-full block"
        />
      </div>

      <div className="relative z-20 mt-[-38%] lg:mt-[-33%] pb-28">
        <div className="flex justify-center pb-16 px-4">
          <div className="overflow-hidden max-h-137.5">
            <img
              src={isDarkMode ? InnotechEcopic : InnotechEcopicLight}
              alt="Innotech Ecosystem"
              className="w-auto h-auto max-w-[90vw] object-contain"
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[1600px] px-7 lg:px-35">
          <div className="flex flex-wrap justify-between items-start gap-6">
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
