const Introduction = () => {
  return (
    <div className="self-stretch px-28 py-14 inline-flex flex-col justify-start items-start gap-2.5">
      <div className="self-stretch relative flex flex-col justify-center items-start gap-4">
        {/* Green Circle */}
        <div className="size-16 left-[10px] top-[-19px] absolute rounded-full border border-[#37B478]" />

        {/* Title */}
        <div className="self-stretch justify-start px-6 text-white text-4xl font-bold font-['Gotham']">
          ACCELERATION
        </div>

        {/* Content */}
        <div className="self-stretch px-12 inline-flex justify-center items-center gap-2.5">
          <div className="flex-1 justify-start">
            <span className="text-white text-lg font-light font-['Gotham']">
              Healthcare providers and life sciences enterprises face fragmented
              clinical infrastructures, rising diagnostics complexity, and
              <br />
              escalating operational inefficiencies. Advancing digital
              healthcare systems requires integrated Healthcare Innovation
              frameworks, AI healthcare orchestration, and enterprise-grade
              clinical intelligence architectures.
              <br />
              <br />
              Our integrated healthcare solutions combine innovation management,
              medical technology analytics, AI automation, and digital
              transformation frameworks to support sustainable growth across
              healthcare ecosystems, precision medicine initiatives, diagnostics
              operations, and advanced clinical infrastructures.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
