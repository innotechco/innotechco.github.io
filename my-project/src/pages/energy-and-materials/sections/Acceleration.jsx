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
              Complex oil fields and downstream petrochemical facilities face
              severe infrastructure bottlenecks. Overcoming these operational
              roadblocks demands unified Innovation Management linking deep
              engineering research directly to value chain transformation.
              <br />
              <br />
              Maximize extraction margins. Consulting for enterprise energy
              corporations with over $4B in combined revenue, our specialized
              consulting network deploys advanced data architectures to optimize
              downstream refining assets, streamline supply logistics, and
              secure market leadership.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;



