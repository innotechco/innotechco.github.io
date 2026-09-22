import {useCallback, useState} from "react";
import {Outlet} from "react-router-dom";

import DashboardSidebar from "./DashboardSidebar.jsx";
import {readRailCollapsed, saveRailCollapsed} from "./railState.js";
import {dashboardCurve} from "../../inlearn.assets.js";
import {dashboardDecor} from "../../inlearn.config.js";

/* The arc's numbers turned into CSS, and the whole of its responsive
   behaviour.
 *
 * It is worked out here rather than by the shared decorPlacement helper
 * because this shape answers a question the first page's arcs do not: it has
 * to scale with the window while keeping its composition EXACTLY - the same
 * part of the circle, in the same place, only smaller.
 *
 * Two things make that true, and both are ordinary CSS rather than a media
 * query, so the change is continuous instead of snapping at a boundary:
 *
 *   the size    min() against maxWidth, so it grows with the window up to a
 *               ceiling and then stops. No floor: a floor is what made it
 *               swell to three quarters of a phone screen and wrap round the
 *               panel.
 *
 *   the offsets written as a percentage, they mean a share of the ARC'S OWN
 *               width, worked out with calc against that same size. That is
 *               the whole trick: offsets tied to the arc scale with it, so
 *               the picture cannot change shape as the window narrows. A
 *               percentage handed straight to CSS would have meant a share of
 *               the page instead - which is what it did mean until now, and
 *               why the shape drifted about.
 *
 * Anything not written as a percentage - a px, a vw - is passed through and
 * means what it always means.
 */
function curveStyle({
  width,
  minWidth,
  maxWidth,
  top,
  bottom,
  left,
  right,
  rotate,
  flipX,
  flipY,
  opacity,
}) {
  /* clamp is the whole responsive behaviour in one line: the middle term grows
     with the window, and the two ends stop it going anywhere silly. */
  const size =
    minWidth && maxWidth
      ? `clamp(${minWidth}, ${width}, ${maxWidth})`
      : maxWidth
        ? `min(${width}, ${maxWidth})`
        : width;

  const share = (value) => {
    if (typeof value !== "string" || !value.trim().endsWith("%")) return value;
    const fraction = Number.parseFloat(value) / 100;
    return Number.isFinite(fraction) ? `calc(${size} * ${fraction})` : value;
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
    width: size,
    top: share(top),
    bottom: share(bottom),
    left: share(left),
    right: share(right),
    opacity,
    ...(transform ? {transform} : {}),
  };
}

/* The shell every signed-in section is drawn inside: the rail on the left, the
   section on the right, and the arc behind both.
 *
 * The sections themselves are empty for now. This is deliberate - the frame,
 * the rail and the way a row lights up are what the whole dashboard is judged
 * on, and they are worth getting right before any one section's content exists
 * to argue about.
 */
function DashboardPage({session, onExit}) {
  const curve = curveStyle(dashboardDecor);

  /* Read once, on mount, rather than on every render: it touches storage and
     the window, and after that the answer is this component's to hold. */
  const [isCollapsed, setIsCollapsed] = useState(readRailCollapsed);

  const toggleRail = useCallback(() => {
    setIsCollapsed((current) => {
      const next = !current;
      saveRailCollapsed(next);
      return next;
    });
  }, []);

  return (
    /* The state is an attribute rather than a class because it is a state, not
       a kind - and because the stylesheet then reads the way it behaves:
       [data-rail="collapsed"] in front of a rule says when that rule applies. */
    <div className="inlearn-dash" data-rail={isCollapsed ? "collapsed" : "open"}>
      {/* Behind everything and reachable by nothing: it is a shape, not a
          picture of anything, so it carries no alt text and no tab stop. Lazy
          because it is decoration - the rail beside it is what the visitor
          came for and should not queue behind this. */}
      <img
        className="inlearn-dash-curve"
        src={dashboardCurve}
        style={curve}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <div className="inlearn-dash-layout">
        <DashboardSidebar
          session={session}
          onExit={onExit}
          isCollapsed={isCollapsed}
          onToggle={toggleRail}
        />

        <section className="inlearn-dash-panel">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default DashboardPage;
