import {useEffect} from "react";

/* Signing in closes the panel, and a panel that simply disappears is a weak
   answer to "did that work?". This says so, from the top of the page, and takes
   itself away.

   role="status" rather than "alert": a screen reader announces it when it
   finishes what it is saying, instead of interrupting. Nothing here is urgent. */
function InlearnToast({message, action, onDismiss, duration = 4000}) {
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
      <p>{message}</p>

      {/* One action, and only when there is one to offer. It runs and then
          takes the toast away, because the thing it was offering to undo has
          just been undone. */}
      {action ? (
        <button
          type="button"
          className="inlearn-toast-action"
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
