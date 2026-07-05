function WhoWeAreBackground({images, isDarkMode}) {
  const backgroundImages = isDarkMode
    ? {
        middle: images.backgroundMiddleDark,
        top: images.backgroundTopDark,
        top2: images.backgroundTop2Dark,
      }
    : {
        middle: images.backgroundMiddleLight,
        top: images.backgroundTopLight,
        top2: images.backgroundTop2Light,
      };

  const positions = {
    top: "top-[10px] xl:top-[-0px] sm:top-[10px] md:top-[10px]",
    top2: "top-[180px] 2xl:top-[20px] xl:top-[90px] sm:top-[200px] md:top-[300px]",
    middle: "top-[3200px] md:top-[3050px] xl:top-[2900px]",
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <img
        src={backgroundImages.top}
        alt=""
        className={`absolute left-1/2 ${positions.top} h-auto w-full min-w-[1024px] -translate-x-1/2`}
      />
      <img
        src={backgroundImages.top2}
        alt=""
        className={`absolute left-1/2 ${positions.top2} h-auto w-full min-w-[1024px] -translate-x-1/2`}
      />
      <img
        src={backgroundImages.middle}
        alt=""
        className={`absolute inset-x-0 ${positions.middle} h-auto w-full`}
      />
    </div>
  );
}

export default WhoWeAreBackground;
