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
              Mining operators and metals enterprises face rising extraction
              complexity, fragmented operational systems, and volatile
              industrial transitions. Advancing mining modernization requires
              integrated innovation management, digital mining intelligence, and
              scalable transformation architectures across distributed
              industrial assets.
              <br />
              <br />
              Maximize industrial resilience through enterprise mining
              consulting for steel producers, mineral operators, alumina
              systems, and industrial holdings. Our specialized consulting
              frameworks deploy technology analytics, operational intelligence,
              and AI-enabled transformation systems to accelerate sustainable
              metals modernization.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
