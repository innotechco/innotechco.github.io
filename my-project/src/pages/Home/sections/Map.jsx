import {useTheme} from "../../../context/useTheme";
import MapImage from "../../../assets/images/home/Map.png";
import MapLightImage from "../../../assets/images/home/MapLight.png";

function Map() {
  const {isDarkMode} = useTheme();

  return (
    <div
      className={`self-stretch min-h-[972px] py-14 pb-56 relative z-10 transition-colors duration-500 ease-in-out ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
      style={{
        paddingLeft: "120px",
        paddingRight: "120px",
      }}
    >
      {/* ================= SECTION HEADER ================= */}
      <div className="self-stretch relative flex flex-col justify-center items-start gap-2 mb-12">
        {/* Decorative circle */}
        <div className="size-16 left-[-14px] top-[-19px] absolute rounded-full border border-[#37B478]" />

        {/* Main heading */}
        <div
          className={`self-stretch justify-start text-4xl font-bold font-['Gotham'] transition-colors duration-500 ease-in-out ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          EXPLORE OUR GLOBAL FOOTPRINT
        </div>

        {/* Subheading */}
        <div
          className={`self-stretch justify-start text-lg font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          Explore our global footprint and connect directly with the
          representative that can support your needs fastest
        </div>
      </div>

      {/* ================= MAP IMAGE ================= */}
      <div className="w-full flex justify-center">
        <img
          src={isDarkMode ? MapImage : MapLightImage}
          alt="Middle East Map"
          className="w-full max-w-[1100px] object-contain transition-opacity duration-500 ease-in-out"
        />
      </div>
    </div>
  );
}

export default Map;
