import {useEffect, useRef, useState} from "react";

import {requestPasswordReset, resetPassword} from "../services/authService.js";
import {checkEmail, checkPassword, checkRequired, firstProblem} from "../services/formValidation.js";

/* Two steps: ask where to send the code, then take the code back.
   Strapi's reset endpoint wants a new password alongside the code, so step two
   collects one - a code on its own cannot sign anyone in without leaving the
   old password still valid in the visitor's mailbox. A successful reset returns
   a session, so finishing here signs them in. */
/* Mounted only while open, so each visit starts clean without an effect
   resetting five pieces of state on the way in. */
function ForgotPasswordDialog({initialEmail = "", onClose, onSignedIn}) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    const focusId = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusId);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const sendCode = async (event) => {
    event.preventDefault();
    const problem = checkEmail(email);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setIsBusy(true);
    try {
      await requestPasswordReset(email);
      setStep("code");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const confirmCode = async (event) => {
    event.preventDefault();
    const problem = firstProblem([
      checkRequired(code, "reset code"),
      checkPassword(password, {isNew: true}),
    ]);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setIsBusy(true);
    try {
      const session = await resetPassword({code, password});
      onSignedIn(session);
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const isEmailStep = step === "email";

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
        aria-label="Reset your password"
      >
        <h3>{isEmailStep ? "Reset your password" : "Check your email"}</h3>
        <p>
          {isEmailStep
            ? "Enter your email and we will send you a reset code."
            : `We sent a code to ${email}. Enter it below with a new password.`}
        </p>

        {/* noValidate: our own message below, in the site's type rather than the
            browser's grey bubble */}
        <form noValidate onSubmit={isEmailStep ? sendCode : confirmCode}>
          {isEmailStep ? (
            <input
              ref={firstFieldRef}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : (
            <>
              <input
                ref={firstFieldRef}
                type="text"
                placeholder="Reset code"
                value={code}
                autoComplete="one-time-code"
                  onChange={(event) => setCode(event.target.value)}
              />
              <input
                type="password"
                placeholder="New password"
                value={password}
                autoComplete="new-password"
                  onChange={(event) => setPassword(event.target.value)}
              />
            </>
          )}

          {error ? (
            <p className="inlearn-dialog-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="inlearn-submit" disabled={isBusy}>
            {isBusy ? "Please wait…" : isEmailStep ? "Send code" : "Reset and sign in"}
          </button>
        </form>

        <button
          type="button"
          className="inlearn-forgot"
          onClick={isEmailStep ? onClose : () => setStep("email")}
        >
          {isEmailStep ? "Back to sign in" : "Use a different email"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordDialog;
