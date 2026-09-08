import {Link} from "react-router-dom";

import inlearnMark from "../../../shared/assets/brand/services/inlearn.svg";
import {inlearnCopy} from "../data/inlearnContent.js";

function InlearnHero() {
  return (
    <section className="inlearn-hero" aria-label="INLEARN Academy">
      <div className="inlearn-arc inlearn-arc-one" aria-hidden="true" />
      <div className="inlearn-arc inlearn-arc-two" aria-hidden="true" />
      <div className="inlearn-hero-copy">
        <img src={inlearnMark} alt="" aria-hidden="true" loading="lazy" />
        <h1>{inlearnCopy.heroTitle}</h1>
        <h2>{inlearnCopy.heroSubtitle}</h2>
        <p>{inlearnCopy.heroBody}</p>
        <Link to="/inlearn/courses">Visit All Courses</Link>
      </div>
    </section>
  );
}

export default InlearnHero;
