import {useState} from "react";

import Logo from "../assets/Frame 154.svg";
import SunMedium from "../assets/SunMedium.svg";
import SearchIcon from "../assets/Search.svg";
import Vector from "../assets/Vector.svg";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-6">
      <div className="w-[1265px] mx-auto">
        <div
          className={`bg-black/20 backdrop-blur-[3px] border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${
            isDropdownOpen ? "rounded-[34px] bg-zinc-950/80" : "rounded-[50px]"
          }`}
        >
          {/* TOP BAR */}
          <div className="h-[73px] flex items-center px-8">
            {/* LEFT - LOGO */}
            <div className="flex items-center shrink-0">
              <img src={Logo} alt="InnoTech Logo" className="h-9 w-auto" />
            </div>

            {/* CENTER - MENU */}
            <div className="flex-1 flex justify-center">
              <div className="hidden md:flex items-center gap-10">
                {/* WHO WE ARE */}
                <a
                  href="#"
                  className="flex items-center gap-1 text-white font-['Gotham'] text-base hover:text-emerald-400 transition-colors"
                >
                  <span>Who we are</span>
                  <img
                    src={Vector}
                    alt=""
                    className="w-[9px] h-[9px] object-contain translate-y-[1px]"
                  />
                </a>

                {/* WHAT WE DO */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button className="flex items-center gap-1 text-white font-['Gotham'] text-base hover:text-emerald-400 transition-colors">
                    <span>What we do</span>
                    <img
                      src={Vector}
                      alt=""
                      className={`w-[9px] h-[9px] object-contain translate-y-[1px] transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                </div>

                <a
                  href="#"
                  className="text-white font-['Gotham'] text-base hover:text-emerald-400 transition-colors"
                >
                  What we think
                </a>

                <a
                  href="#"
                  className="text-white font-['Gotham'] text-base hover:text-emerald-400 transition-colors"
                >
                  INLEARN Academy
                </a>

                <a
                  href="#"
                  className="text-white font-['Gotham'] text-base hover:text-emerald-400 transition-colors"
                >
                  INSIGHT Store
                </a>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-5">
              {/* LANGUAGE */}
              <button className="flex items-center gap-1 text-white font-['Gotham'] text-base leading-none hover:text-emerald-400 transition-colors">
                <span>En</span>
                <img
                  src={Vector}
                  alt=""
                  className="w-[9px] h-[9px] object-contain translate-y-[1px]"
                />
              </button>

              {/* DIVIDER */}
              <div className="w-[1.5px] h-[21px] bg-white/40" />

              {/* THEME */}
              <button className="group flex items-center justify-center w-[30px] h-[30px] transition-all duration-300">
                <img
                  src={SunMedium}
                  alt="Theme"
                  className="w-[30px] h-[30px] object-contain transition-all duration-300"
                />
              </button>

              {/* DIVIDER */}
              <div className="w-[1.5px] h-[21px] bg-white/40" />

              {/* SEARCH */}
              <button className="group flex items-center justify-center w-6 h-6 transition-all duration-300">
                <img
                  src={SearchIcon}
                  alt="Search"
                  className="w-6 h-6 object-contain transition-all duration-300"
                />
              </button>
            </div>
          </div>

          {/* DROPDOWN - unchanged */}
          <div
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              isDropdownOpen
                ? "max-h-[400px] opacity-100 translate-y-0 pb-10 pt-2"
                : "max-h-0 opacity-0 -translate-y-2 pb-0 pt-0"
            }`}
          >
            <div className="px-10 flex justify-center items-start gap-28">
              {/* CAPABILITY */}
              <div className="py-2 flex justify-center items-start gap-12">
                <div className="text-white text-base font-['Gotham']">
                  Capability:
                </div>
                <div className="w-52 inline-flex flex-col justify-start items-start gap-5">
                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                      INCEPTION
                    </div>
                    <div className="self-stretch text-white/70 text-xs font-['Gotham'] leading-5">
                      Innovation and Technology Management
                    </div>
                  </div>

                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                      INSIGHT
                    </div>
                    <div className="self-stretch text-white/70 text-xs font-['Gotham'] leading-5">
                      Science, Technology, Innovation and Market Analytics
                      Reports
                    </div>
                  </div>

                  <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                      INFINITY
                    </div>
                    <div className="self-stretch text-white/70 text-xs font-['Gotham'] leading-5">
                      Digital Transformation
                    </div>
                  </div>
                </div>
              </div>

              {/* INDUSTRY */}
              <div className="py-2 flex justify-center items-start gap-12">
                <div className="text-white text-base font-['Gotham']">
                  Industry:
                </div>
                <div className="w-52 inline-flex flex-col justify-start items-start gap-5">
                  <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                    Oil, Gas & Petrochemical
                  </div>
                  <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                    Health
                  </div>
                  <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                    Mining
                  </div>
                  <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                    AI & Digital
                  </div>
                  <div className="text-white text-base font-normal font-['Gotham'] hover:text-emerald-400 transition-colors cursor-pointer">
                    Automotive
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
