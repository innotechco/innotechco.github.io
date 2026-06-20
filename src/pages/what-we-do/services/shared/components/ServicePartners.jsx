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
      className={`group relative h-[68px] w-[172px] overflow-hidden rounded-2xl ${cardSurfaceClassName} ${
        isDarkMode ? "" : "border border-black"
      }`}
      title={partner.name}
    >
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center transition-all duration-300 ease-out group-hover:right-11 group-hover:-translate-x-1 group-hover:scale-90">
        <img loading="lazy"
          src={logoImage}
          alt={partner.name}
          className={`object-contain ${imageClassName}`}
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

        <div className="flex w-full flex-wrap items-center justify-center gap-[46px]">
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
