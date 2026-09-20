/* The row of category chips above the grid.

   They are buttons in a list, not links: they change what this page shows, they
   do not go anywhere. aria-pressed is what tells a screen reader which ones are
   on - colour alone says nothing to someone who cannot see it.

   Several can be on at once, and they read as "any of these": Engineering and
   Health together shows both, not the courses that are somehow in both.

   The chips wrap and centre, exactly as drawn, rather than scrolling sideways
   the way the archive page's filters do. A category that has scrolled out of
   sight is a category nobody clicks. */
function CourseTags({tags, allLabel, activeTags, onSelect}) {
  if (!tags?.length) return null;

  return (
    <ul className="inlearn-course-tags">
      <li>
        <button
          type="button"
          className={`inlearn-course-tag${activeTags.length ? "" : " is-on"}`}
          aria-pressed={activeTags.length === 0}
          onClick={() => onSelect(null)}
        >
          {allLabel}
        </button>
      </li>

      {tags.map((tag) => (
        <li key={tag.id}>
          <button
            type="button"
            className={`inlearn-course-tag${activeTags.includes(tag.id) ? " is-on" : ""}`}
            aria-pressed={activeTags.includes(tag.id)}
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
