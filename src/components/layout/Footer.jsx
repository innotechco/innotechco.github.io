import {useState} from "react";

import FooterSVG from "../../assets/logos/FooterFirstPage.svg";
import FooterSVGDark from "../../assets/logos/FooterFirstPageDark.svg";
import FooterInnoTech from "../../assets/logos/FooterInnoTech.svg";
import FooterInnoTechDark from "../../assets/logos/FooterInnoTechDark.svg";
import LinkedIn from "../../assets/icons/Linkdin.svg";
import LinkedInDark from "../../assets/icons/LinkdinDark.svg";
import WhatsApp from "../../assets/icons/WhatsApp.svg";
import WhatsAppDark from "../../assets/icons/WhatsAppDark.svg";
import {useTheme} from "../../context/useTheme";
import LegalModal from "../modals/LegalModal";

function EmailIcon({className = ""}) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect x="4.5" y="7.5" width="23" height="17" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6.5 10.5L16 17.5L25.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const legalLinks = [
  {label: "GDPR", type: "gdpr"},
  {label: "Cookie Policy", type: "cookies"},
  {label: "Privacy Policy", type: "privacy"},
  {label: "Terms of Use", type: "terms"},
];

const footerTextLinkClassName =
  "inline-flex h-7 w-[92px] items-center justify-center whitespace-nowrap rounded-full px-2 text-center text-[10px] leading-none transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#00C965] hover:text-black hover:shadow-[0_10px_24px_rgba(0,201,101,0.34)] active:translate-y-0.5 active:scale-95 sm:w-[108px] sm:text-xs lg:h-8 lg:w-[118px] lg:text-sm";

const footerIconClassName =
  "flex size-8 items-center justify-center rounded-full text-current transition-transform duration-300 hover:scale-110 active:scale-95 lg:size-10";

const Footer = ({onContactClick, topSpacingClassName = ""}) => {
  const {isDarkMode} = useTheme();
  const [activeLegalType, setActiveLegalType] = useState(null);
  const isLightMode = !isDarkMode;

  const textColor = isLightMode ? "text-white" : "text-black";
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";

  return (
    <section
      className={`relative w-full overflow-hidden ${topSpacingClassName} ${
        isLightMode ? "bg-white" : "bg-black"
      }`}
    >
      <div className="relative w-full">
        <img
          loading="lazy"
          src={isLightMode ? FooterSVGDark : FooterSVG}
          className="w-full h-auto"
          alt="footer"
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-between">
          <div className="flex items-start justify-between px-6 pt-[6%] sm:px-10 lg:px-[125px] lg:pt-[8%]">
            <img
              loading="lazy"
              src={isLightMode ? FooterInnoTechDark : FooterInnoTech}
              className="w-[90px] sm:w-[110px] lg:w-[125px]"
              alt="logo"
            />

            <button
              onClick={onContactClick}
              className={`rounded-full bg-[#22C55E] px-5 py-2 text-sm transition-all active:scale-95 sm:text-base lg:text-xl ${greenButtonTextColor}`}
            >
              contact us
            </button>
          </div>

          <div className="flex items-end justify-between px-6 pb-5 sm:px-10 sm:pb-6 lg:px-[125px] lg:pb-14">
            <div className={`footer-legal-links grid max-w-[58%] grid-cols-2 place-items-center gap-x-4 gap-y-2 sm:max-w-[54%] sm:gap-x-6 md:max-w-none md:grid-cols-4 md:gap-x-4 md:gap-y-0 lg:gap-x-5 xl:gap-x-6 2xl:gap-x-8 ${textColor}`}>
              {legalLinks.map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setActiveLegalType(item.type)}
                  className={footerTextLinkClassName}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className={`flex gap-3 sm:gap-4 ${textColor}`}>
              <a
                href="mailto:Info@innotech.global"
                className={footerIconClassName}
                aria-label="Email INNOTECH"
              >
                <EmailIcon className="size-6 lg:size-8" />
              </a>
              <a
                href="https://www.linkedin.com/company/innotech-management-consulting-co/"
                target="_blank"
                rel="noreferrer"
                className={footerIconClassName}
                aria-label="Open INNOTECH on LinkedIn"
              >
                <img loading="lazy" src={isLightMode ? LinkedInDark : LinkedIn} className="size-6 lg:size-8" alt="" />
              </a>
              <a
                href="https://wa.me/971543191316"
                target="_blank"
                rel="noreferrer"
                className={footerIconClassName}
                aria-label="Open WhatsApp chat"
              >
                <img loading="lazy" src={isLightMode ? WhatsAppDark : WhatsApp} className="size-6 lg:size-8" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <LegalModal type={activeLegalType} onClose={() => setActiveLegalType(null)} />
    </section>
  );
};

export default Footer;
