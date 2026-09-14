import {useEffect, useRef, useState} from "react";

import {requestPasswordReset, resetPassword, verifyResetCode} from "../services/authService.js";
import {
  checkEmail,
  checkPassword,
  checkPasswordMatch,
  checkRequired,
  firstProblem,
} from "../services/formValidation.js";
import PasswordField from "./PasswordField.jsx";

/* Three steps, one question each: where to send the code, the code itself, then
   the new password.

   The code is checked on its own rather than alongside the password, so a wrong
   code is caught before anyone types a password twice - and the step that asks
   for a password only ever appears once the code is known to be good. */

const COPY = {
  email: {
    title: "Reset your password",
    action: "Send code",
  },
  code: {
    title: "Check your email",
    action: "Continue",
  },
  password: {
    title: "Choose a new password",
    body: "Almost done. Pick a password you have not used here before.",
    action: "Save and sign in",
  },
};

/* Mounted only while open, so each visit starts clean without an effect
   resetting six pieces of state on the way in. */
function ForgotPasswordDialog({initialEmail = "", onClose, onSignedIn}) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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

  /* Every step is the same shape: check what was typed, call one endpoint, move
     on or show why not. This keeps the three submit handlers from repeating it. */
  const runStep = (validate, act) => async (event) => {
    event.preventDefault();

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setIsBusy(true);
    try {
      await act();
    } catch (stepError) {
      setError(stepError.message);
    } finally {
      setIsBusy(false);
    }
  };

  const sendCode = runStep(
    () => checkEmail(email),
    async () => {
      const {expiresInMinutes: minutes} = await requestPasswordReset(email);
      setExpiresInMinutes(minutes);
      setStep("code");
    },
  );

  const confirmCode = runStep(
    () => checkRequired(code, "reset code"),
    async () => {
      await verifyResetCode({email, code: code.trim()});
      setStep("password");
    },
  );

  const savePassword = runStep(
    () =>
      firstProblem([
        checkPassword(password, {isNew: true}),
        checkPasswordMatch(password, passwordConfirmation),
      ]),
    async () => {
      const session = await resetPassword({email, code: code.trim(), password});
      onSignedIn(session);
    },
  );

  const submit = {email: sendCode, code: confirmCode, password: savePassword}[step];

  /* Left off entirely when the server did not say, rather than guessing a
     number that might not be the one it is enforcing. */
  const expiryNote = expiresInMinutes
    ? ` It expires in ${expiresInMinutes} minute${expiresInMinutes === 1 ? "" : "s"}.`
    : "";

  /* Back goes one step, not all the way out: a mistyped code should not cost
     the code itself. */
  const back = {
    email: {label: "Back to sign in", act: onClose},
    code: {label: "Use a different email", act: () => setStep("email")},
    password: {label: "Enter the code again", act: () => setStep("code")},
  }[step];

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
        <h3>{COPY[step].title}</h3>
        <p>
          {step === "email"
            ? "Enter your email and we will send you a reset code."
            : step === "code"
              ? `We sent a six-digit code to ${email}.${expiryNote}`
              : COPY.password.body}
        </p>

        {/* noValidate: our own message below, in the site's type rather than the
            browser's grey bubble */}
        <form noValidate onSubmit={submit}>
          {step === "email" ? (
            <input
              ref={firstFieldRef}
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : null}

          {step === "code" ? (
            <input
              ref={firstFieldRef}
              type="text"
              placeholder="Reset code"
              /* one-time-code lets a phone offer the digits straight from the
                 notification, and inputMode brings up the number pad. */
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
            />
          ) : null}

          {step === "password" ? (
            <>
              <PasswordField
                placeholder="New password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <PasswordField
                placeholder="Confirm new password"
                value={passwordConfirmation}
                onChange={(event) => setPasswordConfirmation(event.target.value)}
              />
            </>
          ) : null}

          {error ? (
            <p className="inlearn-dialog-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="inlearn-submit" disabled={isBusy}>
            {isBusy ? "Please wait…" : COPY[step].action}
          </button>
        </form>

        <button type="button" className="inlearn-forgot" onClick={back.act}>
          {back.label}
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordDialog;
