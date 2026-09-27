import {useCallback, useEffect, useRef, useState} from "react";

import {requestPasswordReset, resetPassword, verifyResetCode} from "../services/authService.js";
import {
  checkEmail,
  checkPassword,
  checkPasswordMatch,
  checkRequired,
  firstProblem,
} from "../services/formValidation.js";
import {useNoAutofill} from "./useNoAutofill.js";
import AutofillDecoys from "./AutofillDecoys.jsx";
import PasswordField from "./PasswordField.jsx";

/* Three steps, one question each: where to send the code, the code itself, then
   the new password.

   The code is checked on its own rather than alongside the password, so a wrong
   code is caught before anyone types a password twice - and the step that asks
   for a password only ever appears once the code is known to be good. */

/* The same number as the exit animation in 05-auth.css. */
const CLOSING_MS = 200;

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
/* `lockedEmail` is for the one caller that already knows the address: the
   Profile page, opened by somebody who is signed in. Asking them to type the
   address they are signed in as is asking a question we know the answer to,
   so the address is taken as given, the code goes out on its own, and the
   dialog opens on the step that actually needs them. */
function ForgotPasswordDialog({initialEmail = "", lockedEmail = "", onClose, onSignedIn}) {
  const isLocked = Boolean(lockedEmail);
  const [step, setStep] = useState(isLocked ? "code" : "email");
  const [email, setEmail] = useState(lockedEmail || initialEmail);
  const [code, setCode] = useState("");
  const [expiresInMinutes, setExpiresInMinutes] = useState(null);
  /* Seconds until another code is worth asking for, which is the same moment
     the current one dies. Counted down here so the button can say it. */
  const [retryIn, setRetryIn] = useState(0);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(isLocked);
  /* Sent once. Without this a remount - which a hot reload is - asks for a
     second code and quietly invalidates the one already in somebody's inbox. */
  const hasAskedRef = useRef(false);
  const {formRef, isGuarding} = useNoAutofill();
  const firstFieldRef = useRef(null);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  /* Leaving takes as long as the animation does.
   *
   * The parent owns whether this is on screen at all, so calling onClose is
   * what removes it - and a removed element cannot animate. So the dialog
   * marks itself as leaving, lets the stylesheet play it out, and only then
   * tells the parent to let go. Both places that open this one keep their
   * plain onClose and get the exit for free.
   *
   * CLOSING_MS is the CSS duration. Two numbers that have to agree, which is
   * the cost of not waiting on animationend - and animationend does not
   * arrive at all if the animation was never allowed to run, which is
   * exactly what reduced motion asks for.
   *
   * Guarded, because Escape held down, or a second click on the backdrop,
   * would otherwise start the exit again from the top. */
  const requestClose = useCallback(() => {
    setIsClosing((already) => {
      if (already) return already;
      closeTimer.current = window.setTimeout(() => onCloseRef.current(), CLOSING_MS);
      return true;
    });
  }, []);

  useEffect(() => {
    const focusId = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusId);
      window.clearTimeout(closeTimer.current);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [requestClose]);

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
      const {expiresInMinutes: minutes, retryInSeconds} = await requestPasswordReset(email);
      setExpiresInMinutes(minutes);
      setRetryIn(retryInSeconds ?? 0);
      setStep("code");
    },
  );

  /* One interval for the whole dialog, started when there is something to
     count and stopped the moment there is not. */
  useEffect(() => {
    if (retryIn <= 0) return undefined;
    const id = window.setInterval(() => setRetryIn((left) => (left <= 1 ? 0 : left - 1)), 1000);
    return () => window.clearInterval(id);
  }, [retryIn > 0]); // eslint-disable-line react-hooks/exhaustive-deps

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

  /* The first code, asked for without being asked for. Only where the address
     was handed in, so there is no step where somebody could still change it. */
  useEffect(() => {
    if (!isLocked || hasAskedRef.current) return;
    hasAskedRef.current = true;

    let cancelled = false;
    (async () => {
      try {
        const {expiresInMinutes: minutes, retryInSeconds} = await requestPasswordReset(lockedEmail);
        if (!cancelled) {
          setExpiresInMinutes(minutes);
          setRetryIn(retryInSeconds ?? 0);
        }
      } catch (sendError) {
        if (!cancelled) setError(sendError.message);
      } finally {
        if (!cancelled) setIsBusy(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLocked, lockedEmail]);

  /* Asking again, for a code that never arrived. Refused while the last one
     is still alive - the server would answer with the countdown rather than
     send anything, and offering a button that does nothing is worse than a
     button that says when it will work. */
  const resend = async () => {
    if (retryIn > 0) return;
    setError("");
    setIsBusy(true);
    try {
      const {expiresInMinutes: minutes, retryInSeconds} = await requestPasswordReset(email);
      setExpiresInMinutes(minutes);
      setRetryIn(retryInSeconds ?? 0);
      setCode("");
    } catch (sendError) {
      setError(sendError.message);
    } finally {
      setIsBusy(false);
    }
  };

  /* 1:40 rather than 100 seconds: a countdown is read as a clock. */
  const clock = `${Math.floor(retryIn / 60)}:${String(retryIn % 60).padStart(2, "0")}`;

  /* Left off entirely when the server did not say, rather than guessing a
     number that might not be the one it is enforcing. */
  const expiryNote = expiresInMinutes
    ? ` It expires in ${expiresInMinutes} minute${expiresInMinutes === 1 ? "" : "s"}.`
    : "";

  /* Back goes one step, not all the way out: a mistyped code should not cost
     the code itself. */
  /* With the address fixed there is nowhere back to: the step that asked for
     it never happened. The way out is out, and the useful offer is another
     code rather than another address. */
  const back = isLocked
    ? {
        code: {
          label: retryIn > 0 ? `Send a new code in ${clock}` : "Send a new code",
          act: resend,
          disabled: retryIn > 0,
        },
        password: {label: "Enter the code again", act: () => setStep("code")},
      }[step]
    : {
        email: {label: "Back to sign in", act: requestClose},
        code: {label: "Use a different email", act: () => setStep("email")},
        password: {label: "Enter the code again", act: () => setStep("code")},
      }[step];

  return (
    <div className={`inlearn-dialog-layer${isClosing ? " is-closing" : ""}`}>
      <button
        type="button"
        className="inlearn-dialog-backdrop"
        aria-label="Close"
        onClick={requestClose}
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
        <form ref={formRef} noValidate autoComplete="off" onSubmit={submit}>
          {isGuarding ? <AutofillDecoys /> : null}
          {step === "email" ? (
            <input
              ref={firstFieldRef}
              type="email"
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          ) : null}

          {step === "code" ? (
            /* The clock sits inside the field rather than under it, where the
               code is being typed and where the question "have I still got
               time?" is actually being asked. */
            <div className="inlearn-dialog-code">
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
              {/* Gone once it reaches zero rather than sitting at 0:00: by
                  then the code is dead and the thing to look at is the button
                  below offering another one. */}
              {retryIn > 0 ? (
                <span
                  className={`inlearn-dialog-clock${retryIn <= 60 ? " is-low" : ""}`}
                  aria-hidden="true"
                >
                  {clock}
                </span>
              ) : null}
            </div>
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

        <button
          type="button"
          className="inlearn-forgot"
          onClick={back.act}
          disabled={Boolean(back.disabled)}
        >
          {back.label}
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordDialog;
