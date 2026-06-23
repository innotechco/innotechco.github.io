import IntroRevealText from "../../../components/ui/IntroRevealText";

function HeroSection({content, textColor}) {
  return (
    <section className="flex min-h-[360px] flex-col items-center justify-start gap-2 px-4 text-center sm:px-6 lg:h-[430px] lg:px-28 lg:-translate-y-30">
      <div className="size-6 rounded-full bg-[#37B478]" />
      <IntroRevealText
        as="h1"
        variant="heading"
        className={`font-['Gotham'] text-[clamp(3rem,13vw,4.5rem)] font-semibold ${textColor}`}
      >
        {content.title}
      </IntroRevealText>
      <IntroRevealText
        variant="copy"
        className={`w-full max-w-[700px] text-center font-['Gotham'] text-base leading-[1.35] sm:text-xl ${textColor}`}
      >
        {content.description}
      </IntroRevealText>
    </section>
  );
}

export default HeroSection;
