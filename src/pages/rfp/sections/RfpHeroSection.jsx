import IntroRevealText from "../../../components/ui/IntroRevealText";

function RfpHeroSection({content, isDarkMode, textColor}) {
  return (
    <section className="flex w-full flex-col items-center justify-start gap-3 px-4 pb-10 pt-7 text-center sm:px-6 lg:px-28">
      <div className="size-6 shrink-0 rounded-full bg-[#37B478]" />

      <IntroRevealText
        as="h1"
        variant="heading"
        className={`w-full max-w-[900px] break-words font-['Gotham'] text-[clamp(2rem,8vw,4.5rem)] font-semibold leading-[1.1] ${textColor}`}
      >
        {content.title}
      </IntroRevealText>

      <IntroRevealText
        variant="copy"
        className={`w-full max-w-[700px] break-words text-center font-['Gotham'] text-base leading-[1.4] sm:text-xl ${
          isDarkMode ? "text-white/80" : "text-black/70"
        }`}
      >
        {content.description}
      </IntroRevealText>
    </section>
  );
}

export default RfpHeroSection;
