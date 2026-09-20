import {arcSize} from "../../inlearn.config.js";
import useMediaQuery from "../../hooks/useMediaQuery.js";

/* Draws the arcs behind the first page from the numbers in inlearn.config.js.

   Every value there is turned into ordinary inline CSS here, so moving an arc
   never means reading this file: the whole vocabulary - top, left, right,
   width, rotate, flip, opacity - lives beside the numbers it describes.

   How big each arc is comes from arcSize, which has one number per arc per
   screen and nothing else in it - resizing an arc there cannot move it.

   Where each arc sits comes from the placement sets. The small-screen set only
   overrides the sideways offsets, and whatever it leaves out is inherited from
   the desktop one, so an arc keeps its height on the page across the boundary
   instead of jumping when the window crosses it.

   Both are chosen in JavaScript rather than by a media query, because these end
   up as inline styles and a media query cannot reach one. */

const SMALL_SCREEN = "(max-width: 1023px)";
const PHONE = "(max-width: 639px)";

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

function PageDecorations({decorations, smallScreenDecorations = {}}) {
  const isSmallScreen = useMediaQuery(SMALL_SCREEN);
  const isPhone = useMediaQuery(PHONE);
  const band = isPhone ? "phone" : isSmallScreen ? "tablet" : "desktop";

  return (
    <div className="inlearn-first-page-decor" aria-hidden="true">
      {Object.entries(decorations).map(([name, decoration]) => {
        const size = arcSize[name];
        const placement = {
          ...decoration,
          ...(isSmallScreen ? (smallScreenDecorations[name] ?? {}) : {}),
          ...(size ? {width: size[band], maxWidth: size.max} : {}),
        };

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
