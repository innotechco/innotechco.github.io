import {useState} from "react";

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
 * The rules are the ones the sign-up panel uses, from formValidation, rather
 * than a second copy written here. The server applies them too; only the
 * server's copy is a guarantee, and this one is what makes the answer
 * immediate.
 */

const EMPTY = {currentPassword: "", newPassword: "", confirmation: ""};

function PasswordChange({isBusy, onToast}) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [problem, setProblem] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const change = (field) => (event) => {
    setForm((current) => ({...current, [field]: event.target.value}));
    setProblem("");
  };

  const close = () => {
    setIsOpen(false);
    setForm(EMPTY);
    setProblem("");
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
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="inlearn-profile-step">
      <p className="inlearn-profile-step-title">Change your password</p>

      <PasswordField
        placeholder="Current password"
        autoComplete="current-password"
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
    </div>
  );
}

export default PasswordChange;
