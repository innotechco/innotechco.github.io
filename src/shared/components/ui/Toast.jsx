import {useEffect, useState} from "react";
import {createPortal} from "react-dom";

import {useTheme} from "../../../app/providers/theme/useTheme.js";
import {t} from "../../i18n/ui.js";

const EXIT_DURATION_MS = 280;

function SuccessIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12.5L9.5 18L20 6.5" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
      <path d="M12 6.5V13.5" />
      <path d="M12 17.6V17.7" />
    </svg>
  );
}

/* Remount with a fresh `key` for each submission so the enter animation and the
   auto-dismiss timer restart instead of carrying over from the previous toast. */
function Toast({durationMs = 6000, message, onClose, status = "success", title}) {
  const {isDarkMode} = useTheme();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setIsLeaving(true), durationMs);
    return () => window.clearTimeout(hideTimer);
  }, [durationMs]);

  useEffect(() => {
    if (!isLeaving) return undefined;

    const removeTimer = window.setTimeout(() => onClose(), EXIT_DURATION_MS);
    return () => window.clearTimeout(removeTimer);
  }, [isLeaving, onClose]);

  const isError = status === "error";

  return createPortal(
    <div className="toast-viewport">
      <div
        role={isError ? "alert" : "status"}
        aria-live={isError ? "assertive" : "polite"}
        className={`toast ${isDarkMode ? "is-dark" : "is-light"} ${
          isError ? "is-error" : "is-success"
        } ${isLeaving ? "is-leaving" : ""}`}
      >
        <span className="toast-icon">
          {isError ? <ErrorIcon /> : <SuccessIcon />}
        </span>

        <div className="toast-body">
          {title ? <p className="toast-title">{title}</p> : null}
          {message ? <p className="toast-message">{message}</p> : null}
        </div>

        <button
          type="button"
          className="toast-close"
          aria-label={t("close")}
          onClick={() => setIsLeaving(true)}
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
            <path d="M6 6L18 18" />
            <path d="M18 6L6 18" />
          </svg>
        </button>

        <span
          className="toast-progress"
          style={{animationDuration: `${durationMs}ms`}}
          aria-hidden
        />
      </div>
    </div>,
    document.body,
  );
}

export default Toast;
