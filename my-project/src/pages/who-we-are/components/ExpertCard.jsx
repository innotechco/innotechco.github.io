import excludeBlackShape from "../../../assets/images/excludes/shared/ExcludeBlack.svg";
import excludeShape from "../../../assets/images/excludes/shared/Exclude.svg";
import {usePointerGlow} from "../../../hooks/usePointerGlow";

function ExpertCard({
  image,
  iconClassName = "translate-x-7 -translate-y-2",
  title,
  subtitle,
  isDarkMode,
}) {
  const {position, handlers} = usePointerGlow();

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
        <img
          className="pointer-events-none absolute left-[-34px] top-[-72px] h-[242px] w-[234px] rotate-[10deg] opacity-100"
          src={isDarkMode ? excludeShape : excludeBlackShape}
          alt=""
          aria-hidden
        />
        <div className="relative z-10 flex w-full items-end justify-between gap-4">
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

          <button
            className="shrink-0 rounded-bl-[30px] rounded-br-[20px] rounded-tr-[20px] bg-[#22C55E] px-4 py-2 font-['Gotham'] text-base font-bold leading-none text-black shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#16A34A] hover:shadow-xl active:scale-95"
            type="button"
          >
            View Project
          </button>
        </div>

        <div
          className={`relative z-10 mt-auto flex w-full flex-col ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          <h3 className="font-['Gotham'] text-2xl font-bold leading-none">
            {title}
          </h3>
          <p className="mt-1 font-['Gotham'] text-base font-normal leading-none">
            {subtitle}
          </p>
        </div>
      </article>
    </div>
  );
}

export default ExpertCard;
