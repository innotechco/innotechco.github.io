import {getInlearnFirstPage} from "../inlearnContent.js";
import PageDecorations from "./PageDecorations.jsx";
import HeroSection from "./sections/hero/HeroSection.jsx";
import LearningSolutionsSection from "./sections/learning-solutions/LearningSolutionsSection.jsx";
import NewEventSection from "./sections/new-event/NewEventSection.jsx";
import TopCoursesSection from "./sections/top-courses/TopCoursesSection.jsx";

/* The first page: the sections in order, and the arcs behind all of them.

   The arcs live here rather than inside a section because the right-hand one
   starts beside the hero and ends level with the course list. Put it in the
   hero and the first `overflow: hidden` down the tree cuts it in half; put it
   here and it is free to cross every boundary it was drawn to cross.

   Where each one sits is in inlearn.config.js, not here. */
function FirstPage() {
  const page = getInlearnFirstPage();

  return (
    <div className="inlearn-first-page">
      <PageDecorations
        decorations={page.decorations}
        smallScreenDecorations={page.decorationsOnSmallScreens}
      />

      <HeroSection hero={page.hero} />
      <NewEventSection newEvent={page.newEvent} />
      <TopCoursesSection topCourses={page.topCourses} />
      <LearningSolutionsSection learningSolutions={page.learningSolutions} />
    </div>
  );
}

export default FirstPage;
