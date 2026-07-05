  import {useEffect, useMemo, useRef, useState} from "react";

  import PartnerArrow from "../components/PartnerArrow";
  import SectionHeading from "../components/SectionHeading";

  function getVisibleCards(cards, activeIndex, count) {
    return Array.from({length: Math.min(count, cards.length)}, (_, index) => {
      const cardIndex = (activeIndex + index) % cards.length;
      return cards[cardIndex];
    });
  }

  function getCardAt(cards, index) {
    return cards[(index + cards.length) % cards.length];
  }

  const CARD_ANIMATION_MS = 680;

  function PartnerToolsSection({assets, content, isDarkMode}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [transitionCards, setTransitionCards] = useState(null);
    const [trackHeight, setTrackHeight] = useState(null);
    const animationTimeoutRef = useRef(null);
    const trackRef = useRef(null);
    const swipeStartRef = useRef(null);
    const cards = content.tools.cards;
    const visibleCount = Math.min(1, cards.length);
    const textColor = isDarkMode ? "text-white" : "text-black";
    const greenButtonHoverTextColor = isDarkMode
      ? "hover:text-black"
      : "hover:text-white";
    const visibleCards = useMemo(
      () => getVisibleCards(cards, activeIndex, visibleCount),
      [activeIndex, cards, visibleCount],
    );
    const displayedCards =
      transitionCards ??
      visibleCards.map((card) => ({
        card,
        key: card.id,
        style: null,
      }));
    const isAnimating = transitionCards !== null;

    useEffect(
      () => () => {
        window.clearTimeout(animationTimeoutRef.current);
      },
      [],
    );

    const move = (direction) => {
      if (isAnimating || cards.length <= visibleCount) return;

      const nextActiveIndex =
        direction === "next"
          ? (activeIndex + 1) % cards.length
          : (activeIndex - 1 + cards.length) % cards.length;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActiveIndex(nextActiveIndex);
        return;
      }

      const track = trackRef.current;
      const cardNodes = Array.from(
        track?.querySelectorAll("[data-partner-tool-card]") ?? [],
      );

      if (!track || cardNodes.length !== visibleCount) {
        setActiveIndex(nextActiveIndex);
        return;
      }

      const trackRect = track.getBoundingClientRect();
      const cardRects = cardNodes.map((node) => {
        const rect = node.getBoundingClientRect();
        return {
          height: rect.height,
          left: rect.left - trackRect.left,
          top: rect.top - trackRect.top,
          width: rect.width,
        };
      });
      const slotGap =
        cardRects[1]?.left - cardRects[0]?.left - cardRects[0]?.width || 32;
      const slotStep = cardRects[0].width + slotGap;
      const oldCards = getVisibleCards(cards, activeIndex, visibleCount);
      const incomingCard =
        direction === "next"
          ? getCardAt(cards, activeIndex + visibleCount)
          : getCardAt(cards, activeIndex - 1);

      const makeStyle = (fromRect, toLeft, fade) => ({
        "--partner-tools-from-left": `${fromRect.left}px`,
        "--partner-tools-from-top": `${fromRect.top}px`,
        "--partner-tools-height": `${fromRect.height}px`,
        "--partner-tools-to-left": `${toLeft}px`,
        "--partner-tools-to-opacity": fade === "out" ? 0 : 1,
        "--partner-tools-width": `${fromRect.width}px`,
      });

      const movingCards =
        direction === "next"
          ? oldCards.map((card, index) => ({
              card,
              key: `${card.id}-move`,
              style: makeStyle(
                cardRects[index],
                cardRects[index].left - slotStep,
                index === 0 ? "out" : "in",
              ),
            }))
          : oldCards.map((card, index) => ({
              card,
              key: `${card.id}-move`,
              style: makeStyle(
                cardRects[index],
                cardRects[index].left + slotStep,
                index === visibleCount - 1 ? "out" : "in",
              ),
            }));
      const incomingRect =
        direction === "next"
          ? {
              ...cardRects[visibleCount - 1],
              left: cardRects[visibleCount - 1].left + slotStep,
            }
          : {...cardRects[0], left: cardRects[0].left - slotStep};
      const incoming = {
        card: incomingCard,
        key: `${incomingCard.id}-enter`,
        style: {
          ...makeStyle(
            incomingRect,
            direction === "next"
              ? cardRects[visibleCount - 1].left
              : cardRects[0].left,
            "in",
          ),
          "--partner-tools-from-opacity": 0,
        },
      };

      window.clearTimeout(animationTimeoutRef.current);
      setTrackHeight(trackRect.height);
      setTransitionCards(
        direction === "next" ? [...movingCards, incoming] : [incoming, ...movingCards],
      );

      animationTimeoutRef.current = window.setTimeout(() => {
        setActiveIndex(nextActiveIndex);
        setTransitionCards(null);
        setTrackHeight(null);
      }, CARD_ANIMATION_MS);
    };

    return (
      <section className="px-6 pb-36 pt-16 md:px-16 md:pb-44 xl:px-[120px]">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-12">
          <SectionHeading isDarkMode={isDarkMode}>
            {content.tools.title}
          </SectionHeading>

          <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
            <button
              type="button"
              onClick={() => move("prev")}
              disabled={isAnimating}
              aria-label="Previous partner tool"
              className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-[#37B478] text-[#37B478] transition-colors hover:bg-[#37B478] disabled:pointer-events-none disabled:opacity-50 ${greenButtonHoverTextColor}`}
            >
              <PartnerArrow direction="left" />
            </button>

            <div
                ref={trackRef}
                onPointerDown={(event) => {
                  swipeStartRef.current = event.clientX;
                  event.currentTarget.setPointerCapture?.(event.pointerId);
                }}
                onPointerUp={(event) => {
                  const startX = swipeStartRef.current;
                  swipeStartRef.current = null;
                  if (startX == null) return;
                  const delta = event.clientX - startX;
                  if (Math.abs(delta) >= 48) move(delta < 0 ? "next" : "prev");
                }}
                onPointerCancel={() => { swipeStartRef.current = null; }}
                className={`partner-tools-track grid min-w-0 touch-pan-y grid-cols-1 gap-8 ${
                  isAnimating ? "partner-tools-track--animating" : ""
                }`}
                style={trackHeight ? { height: `${trackHeight}px` } : undefined}
              >
                {displayedCards.map(({ card, key, style }) => (
                  <article
                    key={key}
                    data-partner-tool-card
                    style={style ?? undefined}
                    className={`partner-tools-card group h-[380px] min-h-[380px] min-w-0 rounded-3xl border border-[#37B478]/20 bg-green-500/5 p-9 shadow-[inset_1px_-1px_2px_0px_rgba(29,95,63,1)] transition-all duration-500 ease-out hover:-translate-y-3 hover:border-[#37B478]/80 hover:bg-[#37B478]/10 hover:shadow-[inset_1px_-1px_2px_0px_rgba(55,180,120,1),0_24px_55px_-32px_rgba(55,180,120,0.9)] flex flex-col`}   // ← اضافه شد
                  >
                    <img
                      loading="lazy"
                      src={assets.cardIcons[card.icon]}
                      alt=""
                      aria-hidden
                      className="size-24 object-contain transition-transform duration-500 ease-out group-hover:scale-105 [filter:brightness(0)_saturate(100%)_invert(56%)_sepia(51%)_saturate(599%)_hue-rotate(96deg)_brightness(94%)_contrast(88%)] flex-shrink-0" 
                    />
                    <h3 className={`mt-4 font-['Gotham'] text-2xl font-bold ${textColor}`}>
                      {card.title}
                    </h3>
                    <p className={`mt-4 font-['Gotham'] text-base leading-normal ${textColor} flex-grow`}>
                      {card.description}
                    </p>
                  </article>
                ))}
            </div>

            <button
              type="button"
              onClick={() => move("next")}
              disabled={isAnimating}
              aria-label="Next partner tool"
              className={`flex size-10 shrink-0 items-center justify-center rounded-full border border-[#37B478] text-[#37B478] transition-colors hover:bg-[#37B478] disabled:pointer-events-none disabled:opacity-50 ${greenButtonHoverTextColor}`}
            >
              <PartnerArrow />
            </button>
          </div>
        </div>
      </section>
    );
  }

  export default PartnerToolsSection;
