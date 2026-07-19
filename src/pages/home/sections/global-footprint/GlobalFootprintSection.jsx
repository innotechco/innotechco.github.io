import { useTheme } from "../../../../context/useTheme";
import MapImage from "../../../../assets/images/home/Map.webp";
import MapLightImage from "../../../../assets/images/home/MapLight.webp";
import { globalFootprint } from "./data";

function GlobalFootprintSection() {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`relative z-10 self-stretch px-4 py-14 pb-24 transition-colors duration-500 ease-in-out sm:px-6 md:px-16 lg:min-h-[972px] lg:pb-56 xl:px-[120px] ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      {/* ================= SECTION HEADER ================= */}
      <div className="locale-section-title self-stretch relative flex flex-col justify-center items-start gap-2 mb-12">
        {/* Decorative circle */}
        <div className="locale-section-title-circle size-16 left-[-14px] top-[-19px] absolute rounded-full border border-[#37B478]" />

        {/* Main heading */}
        <div
          className={`self-stretch justify-start font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold transition-colors duration-500 ease-in-out ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {globalFootprint.title}
        </div>

        {/* Subheading */}
        <div
          className={`max-w-[75ch] justify-start font-['Gotham'] text-base font-light transition-colors duration-500 ease-in-out sm:text-lg ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {globalFootprint.description}
        </div>
      </div>

      {/* ================= MAP IMAGE ================= */}
      <div className="w-full flex justify-center overflow-hidden">
        <img
          loading="lazy"
          src={isDarkMode ? MapImage : MapLightImage}
          alt={globalFootprint.imageAlt}
          className={`h-auto w-full max-w-[1100px] object-contain transition-all duration-500 ${
            isDarkMode ? "" : "bg-white"   // مطمئن شدن از بک‌گراند سفید
          }`}
        />
      </div>
    </div>
  );
}

export default GlobalFootprintSection;
