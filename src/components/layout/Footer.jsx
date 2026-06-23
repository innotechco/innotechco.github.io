import {useTheme} from "../../context/useTheme";
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

const Footer = ({
  onContactClick,
  topSpacingClassName = "mt-0 md:mt-0 lg:mt-0",
}) => {
  const {isDarkMode} = useTheme();

  const isLightMode = !isDarkMode;
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";

  return (
    <section
      className={`relative w-full overflow-hidden ${
        isLightMode ? "bg-white" : "bg-black"
      } ${topSpacingClassName} z-20`}
    >
      <div className="relative w-full overflow-hidden">
        <img loading="lazy"
          src={isLightMode ? FooterSVGDark : FooterSVG}
          alt="Footer Background"
          className="h-auto w-full"
        />

        {/* Brand lockup and contact action */}
        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-8 px-6 pt-[9%] sm:px-10 lg:px-[145px]">          <div className="shrink-0">
            <img loading="lazy"
              src={isLightMode ? FooterInnoTechDark : FooterInnoTech}
              alt="InnoTech Logo"
              className="h-auto w-[86px] transition-opacity duration-500 ease-in-out sm:w-[105px] lg:w-[125px]"
            />
          </div>

          <button
            onClick={onContactClick}
            className={`min-h-10 px-4 py-2 
             bg-[#22C55E] hover:bg-[#16A34A] 
             ${greenButtonTextColor} text-sm sm:text-base lg:text-2xl
             font-['Gotham'] 
             rounded-[50px] 
             inline-flex items-center justify-center
             shadow-lg hover:shadow-xl
             transition-all duration-200 active:scale-95`}
          >
            contact us
          </button>
        </div>

        {/* Footer bottom bar */}
        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 sm:px-10 lg:px-[145px] lg:pb-12">          <div className="max-w-[1440px] mx-auto">
            <div className="flex w-full items-center justify-between gap-12">
              {/* Legal links */}
              <div
                className={`flex min-w-0 flex-wrap items-center justify-start gap-x-5 gap-y-3 transition-colors duration-500 ease-in-out sm:gap-x-8 lg:gap-5 ${
                  isLightMode ? "text-white" : "text-black"
                }`}
              >
                {["GDPR", "Cookie Policy"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className="relative cursor-pointer overflow-hidden rounded-full px-0 py-1 transition-all duration-300 group hover:-translate-y-0.5 active:scale-95 sm:px-2 lg:px-4"
                    >
                      <div className="absolute inset-0 bg-green-500 rounded-full scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 active:scale-110 active:opacity-70" />
                      <span
                        className={`relative z-10 font-['Gotham'] text-xs transition-colors duration-300 group-hover:text-white sm:text-sm lg:text-base ${
                          isLightMode ? "text-white" : "text-black"
                        }`}
                      >
                        {item}
                      </span>
                    </div>
                  ),
                )}
              </div>

              {/* Social links */}
              <div className="flex shrink-0 items-center justify-end gap-4 sm:gap-5">
                <div className="relative size-6 cursor-pointer transition-transform hover:scale-110 sm:size-7 lg:size-8">
                  <img loading="lazy"
                    src={isLightMode ? InstagramDark : Instagram}
                    alt="Instagram"
                    className="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                  />
                </div>
                <div className="relative size-6 cursor-pointer transition-transform hover:scale-110 sm:size-7 lg:size-8">
                  <img loading="lazy"
                    src={isLightMode ? LinkedInDark : LinkedIn}
                    alt="LinkedIn"
                    className="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                  />
                </div>
                <div className="relative size-6 cursor-pointer transition-transform hover:scale-110 sm:size-7 lg:size-8">
                  <img loading="lazy"
                    src={isLightMode ? WhatsAppDark : WhatsApp}
                    alt="WhatsApp"
                    className="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
