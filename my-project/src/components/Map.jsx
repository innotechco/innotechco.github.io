import MapImage from "../assets/Map.png";

function Map() {
  return (
    <div
      className="self-stretch min-h-[972px] py-14 pb-56 relative z-10 bg-black"
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
        <div className="self-stretch justify-start text-white text-4xl font-normal font-['Gotham']">
          Explore our global footprint.
        </div>

        {/* Subheading */}
        <div className="self-stretch justify-start text-white text-lg font-light font-['Gotham']">
          Explore our global footprint and connect directly with the
          representative that can support your needs fastest.
        </div>
      </div>

      {/* ================= MAP IMAGE ================= */}
      <div className="w-full flex justify-center">
        <img
          src={MapImage}
          alt="Middle East Map"
          className="w-full max-w-[1100px] object-contain"
        />
      </div>
    </div>
  );
}

export default Map;
