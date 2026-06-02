function HeroSection({textColor}) {
  return (
    <section className="flex h-[430px] flex-col items-center justify-start gap-2 px-28 py-14">
      <div className="size-6 rounded-full bg-[#37B478]" />
      <h1 className={`font-['Gotham'] text-7xl font-semibold ${textColor}`}>
        Who we are
      </h1>
      <p
        className={`w-[700px] text-center font-['Gotham'] text-xl leading-[1.35] ${textColor}`}
      >
        Energy is life. It powers industries, empowers communities, and builds
        societies. As the traditional boundaries of the industry continue to
        blur, BCG&rsquo;s energy consultants light the way to the future of energy
        for our clients.
      </p>
    </section>
  );
}

export default HeroSection;
