import {useMemo} from "react";
import {Link, useParams} from "react-router-dom";

import CourseBuyCard from "./CourseBuyCard.jsx";
import Price from "./CoursePrice.jsx";
import RelatedCourses from "./RelatedCourses.jsx";
import {
  CalendarIcon,
  CertificateIcon,
  ClockIcon,
  GlobeIcon,
  LanguageIcon,
  TagIcon,
} from "../../components/icons.jsx";
import {useInlearnCatalogue} from "../../useInlearnCatalogue.js";
import {getInlearnCourse} from "../../inlearnContent.js";
import {routes} from "../../../../app/routes.js";

/* One course, at its own address.

   The page is three blocks that are edited by three different people, and they
   are kept apart on purpose - the same rule the rest of the site follows:

     the words     title, about, categories, instructor   the writer
     the picture   named in inlearn.config.js             the designer
     the numbers   price, dates, duration, certificate    whoever sells it

   Nothing here reads WordPress yet. It reads the catalogue in src/content, and
   that catalogue is the seam: the day the courses move to WordPress, this page
   does not change. */
function CoursePage() {
  const {slug} = useParams();
  const snapshot = useInlearnCatalogue();
  const {catalogue, course} = useMemo(() => getInlearnCourse(slug, snapshot), [slug, snapshot]);
  const labels = catalogue.detail;

  if (!course) {
    return (
      <div className="inlearn-course-page inlearn-course-missing">
        <h1 className="inlearn-course-heading">{labels.notFound}</h1>
        <Link className="inlearn-hero-cta" to={routes.inlearnCourses}>
          {labels.backToCourses}
        </Link>
      </div>
    );
  }

  return (
    <div className="inlearn-course-page">
      <article className="inlearn-course-layout">
        {/* The title is a child of the layout rather than of the reading
            column, so that on one column the buy card can come between the two:
            the price is the first thing anybody asks, and on a phone a card
            below every word of the page is a card nobody scrolls to. */}
        <header className="inlearn-course-head">
            {/* The only H1 on the page. Everything under it is an H2, so the
                outline a search engine reads matches the one a person sees. */}
            <h1 className="inlearn-course-heading">{course.title}</h1>

          {course.modeLabel ? (
            <span className="inlearn-course-mode">
              <GlobeIcon size={14} />
              {course.modeLabel}
            </span>
          ) : null}
        </header>

        <CourseBuyCard course={course} catalogue={catalogue} />

        <div className="inlearn-course-main">
          <section className="inlearn-course-section is-about" aria-labelledby="course-about">
            <h2 id="course-about" className="inlearn-course-subheading">
              {labels.about}
            </h2>
            {course.about?.map((paragraph, index) => (
              <p className="inlearn-course-paragraph" key={index}>
                {paragraph}
              </p>
            ))}
          </section>

          <section className="inlearn-course-section" aria-labelledby="course-category">
            <h2 id="course-category" className="inlearn-course-subheading">
              {labels.category}
            </h2>
            {/* Each chip opens All Courses in a new tab with that category
                already chosen. A new tab because the visitor is in the middle of
                reading this course - browsing a category is a side trip, and
                taking the page away from under them to make it is rude.

                A plain anchor rather than a Link: a new tab is a new document,
                and the router has nothing to do with it. rel="noopener" because
                any target="_blank" without it hands the new page a handle on
                this one. */}
            <ul className="inlearn-course-chips">
              {course.categoryChips.map((chip) => (
                <li key={chip.id}>
                  <a
                    className="inlearn-course-tag"
                    href={`${routes.inlearnCourses}?tags=${chip.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {chip.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="inlearn-course-section" aria-labelledby="course-details">
            <h2 id="course-details" className="inlearn-course-subheading">
              {labels.details}
            </h2>

            {/* A description list, not a table: these are name and value pairs,
                and that is what a screen reader is told they are. Two columns on
                a wide screen is the stylesheet's business. */}
            <dl className="inlearn-course-specs">
              <Spec icon={<CalendarIcon />} label={labels.startDate} value={course.date} />
              <Spec icon={<LanguageIcon />} label={labels.language} value={course.language} />
              <Spec icon={<ClockIcon />} label={labels.duration} value={course.effort} />
              <Spec
                icon={<TagIcon />}
                label={labels.price}
                value={
                  <Price
                    amount={course.price}
                    compareAt={course.compareAtPrice}
                    currency={catalogue.currency}
                  />
                }
              />
              <Spec
                icon={<CertificateIcon />}
                label={labels.certificate}
                value={course.certificate ? labels.yes : labels.no}
              />
            </dl>
          </section>

          {course.instructors.length ? (
            <section className="inlearn-course-section" aria-labelledby="course-instructor">
              <h2 id="course-instructor" className="inlearn-course-subheading">
                {labels.instructor}
              </h2>

              <ul className="inlearn-course-instructors">
                {course.instructors.map((instructor) => (
                  <li className="inlearn-course-instructor" key={instructor.id}>
                    <img
                      className="inlearn-course-instructor-photo"
                      src={instructor.image}
                      alt=""
                      loading="lazy"
                    />
                    <div>
                      <p className="inlearn-course-instructor-name">{instructor.name}</p>
                      {instructor.role ? (
                        <p className="inlearn-course-instructor-role">{instructor.role}</p>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </article>

      <RelatedCourses
        courses={course.related}
        labels={{
          related: labels.related,
          previous: labels.previous,
          next: labels.next,
          readMore: catalogue.readMore,
          save: catalogue.save,
          share: catalogue.share,
        }}
      />
    </div>
  );
}

function Spec({icon, label, value}) {
  if (!value) return null;

  return (
    <div className="inlearn-course-spec">
      <dt>
        {icon}
        <span>{label}</span>
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

export default CoursePage;
