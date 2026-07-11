import excludeBlackShape from "../../../assets/images/excludes/shared/ExcludeBlack.svg";
import excludeShape from "../../../assets/images/excludes/shared/Exclude.svg";
import {usePointerGlow} from "../../../hooks/usePointerGlow";
import {useContactAction} from "../../../context/useContactAction";

function ExpertCard({
  image,
  iconClassName = "translate-x-7 -translate-y-2",
  title,
  subtitle,
  isDarkMode,
}) {
  const {position, handlers} = usePointerGlow();
  const openContact = useContactAction();
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";

  return (
    <div
      className="relative isolate h-full min-w-0 flex-1 overflow-visible"
      {...handlers}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 0.7), transparent 75%)`,
          filter: "blur(28px)",
          borderRadius: "25px",
        }}
      />

      <article
        className={`relative z-10 flex h-[250px] min-w-0 flex-col overflow-hidden rounded-[25px] border border-[#37B478] p-6 sm:p-9 ${
          isDarkMode ? "bg-[#050505]" : "bg-white"
        }`}
      >
        <img loading="lazy"
          className="pointer-events-none absolute left-[-34px] top-[-52px] h-[242px] w-[234px] rotate-[10deg] opacity-100"
          src={isDarkMode ? excludeShape : excludeBlackShape}
          alt=""
          aria-hidden
        />
        <div className="z-10 flex w-full items-end justify-between gap-4">
          <div className="relative size-[94px] shrink-0">
            <span
              aria-hidden
              className={`absolute left-0 top-0 size-9 bg-[#22C55E] ${iconClassName}`}
              style={{
                WebkitMask: `url("${image}") center / contain no-repeat`,
                mask: `url("${image}") center / contain no-repeat`,
              }}
            />
          </div>
        </div>

        <button
          onClick={() => openContact("selected-project")}
          className={`absolute right-1 top-[102px] z-20 min-h-8 w-[132px] shrink-0 rounded-bl-[24px] rounded-br-[18px] rounded-tr-[18px] bg-[#22C55E] px-3 py-1.5 font-['Gotham'] text-xs font-bold leading-tight shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#16A34A] hover:shadow-xl active:scale-95 sm:right-2 sm:top-[112px] sm:w-[142px] sm:text-sm lg:right-3 ${greenButtonTextColor}`}
          type="button"
        >
          View Project
        </button>

        <div
          className={`relative z-10 mt-auto flex w-full min-w-0 flex-col ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <h3 className="min-w-0 break-words font-['Gotham'] text-[clamp(0.88rem,3.5vw,1.02rem)] font-bold leading-[1.12] [overflow-wrap:anywhere] sm:text-[clamp(0.95rem,2.4vw,1.08rem)] lg:text-[clamp(0.9rem,1.28vw,1.04rem)] min-[1500px]:text-[1.12rem]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 min-w-0 break-words font-['Gotham'] text-sm font-normal leading-tight [overflow-wrap:anywhere]">
              {subtitle}
            </p>
          ) : null}
        </div>
      </article>
    </div>
  );
}

export default ExpertCard;
