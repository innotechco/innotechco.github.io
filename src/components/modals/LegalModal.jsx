import {useCallback, useEffect, useState} from "react";

import {useTheme} from "../../context/useTheme";
import AnimatedModalShell from "./AnimatedModalShell";

const legalContent = {
  cookies: {
    title: "Cookie Policy",
    intro:
      "INNOTECH uses essential cookies to keep the website reliable and may use analytics-style signals to understand how visitors move through our pages.",
    sections: [
      {
        heading: "What cookies support",
        body: "Cookies can help remember basic preferences, protect forms from abuse, measure page performance, and improve content such as insight pages, partner pages, and report navigation.",
      },
      {
        heading: "Your control",
        body: "You can limit or delete cookies through your browser settings. Some essential site features, including contact forms and navigation preferences, may work less smoothly when cookies are disabled.",
      },
    ],
  },
  gdpr: {
    title: "GDPR",
    intro:
      "INNOTECH treats personal data as limited business contact information and handles it with transparency, purpose limitation, and reasonable security controls.",
    sections: [
      {
        heading: "Data we may process",
        body: "When you contact us, request a demo, ask about reports, or interact with partner-related services, we may process your name, business email, company, region, industry, and message.",
      },
      {
        heading: "Rights and requests",
        body: "Depending on your location, you may request access, correction, deletion, restriction, portability, or objection to processing. You can contact us at Info@innotech.global for privacy-related requests.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    intro:
      "This policy explains how INNOTECH uses information submitted through the website to respond to business requests and improve our services.",
    sections: [
      {
        heading: "How information is used",
        body: "We use submitted information to respond to inquiries, prepare meetings, provide service or report information, improve website experience, and maintain business records where required.",
      },
      {
        heading: "Sharing and retention",
        body: "We do not sell personal information. We may share limited details with service providers or relevant partners when needed to answer a request. Data is retained only as long as needed for the related business purpose.",
      },
    ],
  },
  terms: {
    title: "Terms of Use",
    intro:
      "By using this website, you agree to use INNOTECH content, services, and report information for lawful business evaluation purposes.",
    sections: [
      {
        heading: "Website content",
        body: "Articles, service descriptions, partner information, visuals, and report summaries are provided for general information and may change without notice.",
      },
      {
        heading: "No misuse",
        body: "You may not copy, scrape, disrupt, reverse engineer, or misuse the website, its forms, or its content. Commercial use of reports or materials may require a separate agreement.",
      },
    ],
  },
};

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
            aria-label="Close"
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
