import {useState} from "react";
import {createPortal} from "react-dom";

import ForgotPasswordDialog from "../../../auth/ForgotPasswordDialog.jsx";
import PasswordField from "../../../auth/PasswordField.jsx";
import {changePassword} from "../../../services/authService.js";
import {
  checkPassword,
  checkPasswordMatch,
  firstProblem,
} from "../../../services/formValidation.js";

/* Changing the password, opened from the row on the Profile page.
 *
 * Closed it is one row: dots, and a button. Open it is the three fields any
 * password change needs - the current one to prove it is them, the new one,
 * and the new one again because it is typed blind.
 *
 * Unless there is no password to change. An account made with the Google
 * button arrives without one, and asking such a person for their CURRENT
 * password asks for something that does not exist - no answer they can give
 * is right, and they only find that out after filling in three fields. That
 * account is offered a first password instead, set the one way it can be
 * proved: a code to the address on the account.
 *
 * The rules are the ones the sign-up panel uses, from formValidation, rather
 * than a second copy written here. The server applies them too; only the
 * server's copy is a guarantee, and this one is what makes the answer
 * immediate.
 */

const EMPTY = {currentPassword: "", newPassword: "", confirmation: ""};

function PasswordChange({
  email,
  hasPassword = true,
  provider,
  isBusy,
  onPasswordSet,
  onSessionChange,
  onToast,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [problem, setProblem] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const change = (field) => (event) => {
    setForm((current) => ({...current, [field]: event.target.value}));
    setProblem("");
  };

  const close = () => {
    setIsClosing(true);
    window.setTimeout(() => {
      setIsOpen(false);
      setForm(EMPTY);
      setProblem("");
      setIsClosing(false);
    }, 640);
  };

  const submit = async () => {
    const trouble = firstProblem([
      form.currentPassword ? "" : "Please enter your current password.",
      checkPassword(form.newPassword, {isNew: true}),
      checkPasswordMatch(form.newPassword, form.confirmation),
    ]);

    if (trouble) {
      setProblem(trouble);
      return;
    }

    setIsSaving(true);
    setProblem("");

    try {
      const result = await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm(EMPTY);
      setIsOpen(false);
      /* The other devices being signed out is said plainly, because it is the
         part nobody expects and the part they would otherwise discover on
         their phone tomorrow. */
      onToast?.({
        message: result.signedOutElsewhere
          ? `Your password is changed. You were signed out on ${result.signedOutElsewhere} other ${
              result.signedOutElsewhere === 1 ? "session" : "sessions"
            }.`
          : "Your password is changed.",
      });
    } catch (error) {
      setProblem(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  /* --------------------------------------- no password on the account yet */

  if (!hasPassword) {
    const madeWith = {google: "Google", linkedin: "LinkedIn"}[provider] ?? "a connected account";

    return (
      <>
        <div className="inlearn-profile-password">
          {/* The same capsule the dots sit in, so this row lines up with the
              ones above it instead of reading as a stray sentence. The whole
              sentence is on the title, because the capsule is one line wide
              and the end of it is the part that gets cut. */}
          <span
            className="inlearn-profile-noauth"
            title={`You signed up with ${madeWith}, so this account has no password yet.`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
              fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="10.5" width="16" height="10" rx="2.5" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0" />
            </svg>
            <span>{`No password yet — you sign in with ${madeWith}`}</span>
          </span>
          <button
            type="button"
            className="inlearn-profile-password-change"
            disabled={isBusy}
            onClick={() => setIsForgotOpen(true)}
          >
            Set a password
          </button>
        </div>

        {/* The same dialog Forgot password opens, and for the same reason: the
            only thing that can stand in for a password nobody has is a code
            sent to the address on the account. It signs them in at the end,
            and from then on this row is the ordinary three-field one. */}
        {isForgotOpen
          ? createPortal(
              <ForgotPasswordDialog
                /* Handed in rather than merely prefilled: this person is
                   signed in, so the address is known and asking for it again
                   is a question with only one right answer. */
                lockedEmail={email}
                onClose={() => setIsForgotOpen(false)}
                onSignedIn={(signedIn) => {
                  setIsForgotOpen(false);
                  /* Said before the session is handed over, so the row turns
                     into the ordinary three-field one in the same paint as the
                     toast. Without it the page went on offering to set a
                     password that had just been set, until a reload. */
                  onPasswordSet?.();
                  onSessionChange?.(signedIn);
                  onToast?.({message: "Your password is set. You can now sign in with your email."});
                }}
              />,
              document.body,
            )
          : null}
      </>
    );
  }

  /* ------------------------------------------------- the ordinary three */

  if (!isOpen) {
    return (
      <div className="inlearn-profile-password">
          {/* Dots, and no eye. There is nothing to reveal: the password is
              hashed on the server and this browser has never held it. A field
              that offers to show something it does not have is a lie. */}
        <span className="inlearn-profile-dots" aria-label="Password">
          ••••••••
        </span>
        <button
          type="button"
          className="inlearn-profile-password-change"
          disabled={isBusy}
          onClick={() => setIsOpen(true)}
        >
          Change password
        </button>
      </div>
    );
  }

  return (
    <div className={`inlearn-profile-step-reveal${isClosing ? " is-closing" : ""}`}>
      <div className="inlearn-profile-step">
      <p className="inlearn-profile-step-title">Change your password</p>

      {/* "new-password" on the field asking for the CURRENT one, which reads
          wrong and is right.
       *
       * The honest value, "current-password", is an instruction: it tells the
       * browser this is the field to put the saved credential in, and once
       * somebody has saved one for this site it arrives here already filled.
       * That defeats the only thing this field is for. It is not a login - the
       * person is already signed in - it is the proof that whoever is sitting
       * at the keyboard is the account's owner rather than somebody who walked
       * up to an open laptop, and a proof the browser types for you proves
       * nothing.
       *
       * "new-password" is the one value Chrome reliably reads as "do not fill
       * this from what you have saved". */}
      <PasswordField
        placeholder="Current password"
        autoComplete="new-password"
        value={form.currentPassword}
        onChange={change("currentPassword")}
      />
      <PasswordField
        placeholder="New password"
        autoComplete="new-password"
        value={form.newPassword}
        onChange={change("newPassword")}
      />
      <PasswordField
        placeholder="Confirm new password"
        autoComplete="new-password"
        value={form.confirmation}
        onChange={change("confirmation")}
      />

      {problem ? <p className="inlearn-profile-note is-problem">{problem}</p> : null}

      <button
        type="button"
        className="inlearn-profile-forgot"
        onClick={() => setIsForgotOpen(true)}
      >
        {/* A key, so the control is recognised before it is read. */}
        <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" focusable="false"
          fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="12" r="4" />
          <path d="M12 12h9M18 12v3M15.5 12v2.2" />
        </svg>
        Forgot your password?
      </button>

      <div className="inlearn-profile-step-actions">
        <button type="button" className="inlearn-profile-ghost" onClick={close}>
          Cancel
        </button>
        {/* type="button" on both: this sits inside the profile form, and a
            submit here would save the profile instead. */}
        <button
          type="button"
          className="inlearn-profile-go"
          onClick={submit}
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : "Save password"}
        </button>
      </div>
      {isForgotOpen
        ? createPortal(
            <ForgotPasswordDialog
              initialEmail={email}
              onClose={() => setIsForgotOpen(false)}
              onSignedIn={(signedIn) => {
                setIsForgotOpen(false);
                setForm(EMPTY);
                setIsOpen(false);
                onSessionChange?.(signedIn);
                onToast?.({message: "Your password is reset and you are signed in."});
              }}
            />,
            document.body,
          )
        : null}
      </div>
    </div>
  );
}

export default PasswordChange;
