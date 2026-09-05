import {useRef, useState} from "react";

const historyRangeStyles = `
  .history-scroll-area::-webkit-scrollbar {
    display: none;
  }

  .history-scroll-area {
    scrollbar-width: none;
  }

  .history-range::-webkit-slider-runnable-track {
    height: 2px;
    border-radius: 999px;
    background: #37B478;
  }

  .history-range::-webkit-slider-thumb {
    appearance: none;
    width: 30px;
    height: 30px;
    margin-top: -13px;
    border-radius: 999px;
    background: #37B478;
    box-shadow: 0 0 16px rgba(55, 180, 120, 0.45);
    cursor: grab;
  }

  .history-range:active::-webkit-slider-thumb {
    cursor: grabbing;
  }

  .history-range::-moz-range-track {
    height: 2px;
    border-radius: 999px;
    background: #37B478;
  }

  .history-range::-moz-range-thumb {
    width: 28px;
    height: 8px;
    border: 0;
    border-radius: 999px;
    background: #37B478;
    box-shadow: 0 0 16px rgba(55, 180, 120, 0.45);
    cursor: grab;
  }
`;

function HistorySection({content, image, textColor}) {
  const historyScrollRef = useRef(null);
  const historyDragRef = useRef({active: false, startX: 0, scrollLeft: 0});
  const [historyScrollProgress, setHistoryScrollProgress] = useState(0);
  const [isHistoryDragging, setIsHistoryDragging] = useState(false);

  const updateHistoryScrollProgress = () => {
    const element = historyScrollRef.current;

    if (!element) return;

    const scrollableWidth = element.scrollWidth - element.clientWidth;
    const progress = scrollableWidth
      ? (element.scrollLeft / scrollableWidth) * 100
      : 0;

    setHistoryScrollProgress(progress);
  };

  const handleHistoryRangeChange = (event) => {
    const element = historyScrollRef.current;
    const progress = Number(event.target.value);

    setHistoryScrollProgress(progress);

    if (!element) return;

    const scrollableWidth = element.scrollWidth - element.clientWidth;
    element.scrollLeft = (scrollableWidth * progress) / 100;
  };

  const handleHistoryPointerDown = (event) => {
    const element = historyScrollRef.current;

    if (!element) return;

    historyDragRef.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: element.scrollLeft,
    };

    setIsHistoryDragging(true);
    element.setPointerCapture?.(event.pointerId);
  };

  const handleHistoryPointerMove = (event) => {
    const element = historyScrollRef.current;

    if (!element || !historyDragRef.current.active) return;

    element.scrollLeft =
      historyDragRef.current.scrollLeft -
      (event.clientX - historyDragRef.current.startX);
    updateHistoryScrollProgress();
  };

  const stopHistoryDrag = (event) => {
    const element = historyScrollRef.current;

    historyDragRef.current.active = false;
    setIsHistoryDragging(false);

    if (element?.hasPointerCapture?.(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section className="relative flex flex-col items-start gap-8 py-14">
      <style>{historyRangeStyles}</style>
      <div className="flex w-full flex-col items-center gap-2 px-4 sm:px-6 lg:px-28">
        <div className="size-6 rounded-full bg-[#37B478]" />
        <h2 className={`font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold ${textColor}`}>
          {content.title}
        </h2>
      </div>

      <div
        ref={historyScrollRef}
        onScroll={updateHistoryScrollProgress}
        onPointerDown={handleHistoryPointerDown}
        onPointerMove={handleHistoryPointerMove}
        onPointerUp={stopHistoryDrag}
        onPointerCancel={stopHistoryDrag}
        onPointerLeave={stopHistoryDrag}
        className={`history-scroll-area relative z-10 h-[770px] w-full select-none overflow-x-auto overflow-y-hidden ${
          isHistoryDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <img loading="lazy"
          src={image}
          alt=""
          aria-hidden
          draggable={false}
          className="h-[770px] w-[2500px] max-w-none object-fill"
        />
      </div>

      <div className="relative z-20 flex w-full justify-center px-4 sm:px-6 lg:px-28">
        <input
          aria-label={content.rangeLabel}
          type="range"
          min="0"
          max="100"
          value={historyScrollProgress}
          onChange={handleHistoryRangeChange}
          className="history-range h-4 w-full cursor-grab appearance-none bg-transparent active:cursor-grabbing"
        />
      </div>
    </section>
  );
}

export default HistorySection;
