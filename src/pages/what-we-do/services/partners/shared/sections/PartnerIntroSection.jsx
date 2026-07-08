function PartnerIntroSection({assets, content, isDarkMode}) {
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <section className="px-6 py-8 md:px-16 xl:px-[120px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 items-stretch gap-8 overflow-visible p-4 xl:grid-cols-[minmax(0,1fr)_minmax(520px,600px)]">
        <div className="flex min-w-0 flex-col items-start justify-between gap-4 self-stretch p-0 md:p-6">
          <div className="relative inline-flex w-full items-start gap-3.5">
            <span className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
            <h2
              className={`relative z-10 max-w-full whitespace-pre-line break-words font-['Gotham'] text-3xl font-bold leading-tight sm:text-4xl ${textColor}`}
            >
              {content.intro.title}
            </h2>
          </div>
          <p
            className={`w-full max-w-[586px] overflow-wrap-anywhere break-words font-['Gotham'] text-base font-normal leading-relaxed sm:text-lg ${textColor}`}
          >
            {content.intro.body}
          </p>
        </div>
        <div className="relative aspect-[16/9] w-[calc(100%+48px)] -translate-x-6 shrink-0 overflow-hidden md:w-[calc(100%+128px)] md:-translate-x-16 xl:aspect-auto xl:h-auto xl:min-h-[382px] xl:w-full xl:translate-x-0 xl:self-stretch">
          {assets.heroImage ? (
            <img
              loading="lazy"
              src={assets.heroImage}
              alt={`${content.name} platform`}
              className="size-full object-cover object-center"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PartnerIntroSection;
