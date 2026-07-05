function IntroSection({content, image, textColor}) {
  return (
    <section className="mb-20 px-6 py-[30px] md:px-16 xl:px-[120px]">
      <div className="mx-auto grid w-full max-w-[1600px] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="relative order-2 flex min-w-px flex-1 flex-col items-start justify-center gap-4 p-4 sm:p-9 lg:order-1">
          <div className="absolute left-[17px] top-[20px] size-[62px] rounded-full border border-[#37B478]" />
          <h2
            className={`w-full font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold ${textColor}`}
          >
            {content.title}
          </h2>
          <div className="flex w-full items-center justify-center px-0 py-1 sm:px-6">
            <p
              className={`min-w-px flex-1 whitespace-pre-wrap font-['Gotham'] text-lg font-light leading-normal ${textColor}`}
            >
              {content.body}
            </p>
          </div>
        </div>

        <div className="relative order-1 mx-auto aspect-square w-full max-w-96 shrink-0 overflow-hidden rounded-[32px] lg:order-2 lg:rounded-[50px]">
          <img
            loading="lazy"
            src={image}
            alt=""
            aria-hidden
            className="absolute inset-0 size-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

export default IntroSection;
