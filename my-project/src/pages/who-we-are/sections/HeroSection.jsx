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
        InnotechCo is a Dubai-based innovation and transformation partner
        helping organizations turn complex ideas, technologies, and market
        signals into measurable growth. Through INSIGHT, INCEPTION, INFINITY,
        and INLEARN Academy, we deliver intelligence analytics, innovation
        management, digital transformation, and capability-building programs
        that connect strategy with execution.
      </p>
    </section>
  );
}

export default HeroSection;
