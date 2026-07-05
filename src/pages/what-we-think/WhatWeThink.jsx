import {useTheme} from "../../context/useTheme";
import BlackExcludeLeftWhatWeThink from "../../assets/images/excludes/what-we-think/BlackExcludeLeftWhatWeThink.webp";
import BlackExcludeRightWhatWeThink from "../../assets/images/excludes/what-we-think/BlackExcludeRightWhatWeThink.webp";
import ExcludeLeftWhatWeThink from "../../assets/images/excludes/what-we-think/ExcludeLeftWhatWeThink.webp";
import ExcludeRightWhatWeThink from "../../assets/images/excludes/what-we-think/ExcludeRightWhatWeThink.webp";
import {cards} from "./data";
import {usePointerGlow} from "../../hooks/usePointerGlow";
import ReadMoreLink from "../../components/ui/ReadMoreLink";
import {routes} from "../../routes";

function ArticleCopy({card, metaLayout = "stack", isDarkMode}) {
  return (
    <div className="what-we-think-copy">
      <h2>{card.title}</h2>
      <div className={`what-we-think-meta what-we-think-meta--${metaLayout}`}>
        <span>{card.date}</span>
        <span>{card.readTime}</span>
      </div>
      <p>{card.description}</p>
      <ReadMoreLink
        isDarkMode={isDarkMode}
        className="what-we-think-read-more"
      />
    </div>
  );
}

function ImagePane({card}) {
  return (
    <div className="what-we-think-image">
      <img loading="lazy" src={card.image} alt="" aria-hidden="true" />
    </div>
  );
}

function ArticleCard({
  card,
  variant,
  metaLayout = "stack",
  image = true,
  isDarkMode,
  className = "",
}) {
  const {position, handlers} = usePointerGlow();

  return (
    <div
      {...handlers}
      className={`what-we-think-card-shell what-we-think-card-shell--${variant} ${className}`}
    >
      <div
        className="what-we-think-card-glow"
        style={{
          opacity: position.active ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(55, 180, 120, 0.7), transparent 75%)`,
        }}
      />
      <article className={`what-we-think-card what-we-think-card--${variant}`}>
        <div className="what-we-think-card-tint" aria-hidden="true" />
        {image && <ImagePane card={card} />}
        <ArticleCopy
          card={card}
          metaLayout={metaLayout}
          isDarkMode={isDarkMode}
        />
      </article>
    </div>
  );
}

function WhatWeThink() {
  const {isDarkMode} = useTheme();
  const leftExclude = isDarkMode
    ? ExcludeLeftWhatWeThink
    : BlackExcludeLeftWhatWeThink;
  const rightExclude = isDarkMode
    ? ExcludeRightWhatWeThink
    : BlackExcludeRightWhatWeThink;

  return (
    <main className={`what-we-think-page ${isDarkMode ? "is-dark" : "is-light"}`}>
      <img loading="lazy"
        src={leftExclude}
        alt=""
        aria-hidden="true"
        className="what-we-think-decoration what-we-think-decoration--left -translate-y-75"
      />
      <img loading="lazy"
        src={rightExclude}
        alt=""
        aria-hidden="true"
        className="what-we-think-decoration what-we-think-decoration--right"
      />

      <header className="what-we-think-heading">
        <div />
        <h1>What we think</h1>
      </header>

      <section className="what-we-think-grid" aria-label="What we think">
        <ArticleCard card={cards.heroTop} variant="horizontal" metaLayout="between" isDarkMode={isDarkMode} />

        <div className="what-we-think-row">
          <ArticleCard card={cards.tallLeft} variant="tall" metaLayout="row" isDarkMode={isDarkMode} />
          <div className="what-we-think-stack">
            <ArticleCard card={cards.smallTopRight} variant="small" isDarkMode={isDarkMode} />
            <ArticleCard card={cards.smallBottomRight} variant="small" isDarkMode={isDarkMode} />
          </div>
        </div>

        <div className="what-we-think-row">
          <div className="what-we-think-stack">
            <ArticleCard card={cards.smallMiddleLeft} variant="small" isDarkMode={isDarkMode} />
            <div className="what-we-think-text-row">
              <ArticleCard card={cards.textCard1} variant="text" image={false} isDarkMode={isDarkMode} className="hide-mobile" />
              <ArticleCard card={cards.textCard2} variant="text" image={false} isDarkMode={isDarkMode} className="hide-mobile" />
            </div>
          </div>
          <ArticleCard card={cards.tallRight} variant="tall" metaLayout="row" isDarkMode={isDarkMode} />
        </div>

        <ArticleCard card={cards.heroBottom} variant="horizontal" metaLayout="between" isDarkMode={isDarkMode} />

        <div className="what-we-think-archives-link">
          <ReadMoreLink
            to={routes.archives}
            label="see all archives"
            isDarkMode={isDarkMode}
            align="end"
            className="font-['Gotham'] text-lg"
          />
        </div>
      </section>
    </main>
  );
}

export default WhatWeThink;
