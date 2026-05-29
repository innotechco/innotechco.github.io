import {useState} from "react";

import trexImage from "../../../assets/images/experts/trex.png";
import itonicsImage from "../../../assets/images/experts/itonics.png";
import statistaImage from "../../../assets/images/experts/statista.png";
import excludeShape from "../../../assets/icons/Exclude.svg";

const expertCards = [
  {
    id: "trex",
    image: statistaImage,
    title: "Golam reza Jamshidi",
    subtitle: "CEO of Nouri Petrochemical Company",
  },
  {
    id: "itonics",
    image: itonicsImage,
    title: "Automotive industry trends 2026",
    subtitle: "ITONICS Automotive Industry Trends",
  },
  {
    id: "statista",
    image: trexImage,
    title: "Golam reza Jamshidi",
    subtitle: "CEO of Nouri Petrochemical Company",
  },
];

function ExpertCard({image, title, subtitle}) {
  const [pos, setPos] = useState({x: 0, y: 0, active: false});

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setPos((previousPos) => ({...previousPos, active: false}));
  };

  return (
    <div
      className="relative isolate min-w-0 flex-1 h-full overflow-visible" // ← h-full اضافه شد
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `
            radial-gradient(
              600px circle at ${pos.x}px ${pos.y}px,
              rgba(55, 180, 120, 0.7),
              transparent 75%
            )
          `,
          filter: "blur(28px)",
          borderRadius: "25px",
        }}
      />

      <article className="relative z-10 flex h-[250px] min-w-0 flex-col overflow-hidden rounded-[25px] border border-[#37B478] bg-[#050505] p-6 sm:p-9">
        {" "}
        {/* ← h-full + flex-col */}
        <img
          className="pointer-events-none absolute left-[-34px] top-[-72px] h-[242px] w-[234px] rotate-[10deg] opacity-100"
          src={excludeShape}
          alt=""
          aria-hidden="true"
        />
        <div className="relative z-10 flex w-full items-end justify-between gap-4">
          <div className="relative size-[94px] shrink-0 overflow-hidden rounded-bl-[25px] rounded-br-[100px] rounded-tl-[25px] rounded-tr-[100px]">
            <img className="block size-full" src={image} alt="" />
          </div>

          <button
            className="shrink-0 rounded-bl-[30px] rounded-br-[20px] rounded-tr-[20px] bg-[#22C55E] px-4 py-2 font-['Gotham'] text-base font-bold leading-none text-black shadow-lg transition-all duration-200 hover:scale-[1.03] hover:bg-[#16A34A] hover:shadow-xl active:scale-95"
            type="button"
          >
            Quick Content
          </button>
        </div>
        {/* بخش متن - با mt-auto برای چسباندن به پایین */}
        <div className="relative z-10 mt-auto flex w-full flex-col text-white">
          <h3 className="font-['Gotham'] text-2xl font-bold leading-none">
            {title}
          </h3>
          <p className="mt-1 font-['Gotham'] text-base font-normal leading-none">
            {subtitle}
          </p>
        </div>
      </article>
    </div>
  );
}

function OurExpert() {
  return (
    <section className="self-stretch bg-[#050505] px-6 py-14 md:px-16 xl:px-[120px] xl:py-[60px]">
      <div className="flex w-full flex-col items-start gap-8">
        <div className="relative flex w-full items-center gap-[15px]">
          <div className="absolute left-[-14px] top-[-19px] size-[62px] rounded-full border border-[#37B478]" />
          <h2 className="relative z-10 font-['Gotham'] text-4xl font-bold leading-normal text-white">
            Our Expert in inception
          </h2>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 overflow-visible lg:grid-cols-3 items-stretch">
          {" "}
          {/* ← items-stretch اضافه شد */}
          {expertCards.map((card) => (
            <ExpertCard key={card.id} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default OurExpert;
