  import {useEffect, useMemo, useRef, useState} from "react";

  import PartnerToolCard from "../components/PartnerToolCard";
  import PartnerToolsControls from "../components/PartnerToolsControls";
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
    const swipeStartRef = useRef({active: false, startX: 0, startY: 0, horizontal: null, captured: false});
    const cards = content.tools.cards;
    const [visibleCount, setVisibleCount] = useState(() => {
      if (typeof window === "undefined") return 1;
      if (window.innerWidth >= 1280) return 3;
      if (window.innerWidth >= 1024) return 2;
      return 1;
    });
    const greenButtonHoverTextColor = isDarkMode
      ? "hover:text-black"
      : "hover:text-white";
    const visibleCards = useMemo(
      () => getVisibleCards(cards, activeIndex, visibleCount),
      [activeIndex, cards, visibleCount],
    );

    useEffect(() => {
      const updateVisibleCount = () => {
        if (window.innerWidth >= 1280) {
          setVisibleCount(3);
        } else if (window.innerWidth >= 1024) {
          setVisibleCount(2);
        } else {
          setVisibleCount(1);
        }
      };

      updateVisibleCount();
      window.addEventListener("resize", updateVisibleCount);
      return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);
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

          <div className="relative w-full overflow-visible">
            <PartnerToolsControls
              disabled={isAnimating}
              onNext={() => move("next")}
              onPrevious={() => move("prev")}
              textColorClassName={greenButtonHoverTextColor}
            />

            <div
                ref={trackRef}
                onPointerDown={(event) => {
                  swipeStartRef.current = {
                    active: true,
                    startX: event.clientX,
                    startY: event.clientY,
                    horizontal: null,
                    captured: false,
                  };
                }}
                onPointerMove={(event) => {
                  const swipe = swipeStartRef.current;
                  if (!swipe.active) return;

                  const deltaX = event.clientX - swipe.startX;
                  const deltaY = event.clientY - swipe.startY;

                  if (swipe.horizontal === null) {
                    if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
                    swipe.horizontal = Math.abs(deltaX) > Math.abs(deltaY);
                    if (!swipe.horizontal) {
                      swipe.active = false;
                      return;
                    }
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                    swipe.captured = true;
                  }

                  if (!swipe.horizontal) return;

                  event.preventDefault();
                }}
                onPointerUp={(event) => {
                  const swipe = swipeStartRef.current;
                  if (!swipe.active) {
                    if (swipe.captured) {
                      event.currentTarget.releasePointerCapture?.(event.pointerId);
                    }
                    swipeStartRef.current = {active: false, startX: 0, startY: 0, horizontal: null, captured: false};
                    return;
                  }

                  const delta = event.clientX - swipe.startX;
                  swipeStartRef.current = {active: false, startX: 0, startY: 0, horizontal: null, captured: false};
                  if (swipe.captured) {
                    event.currentTarget.releasePointerCapture?.(event.pointerId);
                  }
                  if (Math.abs(delta) >= 48) move(delta < 0 ? "next" : "prev");
                }}
                onPointerCancel={(event) => {
                  const swipe = swipeStartRef.current;
                  if (swipe.captured) {
                    event.currentTarget.releasePointerCapture?.(event.pointerId);
                  }
                  swipeStartRef.current = {active: false, startX: 0, startY: 0, horizontal: null, captured: false};
                }}
                className={`partner-tools-track grid min-w-0 touch-pan-y grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 px-14 sm:px-16 md:px-20 lg:px-24 xl:px-28 2xl:px-32 justify-items-center ${
                  isAnimating ? "partner-tools-track--animating" : ""
                }`}
                style={trackHeight ? { height: `${trackHeight}px` } : undefined}
              >
                {displayedCards.map(({ card, key, style }) => (
                  <PartnerToolCard
                    key={key}
                    assets={assets}
                    card={card}
                    isDarkMode={isDarkMode}
                    style={style}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  export default PartnerToolsSection;
