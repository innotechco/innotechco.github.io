import useMediaQuery from "../hooks/useMediaQuery.js";

/* Draws the arcs behind the first page from the numbers in inlearn.config.js.

   Every value there is turned into ordinary inline CSS here, so moving an arc
   never means reading this file: the whole vocabulary - top, left, right,
   width, rotate, flip, opacity - lives beside the numbers it describes.

   The phone set is chosen in JavaScript rather than by a media query, because
   an inline style is one value and a media query cannot reach it. Whatever the
   phone set leaves out is inherited from the desktop one. */

const PHONE = "(max-width: 860px)";

function toStyle({top, left, right, width, maxWidth, rotate, flipX, flipY, opacity}) {
  /* One transform, not two: a second transform property on the same element
     does not add to the first, it replaces it. */
  const transform = [
    rotate && rotate !== "0deg" ? `rotate(${rotate})` : "",
    flipX || flipY ? `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    top,
    left,
    right,
    width,
    maxWidth,
    opacity,
    ...(transform ? {transform} : {}),
  };
}

function PageDecorations({decorations, phoneDecorations = {}}) {
  const isPhone = useMediaQuery(PHONE);

  return (
    <div className="inlearn-first-page-decor" aria-hidden="true">
      {Object.entries(decorations).map(([name, decoration]) => {
        const placement = isPhone ? {...decoration, ...(phoneDecorations[name] ?? {})} : decoration;

        return (
          <img
            key={name}
            className={`inlearn-decor inlearn-decor-${name}`}
            src={decoration.src}
            alt=""
            /* Only the second arc starts below the fold; the first is painted
               before anything is scrolled. */
            {...(name === "topLeft" ? {} : {loading: "lazy"})}
            style={toStyle(placement)}
          />
        );
      })}
    </div>
  );
}

export default PageDecorations;
