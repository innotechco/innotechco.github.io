import {useState} from "react";

import PhoneField from "../../../auth/PhoneField.jsx";
import {confirmPhoneChange, requestPhoneChange} from "../../../services/authService.js";

function PhoneChange({dialCode, phone, isBusy, onChanged, onToast}) {
  const [step, setStep] = useState("closed");
  const [draft, setDraft] = useState("");
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");
  const [working, setWorking] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const displayedPhone = dialCode && String(phone).startsWith(dialCode)
    ? String(phone).slice(dialCode.length)
    : phone;

  const close = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setStep("closed");
      setDraft("");
      setCode("");
      setProblem("");
      setIsClosing(false);
    }, 640);
  };

  const send = async () => {
    const number = `${dialCode}${draft}`.replace(/\s/g, "");
    if (!/^\+\d{7,15}$/.test(number)) {
      setProblem("Please enter a valid phone number with its country code.");
      return;
    }
    setWorking(true);
    setProblem("");
    try {
      await requestPhoneChange(number);
      setStep("code");
      setCode("");
      onToast?.({message: `We sent a code to ${number}.`});
    } catch (error) {
      setProblem(error.message);
    } finally {
      setWorking(false);
    }
  };

  const confirm = async () => {
    if (!/^\d{6}$/.test(code)) {
      setProblem("Please enter the six digit code.");
      return;
    }
    setWorking(true);
    setProblem("");
    try {
      const profile = await confirmPhoneChange(code);
      close();
      onChanged?.(profile);
      onToast?.({message: "Your phone number is changed."});
    } catch (error) {
      setProblem(error.message);
    } finally {
      setWorking(false);
    }
  };

  if (step === "closed") {
    return (
      <div className="inlearn-profile-phone-change-row">
        <PhoneField dialCode={dialCode} value={displayedPhone} readOnly />
        <button type="button" className="inlearn-profile-phone-change" disabled={isBusy} onClick={() => setStep("phone")}>
          Change number
        </button>
      </div>
    );
  }

  return (
    <div className={`inlearn-profile-step-reveal${isClosing ? " is-closing" : ""}`}>
      <div className="inlearn-profile-step">
      <p className="inlearn-profile-step-title">
        {step === "phone" ? "Change your phone number" : "Enter the SMS verification code"}
      </p>
      {step === "phone" ? (
        <PhoneField dialCode={dialCode} value={draft} onChange={setDraft} />
      ) : (
        <input className="inlearn-profile-input inlearn-profile-code" inputMode="numeric" maxLength={6} autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="······" />
      )}
      {problem ? <p className="inlearn-profile-note is-problem">{problem}</p> : null}
      <div className="inlearn-profile-step-actions">
        <button type="button" className="inlearn-profile-ghost" onClick={close}>Cancel</button>
        <button type="button" className="inlearn-profile-go" disabled={working} onClick={step === "phone" ? send : confirm}>
          {working ? "Working…" : step === "phone" ? "Send code" : "Confirm"}
        </button>
      </div>
      </div>
    </div>
  );
}

export default PhoneChange;
