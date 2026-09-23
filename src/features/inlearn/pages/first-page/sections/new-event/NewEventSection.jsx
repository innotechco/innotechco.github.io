import {Link} from "react-router-dom";

import ContentSkeleton, {SkeletonStatus} from "../../../../../../shared/components/ui/ContentSkeleton.jsx";
import RemoteImage from "../../../../../../shared/components/ui/RemoteImage.jsx";
import {t} from "../../../../../../shared/i18n/ui.js";
import useCarousel from "../../../../../../shared/hooks/useCarousel.js";
import CarouselArrow from "../../../../components/CarouselArrow.jsx";
import {GlobeIcon, OnSiteIcon} from "../../../../components/icons.jsx";
import {routes} from "../../../../../../app/routes.js";

/* The newest three courses, in INLEARN's frame, one at a time.

   It used to be the newest three ARTICLES - the same ones the home page leads
   with. The frame is unchanged: the same card, the same carousel, the same
   skeleton. What fills it is now the catalogue, because this is the academy's
   own first page and what is new here is a course, not a piece of writing.

   Which three is not decided in this file. The page hands them over already
   chosen, so that the cut between this row and Top Essential below it is made
   once - see getInlearnFirstPage. */

/* A course, in the shape this card has always drawn.
 *
 * Mapped rather than renamed at the point of use: the card reads headline,
 * meta and summary, and it should go on reading those whether they came from
 * an article or a course. */
function toEvent(course) {
  return {
    slug: course.id,
    headline: course.title,
    /* The two facts worth a line above the summary. The date is the course's
       own advertised start - the same one printed on its card everywhere else
       - and the accent beside it says how it is taught. */
    date: course.startDate ? formatStartDate(course.startDate) : "",
    mode: course.mode,
    modeLabel: course.modeLabel || "",
    /* The whole description rather than the one-line summary. The summary is
       what a grid of sixteen cards has room for; this card is one card at a
       time, at the top of the page, and it can say the rest. */
    about: course.about?.length ? course.about : [course.summary].filter(Boolean),
    image: course.image,
    imageAlt: course.imageAlt || "",
    /* A course has one picture rather than the set of sizes WordPress hands
       out, so there is nothing for the browser to choose between. */
    imageSrcSet: undefined,
    readMoreTo: `${routes.inlearnCourses}/${course.id}`,
  };
}

/* Written in the language of the page rather than stored as a sentence, so one
   date serves three translations. */
function formatStartDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"});
}

function NewEventSection({newEvent}) {
  const courses = newEvent.items ?? [];
  /* Nothing to wait for: the catalogue is either Strapi's or the copy bundled
     with the site, and one of those is always there. The skeleton below stays
     for the card that has no picture yet. */
  const isLoading = false;

  const events = courses.map(toEvent);
  /* One card either way: with an empty catalogue the bundled copy is still a
     card, so the section never collapses to an empty row. */
  const slides = events.length ? events : [newEvent];

  const {index, viewportRef, go, step, handlers} = useCarousel(slides.length);

  return (
    <section className="inlearn-event" aria-labelledby="inlearn-event-title">
      <h2 id="inlearn-event-title" className="inlearn-section-title inlearn-event-title">
        {newEvent.sectionTitle}
      </h2>

      <div className="inlearn-carousel">
        <CarouselArrow
          kind="event"
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
          kind="event"
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

function EventCard({event, readMore, isLoading, isVisible = false}) {
  const destination = event.readMoreTo;

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
              {/* How it is taught, as a pill rather than a word in the line.
                  It is the one fact here somebody scans for, and a pill is
                  found at a glance where a fourth phrase in a sentence is
                  read. */}
              {event.modeLabel ? (
                <span className="inlearn-event-mode">
                  {event.mode === "on-site" ? <OnSiteIcon /> : <GlobeIcon size={15} />}
                  {event.modeLabel}
                </span>
              ) : null}
            </p>

            <div className="inlearn-event-summary">
              {(event.about ?? []).map((paragraph, position) => (
                <p key={position}>{paragraph}</p>
              ))}
            </div>

            {/* Only a link when there is a course behind it: a "Read more"
                that goes nowhere is worse than none. */}
            {destination ? (
              <Link className="inlearn-event-more" to={destination}>
                <span>{readMore}</span>
                {/* Travels with the words on hover. Drawn here rather than
                    written as a character, so it takes the link's colour and
                    turns green with it. */}
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M5 12h13M12 5.5 18.5 12 12 18.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            ) : null}
          </>
        )}
      </div>
    </article>
  );
}

export default NewEventSection;
