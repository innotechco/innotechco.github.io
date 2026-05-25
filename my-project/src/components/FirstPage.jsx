import {useTheme} from "../components/ThemeContext"; 
import bgImage from "../assets/Firstpagepic.jpg";

function FirstPage() {
  const {isDarkMode} = useTheme(); 

  return (
    <section className="relative w-full min-h-[100vh] overflow-hidden z-10">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-125 contrast-110"
        style={{backgroundImage: `url(${bgImage})`}}
      />

      {/* Glass card section */}
      <div className="absolute z-10" style={{left: "120px", top: "205px"}}>
        <div
          className={`w-[577px] h-[477px] px-20 py-16 relative rounded-[40px] inline-flex flex-col justify-start items-start gap-6 overflow-hidden backdrop-blur-[3px] border transition-all duration-500 ease-in-out ${
            isDarkMode
              ? "bg-black/20 border-white/10"
              : "bg-white/30 border-black/20"
          }`}
        >
          {/* AI Agent title */}
          <div className="w-64 h-20 relative mb-6">
            <div className="w-20 h-20 left-0 top-0 absolute rounded-full border-2 border-[#37B478]" />
            <div className="w-3 h-3 left-[4.72px] top-[7.08px] absolute bg-[#37B478] rounded-full" />
            <div
              className={`left-[27px] top-4 absolute text-5xl font-bold font-['Gotham'] leading-none transition-colors duration-500 ease-in-out ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              AI Agent
            </div>
          </div>

          {/* Description text */}
          <div
            className={`text-2xl place-self-auto justify-start font-medium font-['Gotham'] leading-tight mt-6 pr-8 transition-colors duration-500 ease-in-out ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            We leverage the advances in disruptive technologies to enhance
            business.
          </div>

          {/* Read more button and underline */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {}}
              className="group flex w-fit flex-col items-start cursor-pointer transition-all duration-300"
            >
              <div
                className={`text-base font-normal font-['Gotham'] transition-colors duration-300 group-hover:text-[#37B478] ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Read more
              </div>
              <div className="mt-1 h-0.5 w-20 rounded-full bg-[#37B478] transition-all duration-300 group-hover:w-24" />
            </button>
          </div>
        </div>
      </div>

      {/* Navbar spacer */}
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
