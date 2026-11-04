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

/* The bird is drawn here rather than loaded as a pair of light/dark files: it
   is one path, and currentColor makes it follow the row's colour in both
   themes without a second asset to keep in sync. */
function TwitterIcon({className = ""}) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723 9.99 9.99 0 0 1-3.127 1.184 4.92 4.92 0 0 0-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 0 0-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 0 1-2.228-.616v.061a4.923 4.923 0 0 0 3.946 4.827 4.996 4.996 0 0 1-2.212.085 4.936 4.936 0 0 0 4.604 3.417 9.867 9.867 0 0 1-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0 0 7.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.935 9.935 0 0 0 2.46-2.548z" />
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
  "inline-flex h-7 w-[72px] items-center justify-center whitespace-nowrap rounded-full px-1 text-center text-[9px] leading-none transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-[#00C965] hover:text-black hover:shadow-[0_10px_24px_rgba(0,201,101,0.34)] active:translate-y-0.5 active:scale-95 min-[360px]:w-[90px] min-[360px]:px-1.5 min-[360px]:text-[10px] min-[400px]:w-[100px] sm:w-[108px] sm:px-2 sm:text-xs lg:h-8 lg:w-[118px] lg:text-sm";

const footerIconClassName =
  "flex size-6 shrink-0 items-center justify-center rounded-full text-current transition-transform duration-300 hover:scale-110 active:scale-95 min-[440px]:size-7 sm:size-8 lg:size-10";

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
     scales with it. The flat one has no such anchor, so it says the same thing
     in steps: the same spacing on a monitor, less of it on a phone. */
  const topRowSpacing = isFlat
    ? "pt-8 sm:pt-8 lg:pt-[52px]"
    : "pt-[6%] lg:pt-[8%]";
  const bottomRowSpacing = isFlat
    ? "pb-8 sm:pb-8 lg:pb-[70px]"
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
            <div className={`footer-legal-links grid grid-cols-2 place-items-center gap-x-1.5 gap-y-2.5 min-[360px]:gap-x-2 min-[400px]:gap-x-3 sm:max-w-[54%] sm:gap-x-6 sm:gap-y-2 md:max-w-none md:grid-cols-4 md:gap-x-4 md:gap-y-0 lg:gap-x-5 xl:gap-x-6 2xl:gap-x-8 ${textColor}`}>
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

            <div className={`flex shrink-0 items-center gap-1 min-[440px]:gap-2 sm:gap-3 lg:gap-4 ${textColor}`}>
              <a
                href="mailto:Info@innotech.global"
                className={footerIconClassName}
                aria-label="Email INNOTECH"
              >
                <EmailIcon className="size-4 min-[440px]:size-5 sm:size-6 lg:size-8" />
              </a>
              <a
                href="https://www.linkedin.com/company/innotech-management-consulting-co/"
                target="_blank"
                rel="noreferrer"
                className={footerIconClassName}
                aria-label="Open INNOTECH on LinkedIn"
              >
                <img loading="lazy" src={isLightMode ? LinkedInDark : LinkedIn} className="size-4 min-[440px]:size-5 sm:size-6 lg:size-8" alt="" />
              </a>
              <a
                href="https://wa.me/971543191316"
                target="_blank"
                rel="noreferrer"
                className={footerIconClassName}
                aria-label="Open WhatsApp chat"
              >
                <img loading="lazy" src={isLightMode ? WhatsAppDark : WhatsApp} className="size-4 min-[440px]:size-5 sm:size-6 lg:size-8" alt="" />
              </a>
              <a
                href="https://x.com/Innotechinsight"
                target="_blank"
                rel="noreferrer"
                className={footerIconClassName}
                aria-label="Open INNOTECH on Twitter"
              >
                <TwitterIcon className="size-4 min-[440px]:size-5 sm:size-6 lg:size-8" />
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
        /* The curved footer is a picture, so its height has always been a share
           of the window's width - 36 per cent of it, at every size. This one
           held a fixed 260px, which is the same footer on a monitor and half a
           phone screen of empty black on a phone.

           From a tablet up it follows the width the same way, with the old 340
           as its ceiling. On a phone it holds no height at all and lets the two
           rows say how tall it is: a minimum any shorter than the rows need
           presses them together, and a minimum taller than the screen deserves
           is the empty block this started as. The gap keeps them apart either
           way. */
        <div className="flex min-h-0 flex-col justify-between gap-7 sm:min-h-[clamp(190px,24vw,340px)] sm:gap-0">
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
