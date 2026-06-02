function VideoSection({icon, isDarkMode}) {
  return (
    <section className="flex h-[677px] flex-col items-start gap-2.5 overflow-hidden px-28 py-14">
      <div
        className={`flex h-[557px] w-full items-center justify-center overflow-hidden rounded-[50px] ${
          isDarkMode ? "bg-white" : "bg-black"
        }`}
      >
        <button
          type="button"
          aria-label="Play video"
          className="inline-flex size-24 items-center justify-center transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <img src={icon} alt="" aria-hidden className="size-full" />
        </button>
      </div>
    </section>
  );
}

export default VideoSection;
