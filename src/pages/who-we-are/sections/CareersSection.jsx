import SectionTitle from "../../../components/ui/SectionTitle";

function CareersSection({
  content,
  image,
  invertedTextColor,
  inverseCardBackground,
}) {
  return (
    <section className="flex flex-col items-start gap-2.5 overflow-hidden px-6 py-14 md:px-16 xl:min-h-[640px] xl:px-[120px]">
      <div
        className={`mx-auto flex w-full max-w-[1600px] flex-1 flex-col items-start justify-center gap-6 overflow-hidden rounded-[32px] transition-colors duration-500 lg:flex-row lg:rounded-[50px] ${inverseCardBackground}`}
      >
        <div className="flex flex-1 flex-col items-start justify-start gap-8 self-stretch p-6 sm:p-10 xl:p-16">
          <SectionTitle textColor={invertedTextColor} weight="font-bold">
            {content.title}
          </SectionTitle>
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-start gap-3">
              <span className="mt-3 size-2.5 shrink-0 rounded-full bg-[#37B478]" />
              <h3
                className={`w-full font-['Gotham'] text-lg font-light leading-[1.5] sm:text-2xl ${invertedTextColor}`}
              >
                {content.description}
              </h3>
            </div>
          </div>
          <button
            type="button"
            className={`inline-flex min-h-11 items-center justify-center rounded-[50px] bg-[#22C55E] px-4 py-2 font-['Gotham'] text-xl font-medium sm:text-2xl ${invertedTextColor} shadow-lg transition-all duration-200 hover:bg-[#16A34A] hover:shadow-xl active:scale-95`}
          >
            {content.buttonLabel}
          </button>
        </div>
        <div className="flex h-72 w-full items-end justify-end self-stretch overflow-hidden lg:h-auto lg:w-[496px]">
          <img loading="lazy"
            src={image}
            alt=""
            aria-hidden
            className="size-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

export default CareersSection;
