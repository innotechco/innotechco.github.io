import {useTheme} from "../../../context/useTheme";

function AccelerationSection({paragraphs}) {
  const {isDarkMode} = useTheme();
  const textColor = isDarkMode ? "text-white" : "text-black";

  return (
    <section
      className={`self-stretch px-6 py-14 md:px-16 xl:px-[120px] ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      }`}
    >
      <div className="relative mx-auto flex w-full max-w-[1600px] flex-col items-start justify-center gap-4">
        <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
        <h2
          className={`self-stretch font-['Gotham'] text-4xl font-bold ${textColor}`}
        >
          ACCELERATION
        </h2>

        <div className="self-stretch px-0 md:px-12">
          <div
            className={`space-y-6 font-['Gotham'] text-lg font-light ${textColor}`}
          >
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccelerationSection;
