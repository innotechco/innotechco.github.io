function PartnerIntroImage({assets, content, className = "", style, wrapperClassName = ""}) {
  if (!assets.heroImage) return null;

  return (
    <div
      className={`relative aspect-video w-[calc(100%+50px)] -translate-x-6 shrink-0 overflow-hidden md:w-[calc(100%+128px)] md:-translate-x-16 xl:h-[382px] xl:w-[600px] xl:translate-x-0 xl:self-stretch ${wrapperClassName}`}
    >
      <img
        loading="lazy"
        src={assets.heroImage}
        alt={`${content.name} platform`}
        className={`size-full object-cover object-center ${className}`}
        style={style}
      />
    </div>
  );
}

export default PartnerIntroImage;
