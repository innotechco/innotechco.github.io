import bgImage from "../assets/Firstpagepic.jpg";

function FirstPage() {
  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden z-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-125 contrast-110"
        style={{backgroundImage: `url(${bgImage})`}}
      />

      {/* Glass Card */}
      <div className="absolute z-10" style={{left: "120px", top: "205px"}}>
        <div className="w-[577px] h-[477px] px-[110px] py-16 bg-black/20 backdrop-blur-[3px] border border-white/10 rounded-[40px] flex flex-col overflow-hidden">
          {/* AI Agent Title */}
          <div className="w-64 h-20 relative mb-6">
            <div className="w-20 h-20 left-0 top-0 absolute rounded-full border-2 border-[#37B478]" />
            <div className="w-3 h-3 left-[4.72px] top-[7.08px] absolute bg-[#37B478] rounded-full" />
            <div className="left-[27px] top-[16px] absolute text-white text-5xl font-bold font-['Gotham'] leading-none">
              AI Agent
            </div>
          </div>

          {/* Description */}
          <div className="text-white text-2xl font-bold font-['Gotham'] leading-tight mt-6 pr-8">
            We leverage the advances in disruptive technologies to enhance
            business.
          </div>

          {/* Read More */}
          <div className="mt-4">
            <div className="text-white text-base font-bold font-['Gotham'] hover:text-[#37B478] transition-colors cursor-pointer inline-flex items-center gap-3 group">
              Read more
            </div>
            <div className="w-20 h-0.5 mt-1 bg-[#37B478] rounded-full group-hover:w-24 transition-all duration-300" />
          </div>
        </div>
      </div>

      {/* Navbar Space */}
      <div className="relative z-20 pt-6 h-full w-full" />

      <div
        className="bg-black bg-blend-overlay"
        style={{
          width: ".66px",
          height: "817.15px",
          left: "187px",
          top: "115px",
          transform: "rotate(178.04deg)",
          transformOrigin: "top left",
          borderRadius: "9999px",
          opacity: 0.9,
          zIndex: 5,
        }}
      />
    </section>
  );
}

export default FirstPage;
