function PartnerHeroSection({assets, content, isDarkMode}) {
  const greenButtonTextColor = isDarkMode ? "text-black" : "text-white";
  const logoToneClass = isDarkMode
    ? assets.darkLogoClassName ?? ""
    : assets.lightLogoClassName ?? "brightness-0";

  return (
    <section className="px-6 pb-12 pt-36 md:px-16 md:pb-16 md:pt-40 xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-8 text-center">
        <img
          src={assets.logo}
          alt={content.name}
          className={`h-auto w-[min(1000px,78vw)] object-contain ${assets.logoClassName ?? "max-h-[212px]"} ${logoToneClass}`}
        />
        <p
          className={`max-w-[518px] font-['Gotham'] text-xl font-normal md:text-2xl ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {content.hero.tagline}
        </p>
        <button
          type="button"
          className={`rounded-[50px] bg-[#37B478] px-5 py-2 font-['Gotham'] text-xl font-bold ${greenButtonTextColor} transition-all duration-200 hover:scale-[1.03] hover:bg-[#22C55E] active:scale-95 md:text-2xl`}
        >
          {content.hero.buttonLabel}
        </button>
      </div>
    </section>
  );
}

export default PartnerHeroSection;
