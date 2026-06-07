function IntroSection({image, textColor}) {
  return (
    <section className="mb-20 px-6 py-[30px] md:px-16 xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1600px] items-center justify-center">
        <div className="relative flex min-w-px flex-1 flex-col items-start justify-center gap-4 p-9 ">
          <div className="absolute left-[17px] top-[20px] size-[62px] rounded-full border border-[#37B478]" />
          <h2
            className={`w-full font-['Gotham'] text-4xl font-bold ${textColor}`}
          >
            INNOTECH IS IN
          </h2>
          <div className="flex w-full items-center justify-center px-6 py-1">
            <p
              className={`min-w-px flex-1 whitespace-pre-wrap font-['Gotham'] text-lg font-light leading-normal ${textColor}`}
            >
              “Innotech Is In” captures both our product architecture and our
              operating <br /> mindset. It represents four connected
              capabilities—innovation management, intelligence analytics,
              digital transformation, and structured implementation<br />—brought
              together as one system. <br /> <br />
              It also means full commitment to
              execution. We stay involved from<br />diagnosis and design through
              deployment, adoption, and measurable results.
            </p>
          </div>
        </div>

        <div className="relative h-[387px] w-[403px] shrink-0 overflow-hidden rounded-[50px] px-[130px] py-[144px]">
          <img
            src={image}
            alt=""
            aria-hidden
            className="absolute left-[-168px] top-[-17px] h-[404px] w-[706px] max-w-none object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default IntroSection;
