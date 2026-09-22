import {useEffect, useRef} from "react";

/* Pressing Purchase while signed out.
 *
 * The old behaviour sent the visitor to the first page with the sign-in panel
 * already open, which answered the question without ever asking it: the basket
 * vanished, and somebody who had just pressed a buy button found themselves on
 * a different page being asked for a password, with no sentence in between
 * saying why.
 *
 * So the reason is said first, here, and the panel opens only when they choose
 * it. Nothing is lost by cancelling - the basket is exactly where it was.
 *
 * It borrows the module's existing dialog shell rather than inventing a second
 * one, so this looks and behaves like the password dialog: same backdrop, same
 * rise, closed by the backdrop or by Escape.
 */
function SignInRequiredDialog({onClose, onSignIn, onRegister}) {
  const firstButtonRef = useRef(null);

  useEffect(() => {
    /* The focus goes to the way forward rather than to the dialog box, so
       Enter does the obvious thing for somebody on a keyboard. */
    const focusId = window.setTimeout(() => firstButtonRef.current?.focus(), 60);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusId);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="inlearn-dialog-layer">
      <button
        type="button"
        className="inlearn-dialog-backdrop"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="inlearn-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inlearn-signin-required-title"
      >
        <h3 id="inlearn-signin-required-title">Sign in to buy</h3>
        <p>
          An order has to belong to somebody, so we need you signed in before
          this one can be placed. Your basket is safe and nothing has been
          charged.
        </p>

        <div className="inlearn-dialog-actions">
          <button
            ref={firstButtonRef}
            type="button"
            className="inlearn-submit"
            onClick={onSignIn}
          >
            Sign in
          </button>
          {/* Somebody buying their first course usually has no account yet, so
              the other door is offered here rather than left to be found
              inside the panel. */}
          <button type="button" className="inlearn-dialog-secondary" onClick={onRegister}>
            Create an account
          </button>
        </div>

        <button type="button" className="inlearn-forgot" onClick={onClose}>
          Back to my basket
        </button>
      </div>
    </div>
  );
}

export default SignInRequiredDialog;
