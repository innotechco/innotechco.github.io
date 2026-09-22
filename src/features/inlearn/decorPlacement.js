/* Turns a placement written in inlearn.config.js into inline CSS.
 *
 * One vocabulary for every decorative shape in the module - the arcs behind
 * the first page and the curve behind the dashboard - so moving any of them
 * means reading the numbers beside them and never a component.
 *
 *   top / left / right   where it sits. Plain CSS, so "-20vw", "120px", "8%"
 *                        all work. Set left OR right, not both.
 *   width / maxWidth     how big it is.
 *   at                   OPTIONAL. A page width, in pixels. When it is set,
 *                        every vw above is worked out against THAT width once
 *                        and handed over as pixels - so the shape is the same
 *                        size in the same place on a phone as on a monitor,
 *                        and a tablet cannot move it. Leave it out and vw
 *                        means what it always means: a share of whatever
 *                        window the page happens to be in, so the shape
 *                        shrinks with the screen.
 *   rotate               "0deg", "45deg", "-90deg"
 *   flipX / flipY        mirror it, true or false
 *   opacity              1 is solid, 0.5 is half
 *
 * It lives here rather than in either of the two components that need it: the
 * first page had it first, the dashboard would otherwise have grown a second
 * copy, and two copies of a transform rule is one of them being corrected and
 * the other quietly disagreeing.
 */
export function toDecorStyle({
  top,
  bottom,
  left,
  right,
  width,
  maxWidth,
  rotate,
  flipX,
  flipY,
  opacity,
  at,
} = {}) {
  /* With `at` set, a vw is measured against that page width rather than this
     one. Written this way round on purpose: the numbers in the config stay the
     ones somebody tuned by eye, and what changes is only what they are a
     percentage OF. Anything that is not a vw - a px, a percentage, a keyword -
     is passed through untouched. */
  const fixed = (value) => {
    if (!at || typeof value !== "string" || !value.trim().endsWith("vw")) {
      return value;
    }

    const share = Number.parseFloat(value);
    return Number.isFinite(share) ? `${(share / 100) * at}px` : value;
  };
  /* One transform, not two: a second transform property on the same element
     does not add to the first, it replaces it. */
  const transform = [
    rotate && rotate !== "0deg" ? `rotate(${rotate})` : "",
    flipX || flipY ? `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    top: fixed(top),
    bottom: fixed(bottom),
    left: fixed(left),
    right: fixed(right),
    width: fixed(width),
    maxWidth: fixed(maxWidth),
    opacity,
    ...(transform ? {transform} : {}),
  };
}
