import {useState} from "react";

function PlayToggleButton({label}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      onClick={() => setIsActive((current) => !current)}
      className="relative z-10 mt-1 flex shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-150 ease-out hover:scale-110 active:scale-75"
    >
      <span
        aria-hidden="true"
        className="h-0 w-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-[#37B478]"
      />
    </button>
  );
}

export default PlayToggleButton;
