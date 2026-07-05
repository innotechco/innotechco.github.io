function VideoSection({ariaLabel, icon, isDarkMode}) {
  return (
    <section className="flex h-auto flex-col items-start gap-2.5 overflow-hidden px-6 py-14 md:px-16 xl:h-[677px] xl:px-[120px]">
      <div
        className={`mx-auto flex aspect-video w-full max-w-[1600px] items-center justify-center overflow-hidden rounded-[28px] xl:h-[557px] xl:aspect-auto xl:rounded-[50px] ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
      >
        <button
          type="button"
          aria-label={ariaLabel}
          className="inline-flex size-24 items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <img loading="lazy" src={icon} alt="" aria-hidden className="size-full" />
        </button>
      </div>
    </section>
  );
}

export default VideoSection;
