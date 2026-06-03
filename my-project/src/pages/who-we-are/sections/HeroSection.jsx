function HeroSection({textColor}) {
  return (
    <section className="flex h-[430px] flex-col items-center justify-start gap-2 px-28 -translate-y-15">
      <div className="size-6 rounded-full bg-[#37B478]" />
      <h1 className={`font-['Gotham'] text-7xl font-semibold ${textColor}`}>
        Who we are
      </h1>
      <p
        className={`w-[700px] text-center font-['Gotham'] text-xl leading-[1.35] ${textColor}`}
      >
        Innotech helps organizations turn technology signals into practical
        strategy, innovation systems, and AI-enabled transformation. We connect
        industry insight with execution so teams can move from uncertainty to
        measurable progress.
      </p>
    </section>
  );
}

export default HeroSection;
