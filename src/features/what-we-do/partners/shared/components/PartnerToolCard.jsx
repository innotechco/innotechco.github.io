function PartnerToolCard({assets, card, isDarkMode, style}) {
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <article
      data-partner-tool-card
      style={style ?? undefined}
      className="partner-tools-card group mx-auto flex aspect-square h-[220px] min-h-0 w-full max-w-[320px] min-w-0 flex-col items-start gap-4 overflow-hidden rounded-3xl border border-[#37B478]/20 bg-green-500/5 p-3 shadow-[inset_1px_-1px_2px_0px_rgba(29,95,63,1)] transition-all duration-500 ease-out hover:-translate-y-2 hover:border-[#37B478]/80 hover:bg-[#37B478]/10 hover:shadow-[inset_1px_-1px_2px_0px_rgba(55,180,120,1),0_24px_55px_-32px_rgba(55,180,120,0.9)] sm:h-[260px] sm:p-4 md:h-[300px] lg:mx-0 lg:h-[340px] lg:max-w-[360px] xl:h-[360px] xl:p-6"
    >
      <img
        loading="lazy"
        src={assets.cardIcons[card.icon]}
        alt=""
        aria-hidden
        className="size-12 max-w-full flex-shrink-0 self-center object-contain transition-transform duration-500 ease-out [filter:brightness(0)_saturate(100%)_invert(56%)_sepia(51%)_saturate(599%)_hue-rotate(96deg)_brightness(94%)_contrast(88%)] group-hover:scale-105 sm:size-16 xl:size-24"
      />
      <h3 className={`w-full break-words text-center font-['Gotham'] font-bold lg:text-left ${textColor}`}>
        {card.title}
      </h3>
      <p className={`min-h-0 w-full flex-grow overflow-hidden whitespace-normal break-words font-['Gotham'] leading-snug ${textColor}`}>
        {card.description}
      </p>
    </article>
  );
}

export default PartnerToolCard;
