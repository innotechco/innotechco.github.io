import {useTheme} from "../../../../app/providers/theme/useTheme.js";
import ReadMoreLink from "../../../../shared/components/ui/ReadMoreLink.jsx";
import {latestNewsBackground as LatestNewsImage} from "../../home.assets.js";
import {useHomeContent} from "../../../../app/providers/home-content/useHomeContent.js";
import {getArticlePath} from "../../../../shared/content/blogSections.js";
import ContentSkeleton, {SkeletonStatus} from "../../../../shared/components/ui/ContentSkeleton.jsx";
import {t} from "../../../../shared/i18n/ui.js";

function LatestNewsSection() {
  const {isDarkMode} = useTheme();
  const {content, postsStatus} = useHomeContent();
  const latestNews = content.latestNews;
  const latestNewsImage = latestNews.image || LatestNewsImage;
  /* This card is the newest WordPress post. Until it arrives the bundled copy
     would be shown and then replaced, so the article half renders as a
     skeleton instead. The section frame and title stay put so nothing jumps. */
  const isLoadingPost = postsStatus === "loading";

  return (
    <section
      className={`relative w-full px-4 py-[60px] sm:px-6 lg:px-35 transition-colors duration-500 ease-in-out ${
        isDarkMode ? "bg-black" : "bg-white"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <div
          className={`flex flex-col overflow-hidden rounded-[32px] transition-colors duration-500 ease-in-out min-[1400px]:h-[570px] min-[1400px]:flex-row min-[1400px]:rounded-[50px] ${
            isDarkMode ? "bg-white" : "bg-black"
          }`}
        >
          {/* Featured image */}
          <div className="order-1 h-64 w-full shrink-0 self-stretch overflow-hidden min-[1400px]:order-2 min-[1400px]:h-auto min-[1400px]:w-[496px]">
            {isLoadingPost ? (
              <ContentSkeleton
                className="h-full w-full min-[1400px]:min-h-[640px]"
                isDarkMode={!isDarkMode}
                rounded="rounded-none"
              />
            ) : (
              <img loading="lazy"
                src={latestNewsImage}
                alt={latestNews.imageAlt || "Latest news"}
                className="h-full w-full object-cover object-center min-[1400px]:min-h-[640px]"
              />
            )}
          </div>

          {/* LEFT CONTENT */}
          <div className="order-2 flex flex-1 flex-col self-stretch px-6 py-8 sm:px-10 min-[1400px]:order-1 min-[1400px]:px-[68px] min-[1400px]:py-[68px]">
            {/* Title */}
            <div className="locale-section-title relative inline-flex items-center">
              <div className="locale-section-title-circle absolute left-[-14px] top-[-19px] size-16 rounded-full border border-[#37B478]" />

              <div
                className={`relative z-10 font-['Gotham'] text-[clamp(2rem,6vw,2.25rem)] font-bold leading-none transition-colors duration-500 ease-in-out ${
                  isDarkMode ? "text-black" : "text-white"
                }`}
              >
                {latestNews.sectionTitle}
              </div>
            </div>

            <div className="h-8" />

            {isLoadingPost ? (
              <div className="flex max-w-[690px] flex-col gap-4">
                <SkeletonStatus label={t("loading")} />
                <ContentSkeleton className="h-8 w-11/12" isDarkMode={!isDarkMode} />
                <ContentSkeleton className="h-8 w-3/4" isDarkMode={!isDarkMode} />
                <div className="mt-4 flex items-center gap-8">
                  <ContentSkeleton className="h-4 w-28" isDarkMode={!isDarkMode} />
                  <ContentSkeleton className="h-4 w-20" isDarkMode={!isDarkMode} />
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <ContentSkeleton className="h-4 w-full" isDarkMode={!isDarkMode} />
                  <ContentSkeleton className="h-4 w-full" isDarkMode={!isDarkMode} />
                  <ContentSkeleton className="h-4 w-2/3" isDarkMode={!isDarkMode} />
                </div>
                <ContentSkeleton className="mt-8 h-4 w-32" isDarkMode={!isDarkMode} />
              </div>
            ) : (
              <>
                {/* Headline */}
                <div
                  className={`max-w-[690px] font-['Gotham'] text-[clamp(1.4rem,6vw,1.875rem)] font-medium leading-[1.28] transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-black" : "text-white"
                  }`}
                >
                  {latestNews.headline}
                </div>

                <div className="h-8" />

                {/* Date and read time */}
                <div className="flex items-center gap-8">
                  <div
                    className={`text-base font-light font-['Gotham'] transition-colors duration-500 ease-in-out ${
                      isDarkMode ? "text-black" : "text-white"
                    }`}
                  >
                    {latestNews.date}
                  </div>

                  <div className="text-[#37B478] text-base font-['Gotham']">
                    {latestNews.readTime}
                  </div>
                </div>

                {/* Summary */}
                <div
                  className={`article-card-summary mt-10 max-w-[690px] whitespace-pre-line text-base font-semilight font-['Gotham'] leading-[1.35] transition-colors duration-500 ease-in-out ${
                    isDarkMode ? "text-black" : "text-white"
                  }`}
                >
                  {latestNews.summary}
                </div>

                <div className="h-8" />

                {/* Read-more link */}
                <ReadMoreLink
                  to={getArticlePath(latestNews.slug)}
                  isDarkMode={!isDarkMode}
                  className="mt-8 cursor-pointer text-base font-['Gotham']"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestNewsSection;
