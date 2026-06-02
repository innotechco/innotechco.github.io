import SectionTitle from "../components/SectionTitle";

function CareersSection({image, invertedTextColor, inverseCardBackground}) {
  return (
    <section className="flex h-[640px] flex-col items-start gap-2.5 overflow-hidden px-28 py-14">
      <div
        className={`flex flex-1 items-start justify-center gap-8 overflow-hidden rounded-[50px] transition-colors duration-500 ${inverseCardBackground}`}
      >
        <div className="flex flex-1 flex-col items-start justify-start gap-8 self-stretch p-16">
          <SectionTitle textColor={invertedTextColor} weight="font-bold">
            Careers
          </SectionTitle>
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex w-full items-start gap-3">
              <span className="mt-3 size-2.5 shrink-0 rounded-full bg-[#37B478]" />
              <h3
                className={`w-full font-['Gotham'] text-3xl font-normal leading-[1.2] ${invertedTextColor}`}
              >
                InnotechCo launches INCEPTION &mdash; an AI-powered innovation
                management system
              </h3>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[50px] bg-[#22C55E] px-4 py-2 font-['Gotham'] text-2xl font-bold text-white shadow-lg transition-all duration-200 hover:bg-[#16A34A] hover:shadow-xl active:scale-95"
          >
            Go to store
          </button>
        </div>
        <div className="flex w-[496px] items-end justify-end self-stretch overflow-hidden">
          <img
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
