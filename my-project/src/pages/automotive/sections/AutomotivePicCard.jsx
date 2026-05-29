import automotiveImage from "../../../assets/images/industries/automotive.png";

function BreadcrumbChevron() {
  return (
    <div className="relative size-4 shrink-0 overflow-hidden">
      <div className="absolute  left-[6px] top-[6px] h-1 w-1 rotate-[-45deg] border-b-1 border-r-1 border-[#37B478]" />
    </div>
  );
}

function Automotive() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#050505] px-4 py-16 md:px-8 md:py-30">
      <article className="relative isolate w-full max-w-[1253px] min-h-[480px] overflow-hidden rounded-[50px] md:min-h-[601px]">
        <div className="absolute inset-0 overflow-hidden rounded-[50px]">
          <img
            className="absolute inset-0 size-full object-cover object-center brightness-120"
            src={automotiveImage}
            alt=""
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/0 via-black/40 to-black/80" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-start gap-2 px-8 py-12 md:px-32 md:py-36">
          <nav
            className="inline-flex items-center gap-2"
            aria-label="Breadcrumb"
          >
            <span className="font-['Gotham'] text-sm font-light text-white">
              what we do
            </span>
            <BreadcrumbChevron />
            <span className="font-['Gotham'] text-sm font-light text-white">
              Industries
            </span>
            <BreadcrumbChevron />
            <span className="font-['Gotham'] text-sm font-light text-white">
              Automotive
            </span>
          </nav>

          <h1 className="font-['Gotham'] text-5xl font-bold leading-none text-white md:text-7xl">
            Automotive
          </h1>

          <p className="max-w-[631px] font-['Gotham'] text-xl leading-relaxed text-white">
            Energy is life. It powers industries, empowers communities, and
            builds societies. As the traditional boundaries of the industry
            continue to blur, BCG&apos;s energy consultants light the way to the
            future of energy for our clients.
          </p>
        </div>
      </article>
    </main>
  );
}

export default Automotive;
