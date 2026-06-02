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
    top: "top-[-50px]",
    top2: "top-[-30px]",
    middle: "top-[1780px]",
  };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <img
        src={backgroundImages.top}
        alt=""
        className={`absolute inset-x-0 ${positions.top} h-auto w-full`}
      />
      <img
        src={backgroundImages.top2}
        alt=""
        className={`absolute inset-x-0 ${positions.top2} h-auto w-full`}
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
