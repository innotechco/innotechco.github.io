import { useTheme } from "../../context/useTheme";
import FooterSVG from "../../assets/logos/FooterFirstPage.svg";
import FooterSVGDark from "../../assets/logos/FooterFirstPageDark.svg";
import FooterInnoTech from "../../assets/logos/FooterInnoTech.svg";
import FooterInnoTechDark from "../../assets/logos/FooterInnoTechDark.svg";
import Instagram from "../../assets/icons/Instagram.svg";
import InstagramDark from "../../assets/icons/InstagramDark.svg";
import LinkedIn from "../../assets/icons/Linkdin.svg";
import LinkedInDark from "../../assets/icons/LinkdinDark.svg";
import WhatsApp from "../../assets/icons/WhatsApp.svg";
import WhatsAppDark from "../../assets/icons/WhatsAppDark.svg";

const Footer = ({ onContactClick }) => {
  const { isDarkMode } = useTheme();
  const isLightMode = !isDarkMode;

  const textColor = isLightMode ? "text-white" : "text-black";
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";

  return (
    <section
      className={`relative w-full overflow-hidden ${
        isLightMode ? "bg-white" : "bg-black"
      }`}
    >
      <div className="relative w-full">

        {/* Background */}
        <img
          src={isLightMode ? FooterSVGDark : FooterSVG}
          className="w-full h-auto"
          alt="footer"
        />

        {/* Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between z-10">

          {/* TOP */}
          <div className="flex justify-between items-start px-6 sm:px-10 lg:px-[125px] pt-[6%] lg:pt-[8%]">
            {/* Logo */}
            <img
              src={isLightMode ? FooterInnoTechDark : FooterInnoTech}
              className="w-[90px] sm:w-[110px] lg:w-[125px]"
              alt="logo"
            />

            {/* Contact */}
            <button
              onClick={onContactClick}
              className={`px-5 py-2 bg-[#22C55E] rounded-full
              text-sm sm:text-base lg:text-xl
              ${greenButtonTextColor}
              transition-all active:scale-95`}
            >
              contact us
            </button>
          </div>

          {/* BOTTOM */}
          <div
            className="
              flex justify-between items-end
              px-6 sm:px-10 lg:px-[125px]
              pb-6 sm:pb-6 lg:pb-14
            "
          >

            {/* LEFT → TEXTS (now swapped) */}
            <div className={`flex flex-row gap-6 sm:gap-10 lg:gap-12 ${textColor}`}>
              <span className="whitespace-nowrap text-xs sm:text-sm lg:text-base cursor-pointer">
                GDPR
              </span>
              <span className="whitespace-nowrap text-xs sm:text-sm lg:text-base cursor-pointer">
                Cookie Policy
              </span>
            </div>

            {/* RIGHT → ICONS (swapped) */}
            <div className="flex gap-4 sm:gap-5">
              <img src={isLightMode ? InstagramDark : Instagram} className="w-6 h-6 lg:w-8 lg:h-8" />
              <img src={isLightMode ? LinkedInDark : LinkedIn} className="w-6 h-6 lg:w-8 lg:h-8" />
              <img src={isLightMode ? WhatsAppDark : WhatsApp} className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
