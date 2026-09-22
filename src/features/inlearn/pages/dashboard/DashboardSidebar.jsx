import {useState} from "react";
import {NavLink} from "react-router-dom";

import {avatarLetter, dashboardExit, dashboardSections} from "./dashboard.config.js";
import {MenuIcon, RailChevron} from "./icons.jsx";

/* The panel down the left: who is signed in, and where they can go.
 *
 * It is on the left at every width, folded or open. The sections it opens are
 * the page - courses, orders, saved things - and they are read beside it, not
 * underneath it, so the rail never becomes a banner across the top.
 *
 * NavLink rather than Link so that which row is green is decided by the
 * address, not by state this component keeps. State would be a second copy of
 * something the router already knows, and the two go out of step the first
 * time somebody arrives by typing the address or pressing back.
 */
function DashboardSidebar({session, onExit, isCollapsed, onToggle}) {
  const {Icon: ExitMark} = dashboardExit;

  /* A pressed button keeps :hover until the pointer moves again, so folding the
     panel left the grey circle sitting under a cursor that had finished with
     it - it read as the button being stuck on. This turns the hover off for
     that button until the pointer actually leaves and comes back, which is the
     only thing "hovering" was ever meant to mean. */
  const [isHoverMuted, setIsHoverMuted] = useState(false);

  return (
    <aside className="inlearn-dash-rail">
      <header className="inlearn-dash-identity">
        {/* A letter, not a photograph: there is nowhere to upload one yet, and
            a grey silhouette for every account reads as something missing
            rather than something not yet offered. */}
        <span className="inlearn-dash-avatar" aria-hidden="true">
          {avatarLetter(session)}
        </span>

        {/* Hidden from the reader AND from a screen reader when folded, rather
            than merely shrunk: a name read out by a rail that is showing only
            icons is a name nobody asked for. */}
        <div className="inlearn-dash-who" aria-hidden={isCollapsed}>
          <p className="inlearn-dash-name">{session?.displayName}</p>
          {/* title as well as text: an address long enough to be cut here is
              exactly the one somebody needs to read in full. */}
          <p className="inlearn-dash-email" title={session?.user?.email}>
            {session?.user?.email}
          </p>
        </div>
      </header>

      <nav className="inlearn-dash-nav" aria-label="Dashboard">
        {/* Above the sections rather than up in the black block: it is a
            control for this list, it belongs at the head of it, and it keeps
            the same place folded or open so the thing that brings the panel
            back is where the thing that sent it away was.

            It is NOT a row and does not borrow their class. A row is a place to
            go, is as wide as the panel, and turns green when the visitor is
            there; this goes nowhere and can never be current, so it is its own
            small circle and it stays grey whatever happens to it. Its mark is
            lined up with theirs so the icons still read as one column. */}
        <button
          type="button"
          className={`inlearn-dash-fold ${isHoverMuted ? "is-hover-muted" : ""}`}
          onClick={() => {
            setIsHoverMuted(true);
            onToggle();
          }}
          onMouseLeave={() => setIsHoverMuted(false)}
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Open the menu" : "Fold the menu away"}
          title={isCollapsed ? "Open the menu" : "Fold the menu away"}
        >
          <MenuIcon />
        </button>

        {dashboardSections.map(({id, label, to, Icon, end}) => (
          <NavLink
            key={id}
            to={to}
            end={end}
            /* The label is the only thing naming this row, and folded it is not
               drawn - so the title carries it, and the row keeps its name for
               a pointer resting on it. */
            title={isCollapsed ? label : undefined}
            className={({isActive}) =>
              `inlearn-dash-link ${isActive ? "is-current" : ""}`
            }
          >
            <span className="inlearn-dash-link-mark">
              <Icon />
            </span>
            <span className="inlearn-dash-link-label">{label}</span>
            {/* Only the open row carries it, and it is decorative - the row is
                already announced as current by NavLink's aria-current. */}
            <span className="inlearn-dash-link-chevron" aria-hidden="true">
              <RailChevron />
            </span>
          </NavLink>
        ))}

        <button
          type="button"
          className="inlearn-dash-link inlearn-dash-exit"
          onClick={onExit}
          title={isCollapsed ? dashboardExit.label : undefined}
        >
          <span className="inlearn-dash-link-mark">
            <ExitMark />
          </span>
          <span className="inlearn-dash-link-label">{dashboardExit.label}</span>
        </button>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
