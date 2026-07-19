import {useCallback, useEffect, useState} from "react";

import {useTheme} from "../../context/useTheme";
import AnimatedModalShell from "./AnimatedModalShell";
import {localizedModule} from "../../i18n/locale";
import {t} from "../../i18n/ui";

const legalContent = localizedModule(import.meta.glob("../../content/{en,ar,tr}/legal.json", {eager: true, import: "default"}), "../../content/en/legal.json");

function LegalModal({type, onClose}) {
  const {isDarkMode} = useTheme();
  const [activeType, setActiveType] = useState(type);
  const content = activeType ? legalContent[activeType] : null;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!type) return undefined;

    const frame = requestAnimationFrame(() => setActiveType(type));
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [type]);

  if (!content) return null;

  const modalBg = isDarkMode ? "bg-black text-white" : "bg-white text-black";
  const overlayBg = isDarkMode ? "bg-black/70" : "bg-white/70";
  const borderColor = isDarkMode ? "border-white/15" : "border-black/15";

  return (
    <AnimatedModalShell
      isOpen={Boolean(type)}
      onRequestClose={handleClose}
      onExited={() => setActiveType(null)}
      closeDurationMs={500}
      ariaLabelledBy="legal-modal-title"
      containerClassName="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6 sm:px-6"
      overlayClassName={`absolute inset-0 ${overlayBg} cursor-default backdrop-blur-sm transition-opacity duration-500 ease-out`}
      panelClassName={`relative flex max-h-[min(760px,calc(100svh-48px))] w-full max-w-[760px] flex-col overflow-hidden rounded-[28px] border ${borderColor} ${modalBg} shadow-[0_32px_90px_rgba(0,0,0,0.38)] transition-all duration-500 ease-out`}
      hiddenClassName="translate-y-24 scale-[0.98] opacity-0"
      visibleClassName="translate-y-0 scale-100 opacity-100"
    >
        <div className="flex shrink-0 items-start justify-between gap-5 border-b border-[#37B478]/25 px-6 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <span className="mb-3 block size-5 rounded-full bg-[#37B478]" />
            <h2 id="legal-modal-title" className="m-0 text-2xl font-bold sm:text-3xl">
              {content.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("close")}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-[#37B478]/50 text-current transition hover:bg-[#37B478] hover:text-black active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6L18 18" />
              <path d="M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <p className="m-0 text-base leading-7 opacity-85 sm:text-lg">{content.intro}</p>
          <div className="mt-7 grid gap-5">
            {content.sections.map((section) => (
              <article key={section.heading} className="rounded-[22px] border border-[#37B478]/30 bg-[#37B478]/5 p-5">
                <h3 className="m-0 text-lg font-bold">{section.heading}</h3>
                <p className="mb-0 mt-3 text-sm leading-6 opacity-80 sm:text-base">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
    </AnimatedModalShell>
  );
}

export default LegalModal;
