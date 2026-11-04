import {useEffect, useLayoutEffect, useRef} from "react";

/* Signing in closes the panel, and a panel that simply disappears is a weak
   answer to "did that work?". This says so, from the top of the page, and takes
   itself away.

   role="status" rather than "alert": a screen reader announces it when it
   finishes what it is saying, instead of interrupting. Nothing here is urgent. */
const MAX_LINES = 2;
const FONT_MAX_PX = 13;
const FONT_MIN_PX = 10;

function InlearnToast({message, action, onDismiss, duration = 4000}) {
  const textRef = useRef(null);

  /* The message is never cut short - a notification that ends in an ellipsis
     asks the reader to go and find the rest, and the toast is the only place
     it was. But it cannot run down the page either, so it is given two lines
     and the type shrinks, a half point at a time, until the words fit in them.
     Measured rather than guessed, because the same sentence is a different
     width in every language the site is in.

     useLayoutEffect, so the resize happens in the same frame as the paint and
     nobody sees the first size. */
  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node || !message) return undefined;

    const fit = () => {
      let size = FONT_MAX_PX;
      node.style.fontSize = `${size}px`;
      const overflows = () => {
        const lineHeight = parseFloat(window.getComputedStyle(node).lineHeight) || size * 1.35;
        return node.scrollHeight > lineHeight * MAX_LINES + 1;
      };
      while (size > FONT_MIN_PX && overflows()) {
        size -= 0.5;
        node.style.fontSize = `${size}px`;
      }
    };

    fit();
    /* Gotham arrives after the first paint; the text is a different width in
       it than in the fallback, so the fit is taken again once it is there. */
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });
    window.addEventListener("resize", fit);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", fit);
    };
  }, [message]);

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
    /* message in the deps so a second toast restarts the clock rather than
       inheriting what was left of the first one's. */
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className="inlearn-toast" role="status" aria-live="polite">
      <span className="inlearn-toast-mark" aria-hidden="true">
        <svg viewBox="0 0 14 11" fill="none">
          <path
            d="M1 5.5L5 9.5L13 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <p ref={textRef}>{message}</p>

      {/* One action, and only when there is one to offer. It runs and then
          takes the toast away, because the thing it was offering to undo has
          just been undone. */}
      {action ? (
        <button
          type="button"
          className={`inlearn-toast-action${action.tone ? ` is-${action.tone}` : ""}`}
          onClick={() => {
            action.run();
            onDismiss();
          }}
        >
          {action.label}
        </button>
      ) : null}

      <button type="button" onClick={onDismiss} aria-label="Dismiss">
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M1 1L11 11M11 1L1 11"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

export default InlearnToast;
