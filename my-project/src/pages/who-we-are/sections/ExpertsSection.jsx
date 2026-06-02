import ExpertCard from "../components/ExpertCard";
import SectionTitle from "../components/SectionTitle";

function ExpertsSection({experts, image, isDarkMode, textColor}) {
  return (
    <section className="flex flex-col items-start gap-8 overflow-visible px-28 py-14">
      <SectionTitle textColor={textColor} weight="font-bold">
        Our Expert in inception
      </SectionTitle>
      <div className="grid w-full grid-cols-3 items-stretch gap-8 overflow-visible">
        {experts.map((expert) => (
          <ExpertCard
            key={expert.id}
            image={image}
            title={expert.name}
            subtitle={expert.role}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>
    </section>
  );
}

export default ExpertsSection;
