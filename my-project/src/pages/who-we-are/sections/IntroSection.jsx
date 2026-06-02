function IntroSection({image, textColor}) {
  return (
    <section className="mb-20 flex items-center justify-center px-[120px] py-[60px]">
      <div className="relative flex min-w-px flex-1 flex-col items-start justify-center gap-4 p-9 ">
        <div className="absolute left-[17px] top-[20px] size-[62px] rounded-full border border-[#37B478]" />
        <h2
          className={`w-full font-['Gotham'] text-4xl font-bold ${textColor}`}
        >
          INNOTECH IS IN
        </h2>
        <div className="flex w-full items-center justify-center px-6">
          <p
            className={`min-w-px flex-1 whitespace-pre-wrap font-['Gotham'] text-lg font-light leading-normal ${textColor}`}
          >
            The world needs energy&mdash;affordable, reliable, and sustainable
            energy. But meeting the world&rsquo;s energy requirements with
            net-zero climate impact is one of today&rsquo;s most complex
            challenges.
            <br />
            <br />
            Energy companies need to leverage the latest technologies,
            re-engineer processes, and rethink business models to drive change.
            BCG works with clients to build{" "}
            <span className="underline">sustainable</span>, competitive energy
            solutions to achieve a net-zero energy world for all.
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
    </section>
  );
}

export default IntroSection;
