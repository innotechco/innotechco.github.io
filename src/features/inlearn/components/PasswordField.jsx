import {useState} from "react";

/* A masked field with a reveal button.
   Revealing hides itself again on the next keystroke, so a shoulder-surfer sees
   the password only while its owner is deliberately looking at it - and nobody
   walks away from a screen that is still showing it. */
function PasswordField({placeholder, value, autoComplete = "off", tabIndex, onChange, ...guard}) {
  const [isVisible, setIsVisible] = useState(false);

  const handleChange = (event) => {
    if (isVisible) setIsVisible(false);
    onChange(event);
  };

  return (
    <div className="inlearn-password-field">
      <input
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        tabIndex={tabIndex}
        onChange={handleChange}
        {...guard}
      />
      <button
        type="button"
        className="inlearn-password-reveal"
        /* The label says what the click does, not what the icon looks like. */
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        tabIndex={tabIndex}
        onClick={() => setIsVisible((current) => !current)}
      >
        <EyeIcon isOpen={isVisible} />
      </button>
    </div>
  );
}

/* Inline rather than an asset: the two states share every path but one, and a
   second file would have to be kept in step with this one by hand. */
function EyeIcon({isOpen}) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {isOpen ? null : (
        <path d="M4 20 20 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

export default PasswordField;
