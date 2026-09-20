import {useState} from "react";

import {dialCodeFor} from "../data/countries.js";
import {getInlearnFirstPage} from "../inlearnContent.js";
import {logIn, providerSignInUrl, register, rememberProviderIntent} from "../services/authService.js";
import {
  checkEmail,
  checkPassword,
  checkPasswordMatch,
  checkRequired,
  firstProblem,
} from "../services/formValidation.js";
import AuthFields from "./AuthFields.jsx";
import AuthProviders from "./AuthProviders.jsx";
import AutofillDecoys from "./AutofillDecoys.jsx";
import ForgotPasswordDialog from "./ForgotPasswordDialog.jsx";
import InnotechLogo from "./InnotechLogo.jsx";
import {useNoAutofill} from "./useNoAutofill.js";
import {useProviderReturn} from "./useProviderReturn.js";

/* The sign-in panel.

   This file is now only what the panel decides: which tab is showing, what is
   in the form, what went wrong, and where a press goes. What the panel draws
   is in AuthFields and AuthProviders, and the two pieces of behaviour that are
   hard to get right have a file each - useNoAutofill and useProviderReturn -
   because each of them carries more explanation than code. */

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  region: "",
  password: "",
  passwordConfirmation: "",
};

function AuthSidebar({isOpen, mode, onClose, onModeChange, onSignedIn, onProviderError}) {
  const [form, setForm] = useState(emptyForm);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const {formRef, isGuarding} = useNoAutofill();
  const isLogin = mode === "login";

  useProviderReturn({
    onSignedIn,
    onError: (message) => {
      setError(message);
      onProviderError?.();
    },
  });

  const setField = (field) => (event) =>
    setForm((current) => ({...current, [field]: event.target.value}));

  const dialCode = dialCodeFor(form.region);

  /* Changing the region changes the calling code, so the digits typed under the
     old one are cleared rather than silently re-labelled: +49 912... is not the
     same number as +98 912... and keeping the tail would invent one. */
  const handleRegionChange = (region) =>
    setForm((current) => ({
      ...current,
      region,
      phone: region === current.region ? current.phone : "",
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const problem = firstProblem([
      isLogin ? "" : checkRequired(form.name, "name"),
      checkEmail(form.email),
      checkPassword(form.password, {isNew: !isLogin}),
      isLogin ? "" : checkPasswordMatch(form.password, form.passwordConfirmation),
    ]);
    if (problem) {
      setError(problem);
      return;
    }

    setError("");
    setIsBusy(true);
    try {
      const session = isLogin
        ? await logIn({email: form.email, password: form.password, remember})
        : await register({
            ...form,
            /* The field holds the national part; the server is given the number
               a person would dial from anywhere. */
            phone: form.phone.trim() ? `${dialCode}${form.phone.replace(/\D/g, "")}` : "",
            remember,
          });
      setForm(emptyForm);
      onSignedIn?.(session, isLogin ? "login" : "register");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsBusy(false);
    }
  };

  /* A full page redirect, not a fetch - the provider needs to show its own
     consent screen and Strapi holds the half of the exchange we must not ship
     to the browser. */
  const handleProviderSignIn = (provider) => {
    const url = providerSignInUrl(provider);
    if (!url) {
      setError("The INLEARN API is not connected yet.");
      return;
    }
    /* Remembered before leaving, because the return carries nothing that says
       which provider it came from - or that it is a return at all. */
    rememberProviderIntent(provider);
    window.location.assign(url);
  };

  return (
    <div className={`inlearn-auth-layer ${isOpen ? "is-open" : ""}`} aria-hidden={!isOpen}>
      <button
        type="button"
        className="inlearn-auth-backdrop"
        aria-label="Close authentication panel"
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
      />
      <aside className="inlearn-auth-sidebar" data-inlearn-auth>
        <InnotechLogo />
        <div className="inlearn-auth-heading">
          <h2>Get started</h2>
          <p>{getInlearnFirstPage().auth.intro}</p>
        </div>

        <div className="inlearn-auth-tabs" role="tablist" aria-label="Authentication mode">
          <span className={`inlearn-auth-tab-indicator ${isLogin ? "is-login" : "is-register"}`} />
          <button
            type="button"
            role="tab"
            aria-selected={isLogin}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => onModeChange("login")}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isLogin}
            tabIndex={isOpen ? 0 : -1}
            onClick={() => onModeChange("register")}
          >
            Register
          </button>
        </div>

        {/* noValidate: the grey system bubble is replaced by our own line below */}
        <form
          ref={formRef}
          className="inlearn-auth-form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          {isGuarding ? <AutofillDecoys /> : null}

          <AuthFields
            isLogin={isLogin}
            form={form}
            dialCode={dialCode}
            isOpen={isOpen}
            onFieldChange={setField}
            onRegionChange={handleRegionChange}
            onPhoneChange={(phone) => setForm((current) => ({...current, phone}))}
          />

          <label className="inlearn-remember">
            <input
              type="checkbox"
              checked={remember}
              tabIndex={isOpen ? 0 : -1}
              onChange={(event) => setRemember(event.target.checked)}
            />
            <span>Keep me signed in</span>
          </label>

          {/* Only on the Log in tab: someone creating an account has no password
              to have forgotten. */}
          {isLogin ? (
            <button
              type="button"
              className="inlearn-forgot"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsForgotOpen(true)}
            >
              Forgot password?
            </button>
          ) : null}

          {error ? (
            <p className="inlearn-auth-error" role="alert">
              {error}
            </p>
          ) : null}

          <button type="submit" className="inlearn-submit" disabled={isBusy} tabIndex={isOpen ? 0 : -1}>
            {isBusy ? "Please wait…" : isLogin ? "Log in" : "Register"}
          </button>
        </form>

        <AuthProviders isLogin={isLogin} isOpen={isOpen} onSignIn={handleProviderSignIn} />
      </aside>

      {/* Mounted only while open, so every visit starts clean without an effect
          resetting six pieces of state on the way in. */}
      {isForgotOpen ? (
        <ForgotPasswordDialog
          initialEmail={form.email}
          onClose={() => setIsForgotOpen(false)}
          onSignedIn={(session) => {
            setIsForgotOpen(false);
            onSignedIn?.(session, "login");
          }}
        />
      ) : null}
    </div>
  );
}

export default AuthSidebar;
