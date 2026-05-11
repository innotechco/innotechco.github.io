import {useState} from "react";
import Logo from "../assets/Frame 154.svg";

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 pt-4">
      <div className="max-w-[1265px] mx-auto px-4">
        {/* MAIN CONTAINER */}
        <div
          className={`bg-zinc-900/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ease-in-out ${
            isDropdownOpen
              ? "rounded-[34px] bg-zinc-950"
              : "rounded-[50px] h-[73px]"
          }`}
        >
          {/* TOP BAR */}
          <div className="h-[73px] flex items-center justify-between px-8">
            {/* LOGO */}
            <div className="flex items-center">
              <img src={Logo} alt="InnoTech Logo" className="h-9 w-auto" />
            </div>

            {/* MENU */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/90">
              <a
                href="#"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                Who we are
                <span className="text-xs">▼</span>
              </a>

              {/* WRAPPER  */}
              <div
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <button className="hover:text-emerald-400 transition-colors flex items-center gap-1 py-6">
                  What we do
                  <span
                    className={`text-xs transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>
              </div>

              <a href="#" className="hover:text-emerald-400 transition-colors">
                What we think
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                INLEARN Academy
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                INSIGHT Store
              </a>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6 text-white/80">
              <button className="hover:text-emerald-400 transition text-sm flex items-center gap-1">
                En <span className="text-xs">▼</span>
              </button>
              <button className="hover:text-emerald-400 transition text-xl">
                ☀️
              </button>
              <button className="hover:text-emerald-400 transition text-xl">
                🔍
              </button>
            </div>
          </div>

          {/*  DROPDOWN + HOVER ZONE */}
          <div
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
            className={`px-8 overflow-hidden transition-all duration-500 ease-in-out ${
              isDropdownOpen
                ? "max-h-[280px] opacity-100 translate-y-0 pb-8"
                : "max-h-0 opacity-0 -translate-y-2 pb-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-12 pt-2">
              {/* LEFT */}
              <div>
                <p className="text-white/60 text-xs tracking-widest mb-4">
                  Capability:
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-white text-lg font-semibold hover:text-emerald-400 transition-colors">
                      INCEPTION
                    </h3>
                    <p className="text-white/70 text-sm">
                      Innovation and Technology Management
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white text-lg font-semibold hover:text-emerald-400 transition-colors">
                      INSIGHT
                    </h3>
                    <p className="text-white/70 text-sm">
                      Science, Technology, Innovation and Market Analytics
                      Reports
                    </p>
                  </div>

                  <div>
                    <h3 className="text-white text-lg font-semibold hover:text-emerald-400 transition-colors">
                      INFINITY
                    </h3>
                    <p className="text-white/70 text-sm">
                      Digital Transformation
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div>
                <p className="text-white/60 text-xs tracking-widest mb-4">
                  Industry:
                </p>

                <div className="space-y-3 text-white/90">
                  <p className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Oil, Gas & Petrochemical
                  </p>
                  <p className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Health
                  </p>
                  <p className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Mining
                  </p>
                  <p className="hover:text-emerald-400 transition-colors cursor-pointer">
                    AI & Digital
                  </p>
                  <p className="hover:text-emerald-400 transition-colors cursor-pointer">
                    Automotive
                  </p>
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
