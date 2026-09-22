import {useState} from "react";

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
function EmailChange({email, onChanged, onToast}) {
  const [step, setStep] = useState("closed");
  const [draft, setDraft] = useState("");
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const close = () => {
    setStep("closed");
    setDraft("");
    setCode("");
    setProblem("");
  };

  const ask = async () => {
    const trouble = firstProblem([checkEmail(draft)]);
    if (trouble) {
      setProblem(trouble);
      return;
    }

    setIsBusy(true);
    setProblem("");

    try {
      await requestEmailChange(draft.trim());
      setStep("code");
      /* Said out loud as well as on the step, because the code is somewhere
         else - in an inbox - and the visitor is about to leave this tab. */
      onToast?.({message: `We sent a code to ${draft.trim()}.`});
    } catch (error) {
      setProblem(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  const confirm = async () => {
    if (!/^\d{6}$/.test(code.trim())) {
      setProblem("Please enter the six digit code.");
      return;
    }

    setIsBusy(true);
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
      setIsBusy(false);
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
          onClick={() => setStep("email")}
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
          disabled={isBusy}
        >
          {isBusy ? "Working…" : step === "email" ? "Send code" : "Confirm"}
        </button>
      </div>
    </div>
  );
}

export default EmailChange;
