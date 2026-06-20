function PartnerIntroSection({assets, content, isDarkMode}) {
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <section className="px-6 py-8 md:px-16 xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1320px] flex-col items-start gap-8 overflow-hidden p-4 xl:flex-row">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-4 self-stretch p-0 md:p-6">
          <div className="relative inline-flex w-full items-center gap-3.5">
            <span className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
            <h2
              className={`relative z-10 max-w-full font-['Gotham'] text-4xl font-bold leading-none xl:whitespace-nowrap ${textColor}`}
            >
              {content.intro.title}
            </h2>
          </div>
          <p
            className={`w-full max-w-[596px] font-['Gotham'] text-lg font-normal leading-none ${textColor}`}
          >
            {content.intro.body}
          </p>
        </div>
        <div className="relative h-[260px] w-full shrink-0 overflow-hidden md:h-[382px] xl:w-[600px]">
          {assets.heroImage ? (
            <img
              loading="lazy"
              src={assets.heroImage}
              alt=""
              aria-hidden
              className="size-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PartnerIntroSection;
