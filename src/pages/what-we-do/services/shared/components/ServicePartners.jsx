import {Link} from "react-router-dom";

import {useTheme} from "../../../../../context/useTheme";
import {routes} from "../../../../../routes";

function ChevronRight() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 6L15 12L9 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PartnerCard({partner, isDarkMode}) {
  const imageClassName = partner.imageClassName ?? "max-h-14 max-w-[137px]";
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";
  const logoImage = isDarkMode ? partner.darkImage ?? partner.image : partner.image;
  const cardSurfaceClassName = isDarkMode
    ? partner.darkCardClassName ?? "bg-white"
    : partner.lightCardClassName ?? "bg-white";

  return (
    <Link
      to={routes.partner.replace(":slug", partner.id)}
      className={`group relative h-[58px] w-full max-w-[132px] basis-[calc(45%-12px)] overflow-hidden rounded-2xl ${cardSurfaceClassName} ${
        isDarkMode ? "" : "border border-black"
      } max-[640px]:h-[54px] max-[640px]:max-w-[120px] max-[640px]:basis-[calc(48%-12px)] max-[490px]:h-[50px] max-[490px]:max-w-[110px] max-[490px]:basis-[calc(50%-12px)] max-[390px]:h-[46px] max-[390px]:max-w-[100px] max-[390px]:basis-[calc(47%-12px)] sm:h-[68px] sm:max-w-[172px] sm:basis-[calc(33.333%-12px)]`}
      title={partner.name}
    >
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ease-out group-hover:right-11 group-hover:-translate-x-1 group-hover:scale-90">
        <img loading="lazy"
          src={logoImage}
          alt={partner.name}
          className={`block object-contain ${imageClassName} max-h-[62%] max-w-[62%] max-[640px]:max-h-[55%] max-[640px]:max-w-[55%] max-[490px]:max-h-[50%] max-[490px]:max-w-[50%] max-[390px]:max-h-[46%] max-[390px]:max-w-[46%] sm:max-h-[60%] sm:max-w-[60%] md:max-h-[72%] md:max-w-[78%]`}
        />
      </div>

      <div className={`absolute inset-y-0 -right-11 flex w-11 items-center justify-center bg-[#37B478] ${greenButtonTextColor} transition-transform duration-300 ease-out group-hover:-translate-x-11`}>
        <ChevronRight />
      </div>
    </Link>
  );
}

function ServicePartners({service, partners}) {
  const {isDarkMode} = useTheme();

  return (
    <section
      className={`w-full overflow-hidden px-6 py-[60px] md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-[46px]">
        <header className="flex flex-col items-center justify-center gap-2 text-center">
          <span className="size-6 rounded-full bg-[#37B478]" />
          <h2
            className={`font-['Gotham'] text-3xl font-bold uppercase md:text-4xl ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Our {service} Partners
          </h2>
        </header>

        <div className="flex w-full flex-wrap items-center justify-center gap-4 sm:gap-7 lg:gap-[46px]">
          {partners.map((partner) => (
            <PartnerCard
              key={partner.name}
              partner={partner}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicePartners;
