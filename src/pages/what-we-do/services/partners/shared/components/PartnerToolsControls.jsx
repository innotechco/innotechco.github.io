import PartnerArrow from "./PartnerArrow";

function PartnerToolsButton({
  ariaLabel,
  direction,
  disabled,
  onClick,
  sideClassName,
  textColorClassName,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`absolute top-1/2 z-20 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#37B478] bg-black/70 text-[#37B478] backdrop-blur transition-colors hover:bg-[#37B478] disabled:pointer-events-none disabled:opacity-50 sm:size-10 ${sideClassName} ${textColorClassName}`}
    >
      <PartnerArrow direction={direction} />
    </button>
  );
}

function PartnerToolsControls({disabled, onNext, onPrevious, textColorClassName}) {
  return (
    <>
      <PartnerToolsButton
        ariaLabel="Previous partner tool"
        direction="left"
        disabled={disabled}
        onClick={onPrevious}
        sideClassName="left-4 sm:left-6 md:left-8 lg:left-10 xl:left-12 2xl:left-14"
        textColorClassName={textColorClassName}
      />
      <PartnerToolsButton
        ariaLabel="Next partner tool"
        disabled={disabled}
        onClick={onNext}
        sideClassName="right-4 sm:right-6 md:right-8 lg:right-10 xl:right-12 2xl:right-14"
        textColorClassName={textColorClassName}
      />
    </>
  );
}

export default PartnerToolsControls;
