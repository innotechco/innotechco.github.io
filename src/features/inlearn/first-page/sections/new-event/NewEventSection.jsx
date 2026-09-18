import {Link} from "react-router-dom";

import ContentSkeleton, {SkeletonStatus} from "../../../../../shared/components/ui/ContentSkeleton.jsx";
import RemoteImage from "../../../../../shared/components/ui/RemoteImage.jsx";
import {buildLatestNewsFromPost, getArticlePath} from "../../../../../shared/content/blogSections.js";
import {t} from "../../../../../shared/i18n/ui.js";
import {useBlogPosts} from "../../../../../shared/hooks/useBlogPosts.js";
import useCarousel from "../../../../../shared/hooks/useCarousel.js";

const EVENT_COUNT = 3;

/* The newest posts, in INLEARN's frame, one at a time.

   The articles are the same ones the home page leads with: this reads
   useBlogPosts and buildLatestNewsFromPost directly rather than borrowing
   HomeContentProvider, which would also fetch the home hero and the whole home
   document for the sake of one card.

   While WordPress is still answering, a skeleton stands in. Painting the
   bundled words and swapping them a moment later is the one behaviour that
   reliably looks broken. */
function NewEventSection({newEvent}) {
  const {posts, status} = useBlogPosts();
  const isLoading = status === "loading";

  const events = posts.slice(0, EVENT_COUNT).map((post) => buildLatestNewsFromPost(newEvent, post));
  /* One card either way: with nothing from WordPress the bundled copy is still
     a card, so the section never collapses to an empty row. */
  const slides = events.length ? events : [newEvent];

  const {index, viewportRef, go, step, handlers} = useCarousel(slides.length);

  return (
    <section className="inlearn-event" aria-labelledby="inlearn-event-title">
      <h2 id="inlearn-event-title" className="inlearn-section-title inlearn-event-title">
        {newEvent.sectionTitle}
      </h2>

      <div className="inlearn-carousel">
        <CarouselArrow
          direction="prev"
          label={newEvent.previous}
          disabled={slides.length < 2}
          onClick={() => step(-1)}
        />

        <div className="inlearn-carousel-viewport" ref={viewportRef} {...handlers}>
          <div
            className="inlearn-carousel-track"
            /* One step is the card plus the empty road beside it, and the road
               is a number the stylesheet owns - so widening the gap there moves
               the travel with it and the two can never fall out of step. */
            style={{
              transform: `translate3d(calc(${-index} * (100% + var(--inlearn-event-gap))), 0, 0)`,
            }}
          >
            {slides.map((event, slideIndex) => (
              <div
                className="inlearn-carousel-slide"
                key={event.slug ?? slideIndex}
                /* Hidden from the reading order while off-screen, so a screen
                   reader is not handed three headlines for one visible card. */
                aria-hidden={slideIndex !== index}
              >
                <EventCard
                  event={event}
                  readMore={newEvent.readMore}
                  isLoading={isLoading}
                  isVisible={slideIndex === index}
                />
              </div>
            ))}
          </div>
        </div>

        <CarouselArrow
          direction="next"
          label={newEvent.next}
          disabled={slides.length < 2}
          onClick={() => step(1)}
        />

        {/* The dots sit inside the carousel rather than under it so that the
            arrows can join them on a narrow screen. There is one set of arrows
            at every width - a second set for phones would be two controls doing
            one job, and a screen reader would read both. Where they stand is
            the stylesheet's business: beside the card while there is room, in
            this row with the dots when there is not. */}
        {slides.length > 1 ? (
          <div className="inlearn-carousel-dots" role="tablist" aria-label={newEvent.sectionTitle}>
            {slides.map((event, dotIndex) => (
              <button
                key={event.slug ?? dotIndex}
                type="button"
                role="tab"
                aria-selected={dotIndex === index}
                aria-label={`${dotIndex + 1} / ${slides.length}`}
                className={dotIndex === index ? "is-current" : ""}
                onClick={() => go(dotIndex)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CarouselArrow({direction, label, disabled, onClick}) {
  return (
    <button
      type="button"
      className={`inlearn-carousel-arrow is-${direction}`}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          d={direction === "prev" ? "M15 4L7 12l8 8" : "M9 4l8 8-8 8"}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

function EventCard({event, readMore, isLoading, isVisible = false}) {
  const articlePath = getArticlePath(event.slug);

  return (
    <article className="inlearn-event-card">
      <div className="inlearn-event-media">
        {isLoading || !event.image ? (
          <ContentSkeleton className="h-full w-full" isDarkMode rounded="rounded-none" />
        ) : (
          /* srcSet lists what WordPress has; sizes tells the browser how wide
             this picture will actually be drawn, so it can choose before the
             layout exists. The column is 42% of the card on a monitor and the
             whole card below 860, where the card stacks. */
          <RemoteImage
            src={event.image}
            srcSet={event.imageSrcSet}
            sizes="(max-width: 860px) 100vw, 42vw"
            alt={event.imageAlt || ""}
            /* Every card keeps its picture, so moving between them shows a
               picture rather than a gap where one is being fetched. What
               changes is the order they are fetched in: the card on screen
               first and at once, the others after it and out of its way.

               They used to compete, which is why all three arrived together
               and slowly. Now they are 32KB each: the visible one is asked for
               first and at high priority, the other two follow behind it, and
               by the time an arrow is pressed they are already there. Holding
               them back further only trades one gap for another. */
            loading={isVisible ? "eager" : "lazy"}
            fetchPriority={isVisible ? "high" : "auto"}
            decoding="async"
          />
        )}
      </div>

      <div className="inlearn-event-body">
        {isLoading ? (
          <div className="inlearn-event-loading">
            <SkeletonStatus label={t("loading")} />
            <ContentSkeleton className="h-7 w-11/12" isDarkMode />
            <ContentSkeleton className="h-7 w-3/4" isDarkMode />
            <ContentSkeleton className="h-4 w-1/2" isDarkMode />
            <ContentSkeleton className="h-4 w-full" isDarkMode />
            <ContentSkeleton className="h-4 w-full" isDarkMode />
            <ContentSkeleton className="h-4 w-2/3" isDarkMode />
          </div>
        ) : (
          <>
            <h3 className="inlearn-event-headline">{event.headline}</h3>

            <p className="inlearn-event-meta">
              <span>{event.date}</span>
              {event.readTime ? <span className="is-accent">{event.readTime}</span> : null}
            </p>

            <p className="inlearn-event-summary">{event.summary}</p>

            {/* Only a link when there is an article behind it: a "Read more"
                that goes nowhere is worse than none. */}
            {articlePath ? (
              <Link className="inlearn-event-more" to={articlePath}>
                {readMore}
              </Link>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}

export default NewEventSection;
