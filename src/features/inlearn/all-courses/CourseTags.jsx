/* The row of category chips above the grid.

   They are buttons in a list, not links: they change what this page shows, they
   do not go anywhere. aria-pressed is what tells a screen reader which one is
   on - colour alone says nothing to someone who cannot see it.

   The chips wrap and centre, exactly as drawn, rather than scrolling sideways
   the way the archive page's filters do. A category that has scrolled out of
   sight is a category nobody clicks. */
function CourseTags({tags, allLabel, activeTag, onSelect}) {
  if (!tags?.length) return null;

  return (
    <ul className="inlearn-course-tags">
      <li>
        <button
          type="button"
          className={`inlearn-course-tag${activeTag === null ? " is-on" : ""}`}
          aria-pressed={activeTag === null}
          onClick={() => onSelect(null)}
        >
          {allLabel}
        </button>
      </li>

      {tags.map((tag) => (
        <li key={tag.id}>
          <button
            type="button"
            className={`inlearn-course-tag${activeTag === tag.id ? " is-on" : ""}`}
            aria-pressed={activeTag === tag.id}
            onClick={() => onSelect(tag.id)}
          >
            {tag.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default CourseTags;
