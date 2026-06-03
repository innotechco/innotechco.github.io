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
  topSpacingClassName = "-mt-30 md:-mt-40 lg:-mt-24",
}) => {
  const {isDarkMode} = useTheme();

  const isLightMode = !isDarkMode;

  return (
    <section
      className={`relative w-full overflow-hidden ${
        isLightMode ? "bg-white" : "bg-black"
      } ${topSpacingClassName} z-20`}
    >
      <div className="relative w-full">
        <img
          src={isLightMode ? FooterSVGDark : FooterSVG}
          alt="Footer Background"
          className="w-full h-auto block transition-opacity duration-500 ease-in-out"
        />

        {/* Brand lockup and contact action */}
        <div className="absolute inset-0 flex items-center justify-between px-[150px] mb-35">
          <div>
            <img
              src={isLightMode ? FooterInnoTechDark : FooterInnoTech}
              alt="InnoTech Logo"
              className="w-[125px] h-auto transition-opacity duration-500 ease-in-out"
            />
          </div>

          <button
            onClick={onContactClick}
            className="px-4 py-2 
             bg-[#22C55E] hover:bg-[#16A34A] 
             text-white text-2xl 
             font-['Gotham'] 
             rounded-[50px] 
             inline-flex items-center justify-center
             shadow-lg hover:shadow-xl
             transition-all duration-200 active:scale-95"
          >
            contact us
          </button>
        </div>

        {/* Footer bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 lg:pb-12 lg:px-[145px]">
          <div className="max-w-[1440px] mx-auto">
            <div className="self-stretch inline-flex justify-between items-center w-full">
              {/* Legal links */}
              <div
                className={`flex justify-start items-center gap-6 md:gap-8 lg:gap-5 transition-colors duration-500 ease-in-out ${
                  isLightMode ? "text-white" : "text-black"
                }`}
              >
                {["Legal Notice", "Legal Notice", "GDPR", "Cookie Policy"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className="relative cursor-pointer px-4 py-1 rounded-full transition-all duration-300 group hover:-translate-y-0.5 active:scale-95 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-green-500 rounded-full scale-75 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 active:scale-110 active:opacity-70" />
                      <span
                        className={`relative z-10 font-['Gotham'] text-base transition-colors duration-300 group-hover:text-white ${
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
              <div className="flex justify-end items-center gap-5">
                <div className="size-8 relative cursor-pointer hover:scale-110 transition-transform">
                  <img
                    src={isLightMode ? InstagramDark : Instagram}
                    alt="Instagram"
                    className="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                  />
                </div>
                <div className="size-8 relative cursor-pointer hover:scale-110 transition-transform">
                  <img
                    src={isLightMode ? LinkedInDark : LinkedIn}
                    alt="LinkedIn"
                    className="w-full h-full object-contain transition-opacity duration-500 ease-in-out"
                  />
                </div>
                <div className="size-8 relative cursor-pointer hover:scale-110 transition-transform">
                  <img
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
