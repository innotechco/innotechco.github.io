function SectionHeading({children, isDarkMode}) {
  return (
    <div className="relative flex min-h-16 w-full items-center">
      <span className="absolute left-[-14px] top-1/2 size-[62px] -translate-y-1/2 rounded-full border border-[#37B478]" />
      <h2
        className={`relative z-10 font-['Gotham'] text-3xl font-bold md:text-[36px] md:leading-tight ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {children}
      </h2>
    </div>
  );
}

export default SectionHeading;
