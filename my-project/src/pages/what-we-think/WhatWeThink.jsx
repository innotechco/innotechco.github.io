import {useState} from "react";
import ReadMoreLink from "../../components/ui/ReadMoreLink";
import {useTheme} from "../../context/useTheme";
import BlackExcludeLeftWhatWeThink from "../../assets/images/excludes/what-we-think/BlackExcludeLeftWhatWeThink.png";
import BlackExcludeRightWhatWeThink from "../../assets/images/excludes/what-we-think/BlackExcludeRightWhatWeThink.png";
import ExcludeLeftWhatWeThink from "../../assets/images/excludes/what-we-think/ExcludeLeftWhatWeThink.png";
import ExcludeRightWhatWeThink from "../../assets/images/excludes/what-we-think/ExcludeRightWhatWeThink.png";
import {article, compactTitle, featuredTitle} from "./data";
import {routes} from "../../routes";

const HowWeThinkImage = "/assets/shared/how-we-think.jpg";

function HoverCard({children, className = "", isDarkMode}) {
  const [position, setPosition] = useState({x: 0, y: 0, active: false});

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    setPosition((current) => ({...current, active: false}));
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 rounded-[50px] transition-opacity duration-300"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 0.7), transparent 75%)`,
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />

      <article
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative z-10 size-full overflow-hidden rounded-[50px] border border-[#37B478] transition-colors duration-500 ease-in-out ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
      >
        {children}
      </article>
    </div>
  );
}

function ImagePane({objectPosition = "center center"}) {
  return (
    <div className="relative min-h-px min-w-px flex-1 self-stretch overflow-hidden">
      <img
        src={HowWeThinkImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover"
        style={{objectPosition}}
      />
    </div>
  );
}

function ArticleCopy({
  title,
  description = article.shortDescription,
  dateLayout = "between",
  isDarkMode,
}) {
  const textColor = isDarkMode ? "text-white" : "text-black";
  const dateClassName =
    dateLayout === "between"
      ? "flex items-center justify-between"
      : dateLayout === "row"
        ? "flex items-center gap-8"
        : "flex flex-col items-start";

  return (
    <div className="flex size-full flex-col items-start justify-center gap-3 p-9 text-left font-['Gotham'] leading-normal [word-break:break-word]">
      <h2
        className={`w-full text-[28px] font-medium leading-[1.15] transition-colors duration-500 ease-in-out ${textColor}`}
      >
        {title}
      </h2>

      <div className={`${dateClassName} w-full text-base whitespace-nowrap`}>
        <p
          className={`font-light transition-colors duration-500 ease-in-out ${textColor}`}
        >
          {article.date}
        </p>
        <p className="text-[#37B478]">{article.readTime}</p>
      </div>

      <p
        className={`w-full text-base leading-[1.25] transition-colors duration-500 ease-in-out ${textColor}`}
      >
        {description}
      </p>

      <ReadMoreLink isDarkMode={isDarkMode} className="mt-1 text-base" />
    </div>
  );
}

function HorizontalImageCard({
  title,
  description,
  objectPosition,
  isDarkMode,
}) {
  return (
    <HoverCard className="w-full" isDarkMode={isDarkMode}>
      <div className="flex min-h-[252px] items-start justify-end">
        <ImagePane objectPosition={objectPosition} />
        <div className="flex flex-1 self-stretch">
          <ArticleCopy
            title={title}
            description={description}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </HoverCard>
  );
}

function TallImageCard({isDarkMode}) {
  return (
    <HoverCard className="h-[702px] flex-1" isDarkMode={isDarkMode}>
      <div className="flex size-full flex-col items-center">
        <ImagePane objectPosition="center center" />
        <div className="flex flex-1 self-stretch">
          <ArticleCopy
            title={featuredTitle}
            description={article.longDescription}
            dateLayout="row"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </HoverCard>
  );
}

function SmallImageCard({objectPosition, isDarkMode}) {
  return (
    <HoverCard className="min-h-px flex-1 self-stretch" isDarkMode={isDarkMode}>
      <div className="flex size-full items-center justify-end">
        <ImagePane objectPosition={objectPosition} />
        <div className="flex flex-1 self-stretch">
          <ArticleCopy
            title={compactTitle}
            dateLayout="stack"
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </HoverCard>
  );
}

function TextOnlyCard({isDarkMode}) {
  return (
    <HoverCard className="min-h-px flex-1 self-stretch" isDarkMode={isDarkMode}>
      <ArticleCopy
        title={compactTitle}
        dateLayout="stack"
        isDarkMode={isDarkMode}
      />
    </HoverCard>
  );
}

function WhatWeThink() {
  const {isDarkMode} = useTheme();
  const pageBackground = isDarkMode ? "bg-[#050505]" : "bg-white";
  const titleColor = isDarkMode ? "text-white" : "text-black";
  const leftExclude = isDarkMode
    ? ExcludeLeftWhatWeThink
    : BlackExcludeLeftWhatWeThink;
  const rightExclude = isDarkMode
    ? ExcludeRightWhatWeThink
    : BlackExcludeRightWhatWeThink;

  return (
    <main
      className={`relative w-full overflow-hidden px-28 pb-14 pt-36 transition-colors duration-500 ease-in-out ${pageBackground}`}
    >
      <img
        src={leftExclude}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-[-450px] top-[250px] z-0 w-[1300px] max-w-none opacity-100"
      />
      <img
        src={rightExclude}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-[1px] top-[-40px] z-0 w-[430px] max-w-none opacity-100"
      />

      <section className="relative z-10 flex flex-col items-center gap-2 pb-16">
        <div className="size-6 rounded-xl bg-[#37B478]" />
        <h1
          className={`font-['Gotham'] text-4xl font-normal transition-colors duration-500 ease-in-out ${titleColor}`}
        >
          What we think
        </h1>
      </section>

      <section className="relative z-10 flex flex-col items-start gap-9">
        <HorizontalImageCard
          title={featuredTitle}
          objectPosition="center center"
          isDarkMode={isDarkMode}
        />

        <div className="flex w-full items-start gap-9">
          <TallImageCard isDarkMode={isDarkMode} />

          <div className="flex h-[702px] min-w-px flex-1 flex-col items-start justify-center gap-9">
            <SmallImageCard
              objectPosition="center center"
              isDarkMode={isDarkMode}
            />
            <SmallImageCard
              objectPosition="right center"
              isDarkMode={isDarkMode}
            />
          </div>
        </div>

        <div className="flex w-full items-start gap-9">
          <div className="flex h-[702px] min-w-px flex-1 flex-col items-start justify-center gap-9">
            <SmallImageCard
              objectPosition="center center"
              isDarkMode={isDarkMode}
            />

            <div className="flex min-h-px flex-1 items-start gap-9 self-stretch">
              <TextOnlyCard isDarkMode={isDarkMode} />
              <TextOnlyCard isDarkMode={isDarkMode} />
            </div>
          </div>

          <TallImageCard isDarkMode={isDarkMode} />
        </div>

        <HorizontalImageCard
          title={featuredTitle}
          objectPosition="center center"
          isDarkMode={isDarkMode}
        />

        <div className="flex w-full justify-end pb-10 pt-4">
          <ReadMoreLink
            to={routes.archives}
            label="see all archives"
            isDarkMode={isDarkMode}
            align="end"
            className="font-['Gotham'] text-lg"
          />
        </div>
      </section>
    </main>
  );
}

export default WhatWeThink;
