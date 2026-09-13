import {useState} from "react";

import FooterSVG from "../../assets/brand/logos/footer-decoration-dark.svg";
import FooterSVGDark from "../../assets/brand/logos/footer-decoration-light.svg";
import FooterInnoTech from "../../assets/brand/logos/footer-logo-dark.svg";
import FooterInnoTechDark from "../../assets/brand/logos/footer-logo-light.svg";
import LinkedIn from "../../assets/icons/linkedin-dark.svg";
import LinkedInDark from "../../assets/icons/linkedin-light.svg";
import WhatsApp from "../../assets/icons/whatsapp-dark.svg";
import WhatsAppDark from "../../assets/icons/whatsapp-light.svg";
import {useTheme} from "../../../app/providers/theme/useTheme.js";
import LegalModal from "../modals/LegalModal.jsx";

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

/* "curved" paints the footer with a full-width ellipse and lays the rows over
   it - that is the shape the innotech.global pages use. INLEARN asked for a
   plain rectangle instead, so "flat" drops the ellipse, lets the section itself
   carry the colour, and puts the rows in normal flow. Everything inside the
   rows - links, icons, wording - is shared by both. */
const Footer = ({onContactClick, topSpacingClassName = "", variant = "curved"}) => {
  const {isDarkMode} = useTheme();
  const [activeLegalType, setActiveLegalType] = useState(null);
  const isLightMode = !isDarkMode;
  const isFlat = variant === "flat";

  const textColor = isLightMode ? "text-white" : "text-black";
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";
  /* Curved: the ellipse is the visible footer, so the section behind it takes
     the opposite colour. Flat: the section IS the footer. */
  const surfaceColor = isFlat
    ? isLightMode ? "bg-black" : "bg-white"
    : isLightMode ? "bg-white" : "bg-black";
  /* The curved rows are spaced as a share of the width because the ellipse
     scales with it; a rectangle has no such anchor, so it takes fixed spacing. */
  const topRowSpacing = isFlat
    ? "pt-10 lg:pt-[52px]"
    : "pt-[6%] lg:pt-[8%]";
  const bottomRowSpacing = isFlat
    ? "pb-10 lg:pb-[70px]"
    : "pb-5 sm:pb-6 lg:pb-14";

  const rows = (
    <>
          <div className={`flex items-start justify-between px-6 sm:px-10 lg:px-[125px] ${topRowSpacing}`}>
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

          <div className={`flex items-end justify-between px-6 sm:px-10 lg:px-[125px] ${bottomRowSpacing}`}>
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
    </>
  );

  return (
    <section dir="ltr"
      className={`relative w-full overflow-hidden ${topSpacingClassName} ${surfaceColor}`}
    >
      {isFlat ? (
        <div className="flex min-h-[260px] flex-col justify-between lg:min-h-[340px]">
          {rows}
        </div>
      ) : (
        <div className="relative w-full">
          <img
            loading="lazy"
            src={isLightMode ? FooterSVGDark : FooterSVG}
            className="w-full h-auto"
            alt="footer"
          />

          <div className="absolute inset-0 z-10 flex flex-col justify-between">
            {rows}
          </div>
        </div>
      )}

      <LegalModal type={activeLegalType} onClose={() => setActiveLegalType(null)} />
    </section>
  );
};

export default Footer;
