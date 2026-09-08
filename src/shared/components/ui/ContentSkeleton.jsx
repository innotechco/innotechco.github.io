/**
 * Placeholder shown while WordPress content is still loading.
 *
 * Sections backed by the CMS render this instead of their bundled fallback
 * copy: showing the fallback first makes the page visibly swap content a moment
 * after it paints. The bundled copy is only for when WordPress actually fails.
 */
function ContentSkeleton({className = "", isDarkMode = true, rounded = "rounded-2xl"}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse ${rounded} ${
        isDarkMode ? "bg-white/10" : "bg-black/10"
      } ${className}`}
    />
  );
}

/** Screen-reader-only status so the wait is announced, not just drawn. */
export function SkeletonStatus({label}) {
  return (
    <span aria-live="polite" className="sr-only">
      {label}
    </span>
  );
}

export default ContentSkeleton;
