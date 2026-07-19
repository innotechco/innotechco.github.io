function SectionTitle({
  children,
  className = "",
  textClassName = "",
  textColor = "",
  weight = "font-bold",
}) {
  return (
    <div className={`locale-section-title relative flex w-full items-center gap-[15px] ${className}`}>
      <div className="locale-section-title-circle absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
      <h2
        className={`relative z-10 font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] leading-normal ${weight} ${textColor} ${textClassName}`}
      >
        {children}
      </h2>
    </div>
  );
}

export default SectionTitle;
