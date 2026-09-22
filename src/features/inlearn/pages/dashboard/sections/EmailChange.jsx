import {useEffect, useRef, useState} from "react";

import {confirmEmailChange, requestEmailChange} from "../../../services/authService.js";
import {checkEmail, firstProblem} from "../../../services/formValidation.js";

/* Changing the address, in two steps.
 *
 * The code is sent to the NEW address, not the one on the account, and that is
 * the whole point: it proves the address exists and that whoever asked can
 * read it. Until the code is spent the account keeps the address it has, so a
 * typo costs nothing - which is why the field below is not simply editable.
 *
 * Three states rather than two, because the step somebody is on is not the
 * same question as whether the panel is open: closed, typing the address, and
 * typing the code.
 */
function EmailChange({email, pendingEmail, isBusy, onChanged, onToast}) {
  const [step, setStep] = useState("closed");
  const [draft, setDraft] = useState("");
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  /* How long the code that was just sent is good for, as the server reported
     it. Unknown when the step was resumed rather than started here - nothing
     told this browser when that code was issued - and a duration is only shown
     when it is actually known. */
  const [minutes, setMinutes] = useState(0);
  /* Set by Cancel, and only by Cancel. Without it, closing a step that the
     server still considers open would reopen the moment this rendered again -
     the visitor would be unable to put it down. */
  const wasDismissed = useRef(false);

  /* Picking up a change that was left half-finished.
   *
   * The server has been answering with the address waiting on a code since
   * this page was built, and nothing read it - so somebody who asked for a
   * code and went to fetch it came back to the old address and a Change
   * button, with a live code in their inbox and nowhere to type it.
   *
   * It runs on the address rather than on mount because the profile arrives
   * after the first render, so on mount there is nothing yet to resume. */
  useEffect(() => {
    if (!pendingEmail || wasDismissed.current || step !== "closed") return;
    setDraft(pendingEmail);
    setStep("code");
  }, [pendingEmail, step]);

  const close = () => {
    wasDismissed.current = true;
    setStep("closed");
    setDraft("");
    setCode("");
    setProblem("");
    setMinutes(0);
  };

  /* Asking for a code, and asking again for another one: the same request
     either way, and the server issues a fresh code and forgets the old one's
     failed attempts. Told apart only in what is said afterwards. */
  const send = async (address, isAgain) => {
    setIsWorking(true);
    setProblem("");

    try {
      const answer = await requestEmailChange(address);
      setCode("");
      setMinutes(answer?.ttlMinutes ?? 0);
      setStep("code");
      /* Said out loud as well as on the step, because the code is somewhere
         else - in an inbox - and the visitor is about to leave this tab. */
      onToast?.({
        message: isAgain ? `We sent a new code to ${address}.` : `We sent a code to ${address}.`,
      });
    } catch (error) {
      setProblem(error.message);
    } finally {
      setIsWorking(false);
    }
  };

  const ask = () => {
    const trouble = firstProblem([checkEmail(draft)]);
    if (trouble) {
      setProblem(trouble);
      return;
    }
    send(draft.trim(), false);
  };

  const confirm = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setProblem("Please enter the six digit code.");
      return;
    }

    setIsWorking(true);
    setProblem("");

    try {
      const profile = await confirmEmailChange(code.trim());
      close();
      onToast?.({message: "Your address is changed."});
      /* Handed up rather than kept here: the page above owns the profile, and
         the navbar is reading the same name and address. */
      onChanged?.(profile);
    } catch (error) {
      setProblem(error.message);
    } finally {
      setIsWorking(false);
    }
  };

  if (step === "closed") {
    return (
      <div className="inlearn-profile-email">
          {/* Read only. The address is how somebody gets back into the
              account, so moving it is a journey rather than a field. */}
        <input
          className="inlearn-profile-input"
          type="email"
          name="email"
          placeholder="Business Email"
          value={email}
          readOnly
        />
        <button
          type="button"
          className="inlearn-profile-email-change"
          disabled={isBusy}
          onClick={() => {
            wasDismissed.current = false;
            setStep("email");
          }}
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="inlearn-profile-step">
      {step === "email" ? (
        <>
          <p className="inlearn-profile-step-title">Change your address</p>
          <input
            className="inlearn-profile-input"
            type="email"
            placeholder="New email address"
            autoComplete="off"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setProblem("");
            }}
          />
        </>
      ) : (
        <>
          <p className="inlearn-profile-step-title">
            Enter the code we sent to <strong>{draft}</strong>
          </p>
          <input
            className="inlearn-profile-input inlearn-profile-code"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="······"
            value={code}
            onChange={(event) => {
              /* Digits only, as it is typed: a letter here is always a slip,
                 and catching it now beats a red line after pressing Confirm. */
              setCode(event.target.value.replace(/\D/g, ""));
              setProblem("");
            }}
          />

          {/* The way out of every dead end this step has.
           *
           * The server turns a code down for three reasons and two of them -
           * expired, too many attempts - end with "ask for a new one". There
           * was no way to ask: the only button that sent a code was on the
           * step before, and getting back to it meant cancelling. Somebody who
           * resumed a change from an earlier visit could not reach it at all.
           *
           * Beside the duration, because they answer each other: how long this
           * code lasts, and what to do when it has not. */}
          <p className="inlearn-profile-note">
            {minutes ? `The code is good for ${minutes} minutes. ` : ""}
            <button
              type="button"
              className="inlearn-profile-link"
              disabled={isWorking}
              onClick={() => send(draft, true)}
            >
              Send a new code
            </button>
          </p>
        </>
      )}

      {problem ? <p className="inlearn-profile-note is-problem">{problem}</p> : null}

      <div className="inlearn-profile-step-actions">
        <button type="button" className="inlearn-profile-ghost" onClick={close}>
          Cancel
        </button>
        <button
          type="button"
          className="inlearn-profile-go"
          onClick={step === "email" ? ask : confirm}
          disabled={isWorking}
        >
          {isWorking ? "Working…" : step === "email" ? "Send code" : "Confirm"}
        </button>
      </div>
    </div>
  );
}

export default EmailChange;
