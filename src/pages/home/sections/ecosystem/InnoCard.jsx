import {useTheme} from "../../../../context/useTheme";
import InceptionIcon from "../../../../assets/icons/Inception-Icon 1.svg";
import InfinityIcon from "../../../../assets/icons/Subtract.svg";
import InsightIcon from "../../../../assets/icons/Subtract2.svg";
import InlearnIcon from "../../../../assets/icons/Subtract3.svg";

const INNO_CARD_TEXT_STYLES = {
  title: "text-base font-bold leading-none",
  subtitle: "mt-1 text-xs font-normal",
  itemLabel: "text-sm font-normal",
  itemDescription: "text-xs font-light leading-tight",
};


function InnoCard({title, subtitle, items = []}) {
  const {isDarkMode} = useTheme();

  const iconMap = {
    INCEPTION: InceptionIcon,
    INFINITY: InfinityIcon,
    INSIGHT: InsightIcon,
    INLEARN: InlearnIcon,
  };

  
  const CurrentIcon = iconMap[title];

  const boldKeywords = [
    "INCEPTION",
    "ISO56000 Standard",
    "ITONICS",
    "BRIGHTIDEA",
    "Digital Transformation",
    "AI Agent",
    "INSIGHT",
    "INFINITY",
    "Patent Landscape",
    "Market Research Reports",
    "Opportunity Study",
    "INLEARN",
    "3-Minute Insights",
    "Webinars",
    "Workshops",
    "Assistant",
    "Reports",
  ];

  const renderBoldText = (text) => {
    let formatted = text;
    boldKeywords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "g");
      formatted = formatted.replace(regex, "<strong>$1</strong>");
    });
    return formatted;
  };

  const textColor = isDarkMode ? "text-white" : "text-black";
  const subtitleColor = isDarkMode ? "text-white/80" : "text-black/70";
  const bulletColor = isDarkMode ? "border-[#37B478]" : "border-[#37B478]";
  const lineColor = isDarkMode ? "outline-[#37B478]" : "outline-[#37B478]";
  const lineBlur = isDarkMode ? "blur-[2px]" : "blur-[1px]";

  const iconFilter = isDarkMode
    ? ""
    : "brightness(0) saturate(100%) invert(56%) sepia(37%) saturate(908%) hue-rotate(90deg) brightness(92%) contrast(91%)";

  const cardBg = isDarkMode
    ? "bg-green-500/5 border-green-500/10 hover:bg-green-500/10 hover:border-emerald-400/40"
    : "bg-neutral-200/30 border-green-500/20 hover:bg-neutral-200/50 hover:border-green-500/40";

  const cardShadow = isDarkMode
    ? "shadow-[inset_1px_-1px_2px_0px_rgba(29,95,63,1.00)] shadow-[0_0_35px_-5px_rgba(55,180,120,0.35),0_0_60px_-10px_rgba(55,180,120,0.25)] hover:shadow-[0_0_30px_-8px_rgba(16,185,129,0.45),0_0_50px_-12px_rgba(52,211,153,0.25),inset_1px_-1px_2px_0px_rgba(29,95,63,1.00)]"
    : "shadow-[inset_1px_-1px_2px_0px_rgba(224,224,224,1.00)] hover:shadow-[0_0_30px_-8px_rgba(0,0,0,0.1),inset_1px_-1px_2px_0px_rgba(224,224,224,1.00)]";

  const beforeGradient = isDarkMode
    ? "before:from-emerald-400/8"
    : "before:from-emerald-400/8";

  return (
    <div
      className={`
        relative 
        w-full min-h-[390px] sm:min-h-[400px] lg:-mt-14 lg:w-65 lg:h-100
        px-4 py-5 sm:px-6 lg:px-8 lg:py-6
        rounded-[30px] lg:rounded-[50px]
        border 
        ${cardBg}
        ${cardShadow}
        inline-flex flex-col justify-start items-center gap-4 
        overflow-hidden flex-shrink-0 cursor-pointer
        transition-all duration-500 ease-out

        hover:-translate-y-2
        hover:translate-x-1
        hover:ring-1 hover:ring-emerald-400/20

        before:absolute before:inset-0 
        before:bg-gradient-to-br 
        ${beforeGradient}
        before:via-transparent 
        before:to-transparent
        before:opacity-0 hover:before:opacity-100 
        before:transition-opacity before:duration-500
        before:rounded-[30px] lg:before:rounded-[50px] before:-z-10
      `}
    >
      <div className="flex flex-col justify-start items-center gap-4">
        <div className="inline-flex justify-start items-center gap-3">
          <div className="size-9 relative overflow-hidden shrink-0 transition-all duration-500 ease-in-out">
            <img loading="lazy"
              src={CurrentIcon}
              alt={`${title} Icon`}
              className={`size-9 object-contain transition-all duration-500 ease-in-out ${iconFilter}`}
              style={
                !isDarkMode
                  ? {
                      filter:
                        "brightness(0) saturate(100%) invert(56%) sepia(37%) saturate(908%) hue-rotate(90deg) brightness(92%) contrast(91%)",
                    }
                  : {}
              }
            />
          </div>

          <div className="flex flex-col justify-start items-start">
            <div
              className={`${textColor} ${INNO_CARD_TEXT_STYLES.title} font-['Gotham'] transition-colors duration-500 ease-in-out`}
              dangerouslySetInnerHTML={{__html: renderBoldText(title)}}
            />
            <div
              className={`${subtitleColor} ${INNO_CARD_TEXT_STYLES.subtitle} font-['Gotham'] transition-colors duration-500 ease-in-out`}
            >
              {subtitle}
            </div>
          </div>
        </div>

        <div
          className={`h-0 w-full max-w-44 rounded-[50px] outline-2 -outline-offset-1 ${lineColor} ${lineBlur} transition-all duration-500 ease-in-out`}
        />
      </div>

      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="self-stretch flex flex-col justify-start items-start gap-1"
          >
            <div className="self-stretch inline-flex justify-start items-start gap-1">
              <div className="w-4 self-stretch flex justify-center items-center gap-2.5">
                <div
                  className={`w-2 h-2 rounded-full border-[0.50px] ${bulletColor} transition-all duration-500 ease-in-out`}
                />
              </div>

              <div
                className={`flex-1 justify-start ${textColor} ${INNO_CARD_TEXT_STYLES.itemLabel} font-['Gotham'] whitespace-pre-line transition-colors duration-500 ease-in-out`}
                dangerouslySetInnerHTML={{__html: renderBoldText(item.label)}}
              />
            </div>

            <div
              className={`self-stretch text-left ${textColor} ${INNO_CARD_TEXT_STYLES.itemDescription} font-['Gotham'] whitespace-pre-line transition-colors duration-500 ease-in-out`}
              dangerouslySetInnerHTML={{
                __html: renderBoldText(item.description),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default InnoCard;
