import ExpertCard from "../components/ExpertCard";
import SectionTitle from "../../../components/ui/SectionTitle";
import ResponsiveCarousel from "../../../components/ui/ResponsiveCarousel";

function ExpertsSection({experts, image, isDarkMode, textColor, title}) {
  return (
    <section className="overflow-visible px-6 py-14 md:px-16 xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-start gap-8 overflow-visible">
        <SectionTitle textColor={textColor} weight="font-bold">
          {title}
        </SectionTitle>
        <div className="w-full lg:hidden">
          <ResponsiveCarousel ariaLabel={title} isDarkMode={isDarkMode}>
            {experts.map((expert) => (
              <ExpertCard
                key={expert.id}
                image={image}
                iconClassName={expert.iconClassName}
                title={expert.name}
                subtitle={expert.role}
                isDarkMode={isDarkMode}
              />
            ))}
          </ResponsiveCarousel>
        </div>

        <div className="hidden w-full grid-cols-3 items-stretch gap-8 overflow-visible lg:grid">
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              image={image}
              iconClassName={expert.iconClassName}
              title={expert.name}
              subtitle={expert.role}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExpertsSection;
