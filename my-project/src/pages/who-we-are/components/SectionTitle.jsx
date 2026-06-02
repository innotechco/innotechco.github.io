function SectionTitle({children, textColor, weight = "font-normal"}) {
  return (
    <div className="relative inline-flex w-full items-center gap-3.5">
      <div className="absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />
      <h2
        className={`relative z-10 flex-1 font-['Gotham'] text-4xl ${weight} ${textColor}`}
      >
        {children}
      </h2>
    </div>
  );
}

export default SectionTitle;
